begin;

-- Social contacts chosen by a group creator are available only to people who
-- already belong to one of that creator's study groups.
drop policy if exists "Group members can view creator social contacts" on public.social_contacts;
create policy "Group members can view creator social contacts"
  on public.social_contacts for select to authenticated
  using (exists (
    select 1
    from public.study_groups
    join public.group_members
      on group_members.group_id = study_groups.id
    where study_groups.creator_id = social_contacts.user_id
      and group_members.user_id = (select auth.uid())
  ));

commit;
