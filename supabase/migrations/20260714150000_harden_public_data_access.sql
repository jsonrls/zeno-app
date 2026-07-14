begin;

-- Browser clients must only receive the least privilege required by the app.
revoke all privileges on table public.profiles from public, anon, authenticated;
revoke all privileges on table public.social_contacts from public, anon, authenticated;
revoke all privileges on table public.group_members from public, anon, authenticated;
revoke all privileges on table public.study_groups from public, anon, authenticated;
revoke all privileges on table public.tags from public, anon, authenticated;
revoke all privileges on table public.group_meeting_links from public, anon, authenticated;
revoke all privileges on table public.problem_reports from public, anon, authenticated;
revoke all privileges on table public.problem_report_stats from public, anon, authenticated;

grant select, insert on table public.profiles to authenticated;
grant update (email, name, username, course, year_level, bio, avatar_url) on table public.profiles to authenticated;
grant select, insert, update, delete on table public.social_contacts to authenticated;
grant select, insert, delete on table public.group_members to authenticated;
grant select, insert, update, delete on table public.study_groups to authenticated;
grant select, insert, update, delete on table public.tags to authenticated;
grant select, insert, update, delete on table public.group_meeting_links to authenticated;
grant insert on table public.problem_reports to anon;
grant select, insert, update, delete on table public.problem_reports to authenticated;

-- Replace permissive public policies with authenticated, ownership-scoped ones.
drop policy if exists "Profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Authenticated users can view profiles"
  on public.profiles for select to authenticated
  using (true);
create policy "Users can insert own profile"
  on public.profiles for insert to authenticated
  with check ((select auth.uid()) = id);
create policy "Users can update own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "Social contacts are viewable by everyone" on public.social_contacts;
drop policy if exists "Users can manage own social contacts" on public.social_contacts;
create policy "Users can manage own social contacts"
  on public.social_contacts for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Group members are viewable by everyone" on public.group_members;
drop policy if exists "Authenticated users can join groups" on public.group_members;
drop policy if exists "Users can leave groups" on public.group_members;
create policy "Authenticated users can view group members"
  on public.group_members for select to authenticated
  using (true);
create policy "Users can join themselves to groups"
  on public.group_members for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Users can leave groups"
  on public.group_members for delete to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Study groups are viewable by everyone" on public.study_groups;
drop policy if exists "Authenticated users can create study groups" on public.study_groups;
drop policy if exists "Users can update own study groups" on public.study_groups;
drop policy if exists "Users can delete own study groups" on public.study_groups;
create policy "Authenticated users can view study groups"
  on public.study_groups for select to authenticated
  using (true);
create policy "Users can create own study groups"
  on public.study_groups for insert to authenticated
  with check ((select auth.uid()) = creator_id);
create policy "Users can update own study groups"
  on public.study_groups for update to authenticated
  using ((select auth.uid()) = creator_id)
  with check ((select auth.uid()) = creator_id);
create policy "Users can delete own study groups"
  on public.study_groups for delete to authenticated
  using ((select auth.uid()) = creator_id);

drop policy if exists "Tags are viewable by everyone" on public.tags;
drop policy if exists "Group creators can manage tags" on public.tags;
create policy "Authenticated users can view tags"
  on public.tags for select to authenticated
  using (true);
create policy "Group creators can manage tags"
  on public.tags for all to authenticated
  using (exists (
    select 1 from public.study_groups
    where study_groups.id = tags.group_id
      and study_groups.creator_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.study_groups
    where study_groups.id = tags.group_id
      and study_groups.creator_id = (select auth.uid())
  ));

drop policy if exists "Anonymous users can insert problem reports" on public.problem_reports;
drop policy if exists "Users can insert problem reports" on public.problem_reports;
drop policy if exists "Only admins can view problem reports" on public.problem_reports;
drop policy if exists "Only admins can update problem reports" on public.problem_reports;
drop policy if exists "Only admins can delete problem reports" on public.problem_reports;
create policy "Anonymous users can submit anonymous reports"
  on public.problem_reports for insert to anon
  with check (user_id is null);
create policy "Users can submit their own reports"
  on public.problem_reports for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Admins can view problem reports"
  on public.problem_reports for select to authenticated
  using (exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
  ));
create policy "Admins can update problem reports"
  on public.problem_reports for update to authenticated
  using (exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
  ))
  with check (exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
  ));
create policy "Admins can delete problem reports"
  on public.problem_reports for delete to authenticated
  using (exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
  ));

-- Trigger functions run under their owner and never need to be callable through RPC.
revoke all on function public.get_user_profile(uuid) from public, anon, authenticated;
revoke all on function public.handle_updated_at() from public, anon, authenticated;
revoke all on function public.rls_auto_enable() from public, anon, authenticated;
revoke all on function public.update_updated_at_column() from public, anon, authenticated;

-- Permit unauthenticated sign-up to test a username without exposing profiles.
create or replace function public.is_username_available(candidate_username text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select candidate_username ~ '^[a-z0-9_]{3,24}$'
    and not exists (
      select 1
      from public.profiles
      where username = lower(candidate_username)
    );
$$;
revoke all on function public.is_username_available(text) from public;
grant execute on function public.is_username_available(text) to anon, authenticated;

-- Enforce capacity at the database boundary and serialize concurrent joins.
create or replace function public.enforce_group_member_capacity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  allowed_members integer;
begin
  select max_members
    into allowed_members
    from public.study_groups
   where id = new.group_id
   for update;

  if allowed_members is null then
    raise exception 'Study group does not exist';
  end if;

  if (select count(*) from public.group_members where group_id = new.group_id) >= allowed_members then
    raise exception 'This study group is already full';
  end if;

  return new;
end;
$$;
revoke all on function public.enforce_group_member_capacity() from public, anon, authenticated;
drop trigger if exists enforce_group_member_capacity on public.group_members;
create trigger enforce_group_member_capacity
before insert on public.group_members
for each row execute function public.enforce_group_member_capacity();

commit;
