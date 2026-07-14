begin;

-- A group owner can manage every membership in a group they created, while
-- members remain able to leave groups themselves.
drop policy if exists "Group owners can remove members" on public.group_members;
create policy "Group owners can remove members"
  on public.group_members for delete to authenticated
  using (exists (
    select 1
    from public.study_groups
    where study_groups.id = group_members.group_id
      and study_groups.creator_id = (select auth.uid())
  ));

commit;
