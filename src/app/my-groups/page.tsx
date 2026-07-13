"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, Users, Clock, MapPin, Plus, Settings, Crown, Calendar, BookOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProtectedRoute from "@/components/ProtectedRoute";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { sanitizeInput } from "@/lib/inputSanitization";

interface MyGroup {
  id: string;
  name: string;
  subject: string;
  description: string;
  frequency: string;
  platform: string;
  schedule: string;
  max_members: number;
  creator_id: string;
  created_at: string;
  updated_at: string;
  member_count: number;
  is_creator: boolean;
  joined_at: string;
}

export default function MyGroupsPage() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<MyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "created" | "joined">("all");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedFrequency, setSelectedFrequency] = useState("All Frequencies");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function fetchMyGroups() {
      if (!user) return;

      try {
        // Get all groups where user is a member
        const { data, error } = await supabase
          .from('group_members')
          .select(`
            joined_at,
            study_groups (
              id,
              name,
              subject,
              description,
              frequency,
              platform,
              schedule,
              max_members,
              creator_id,
              created_at,
              updated_at
            )
          `)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching my groups:', error);
          return;
        }

        // Transform data and add member counts
        const groupsWithCounts = await Promise.all(
          (data || []).map(async (item: any) => {
            const group = item.study_groups;
            if (!group) return null;

            // Get member count for this group
            const { count } = await supabase
              .from('group_members')
              .select('*', { count: 'exact', head: true })
              .eq('group_id', group.id);

            return {
              ...group,
              member_count: count || 0,
              is_creator: group.creator_id === user.id,
              joined_at: item.joined_at,
            } as MyGroup;
          })
        );

        const validGroups = groupsWithCounts.filter(Boolean) as MyGroup[];
        setGroups(validGroups);
      } catch (err) {
        console.error('Error fetching groups:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMyGroups();
  }, [user]);

  const filteredGroups = groups.filter((group) => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "created" && group.is_creator) ||
      (filter === "joined" && !group.is_creator);

    const matchesSubject =
      selectedSubject === "All Subjects" || group.subject === selectedSubject;

    const matchesFrequency =
      selectedFrequency === "All Frequencies" || group.frequency === selectedFrequency;

    return matchesSearch && matchesFilter && matchesSubject && matchesFrequency;
  });

  const createdGroups = groups.filter(group => group.is_creator);
  const joinedGroups = groups.filter(group => !group.is_creator);
  const subjects = ["All Subjects", ...Array.from(new Set(groups.map((group) => group.subject).filter(Boolean))).sort()];
  const frequencies = ["All Frequencies", ...Array.from(new Set(groups.map((group) => group.frequency).filter(Boolean))).sort()];

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-ink/15 border-t-purple-700"></div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">Reading your ledger...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {/* Header */}
        <div className="animate-fade-up mb-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 flex items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-soft"><span className="h-px w-8 bg-purple-700/60" />Personal ledger · Vol. 01</p>
              <h1 className="mb-1 font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
                My Study Groups
              </h1>
              <p className="text-ink-soft">
                Manage and track all your study groups in one place
              </p>
            </div>

            <div className="w-full lg:w-auto">
              <Button asChild variant="primary" size="lg" className="group h-12 w-full rounded-sm px-6 text-sm shadow-[0.25rem_0.25rem_0_0_#241a35] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[0.1rem_0.1rem_0_0_#241a35] lg:w-auto">
                <Link href="/create-group">
                  <Plus className="transition-transform group-hover:rotate-90" />
                  Create New Group
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-7 grid grid-cols-1 border-y border-ink/20 bg-[#fffcf5] sm:grid-cols-3">
          <Card className="rounded-none border-0 border-b border-ink/15 bg-transparent shadow-none sm:border-r sm:border-b-0">
            <CardContent className="p-3.5">
              <div className="flex items-center">
                <div className="grid h-8 w-8 place-items-center border border-purple-700/25 bg-purple-100/60">
                  <Users className="h-4 w-4 text-purple-700" />
                </div>
                <div className="ml-3 flex flex-1 items-baseline justify-between gap-3 sm:block">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-soft">Total</p>
                  <p className="font-serif text-2xl leading-none text-ink">{groups.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none border-0 border-b border-ink/15 bg-transparent shadow-none sm:border-r sm:border-b-0">
            <CardContent className="p-3.5">
              <div className="flex items-center">
                <div className="grid h-8 w-8 place-items-center border border-green-700/25 bg-green-100/60">
                  <Crown className="h-4 w-4 text-green-700" />
                </div>
                <div className="ml-3 flex flex-1 items-baseline justify-between gap-3 sm:block">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-soft">Created</p>
                  <p className="font-serif text-2xl leading-none text-ink">{createdGroups.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none border-0 bg-transparent shadow-none">
            <CardContent className="p-3.5">
              <div className="flex items-center">
                <div className="grid h-8 w-8 place-items-center border border-blue-700/25 bg-blue-100/60">
                  <BookOpen className="h-4 w-4 text-blue-700" />
                </div>
                <div className="ml-3 flex flex-1 items-baseline justify-between gap-3 sm:block">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-soft">Joined</p>
                  <p className="font-serif text-2xl leading-none text-ink">{joinedGroups.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="catalog-toolbar rounded-sm">
          <CardContent className="p-0">
            <div className="catalog-toolbar__row">
              {/* Search */}
              <div className="catalog-toolbar__search">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search your groups..."
                    value={searchTerm}
                                            onChange={(e) => setSearchTerm(sanitizeInput(e.target.value, { maxLength: 100 }))}
                    className="h-10 border-ink/25 bg-paper pl-10"
                  />
                </div>
              </div>

              {/* Filter Toggle */}
              <Button
                size="lg"
                variant={showFilters ? "outline" : "primary"}
                onClick={() => setShowFilters(!showFilters)}
                aria-expanded={showFilters}
                className="catalog-toolbar__filter h-10 rounded-sm px-4"
              >
                {showFilters ? <X /> : <SlidersHorizontal />}
                {showFilters ? "Close" : "Filters"}
              </Button>
            </div>

            {showFilters && (
              <div className="animate-fade-up mt-3 border-t border-dashed border-ink/20 pt-3">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
                      Subject
                    </label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="h-12 w-full rounded-sm border border-ink/25 bg-paper px-3 text-sm focus:border-purple-700 focus:ring-purple-700"
                    >
                      {subjects.map((subject) => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
                      Meeting Frequency
                    </label>
                    <select
                      value={selectedFrequency}
                      onChange={(e) => setSelectedFrequency(e.target.value)}
                      className="h-12 w-full rounded-sm border border-ink/25 bg-paper px-3 text-sm focus:border-purple-700 focus:ring-purple-700"
                    >
                      {frequencies.map((frequency) => (
                        <option key={frequency} value={frequency}>{frequency}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
                      Group Relationship
                    </label>
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value as typeof filter)}
                      className="h-12 w-full rounded-sm border border-ink/25 bg-paper px-3 text-sm focus:border-purple-700 focus:ring-purple-700"
                    >
                      <option value="all">All groups ({groups.length})</option>
                      <option value="created">Created by me ({createdGroups.length})</option>
                      <option value="joined">Joined groups ({joinedGroups.length})</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {filteredGroups.length > 0 && (
          <div className="catalog-results-toolbar">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-soft">{String(filteredGroups.length).padStart(2, "0")} ledger entries</p>
          </div>
        )}

        {/* Groups Grid */}
        {filteredGroups.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredGroups.map((group) => (
              <MyGroupCard key={group.id} group={group} layout="card" />
            ))}
          </div>
        ) : (
          <div className="py-14 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 -rotate-2 place-items-center border border-dashed border-ink/30 bg-marker/20"><Users className="h-7 w-7 text-ink-soft" /></div>
            <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-purple-700">Ledger entry · 000</p>
            <h3 className="mb-2 font-serif text-2xl font-medium text-ink">
              {searchTerm || filter !== "all" || selectedSubject !== "All Subjects" || selectedFrequency !== "All Frequencies"
                ? "No groups found"
                : "You haven't joined any groups yet"}
            </h3>
            <p className="mb-5 text-sm text-ink-soft">
              {searchTerm || filter !== "all" || selectedSubject !== "All Subjects" || selectedFrequency !== "All Frequencies"
                ? "Try adjusting your search criteria or filters."
                : "Start by creating your own group or joining existing ones!"}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="primary" size="lg" className="group h-12 rounded-sm px-6 shadow-[0.25rem_0.25rem_0_0_#241a35] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[0.1rem_0.1rem_0_0_#241a35]">
                <Link href="/create-group">
                  <Plus className="transition-transform group-hover:rotate-90" />
                  Create New Group
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 rounded-sm px-6">
                <Link href="/groups">
                  <Search />
                  Browse Groups
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

function MyGroupCard({ group, layout = "card" }: { group: MyGroup; layout?: "card" | "list" }) {
  const progressPercentage = (group.member_count / group.max_members) * 100;

  if (layout === "list") {
    return (
      <Card className="min-h-27 rounded-sm border border-ink/20 bg-[#fffcf5] transition-all hover:border-purple-700/40 hover:shadow-[3px_3px_0_rgba(36,26,53,.1)]">
        <div className="grid min-h-27 gap-3 p-3 sm:grid-cols-[minmax(12rem,1fr)_minmax(14rem,1.15fr)_auto] sm:items-center sm:p-4">
          <div className="min-w-0">
            <div className="mb-1.5 flex items-center gap-2"><Badge className="rounded-xs border-purple-700/35 bg-transparent px-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-purple-700">{group.subject}</Badge>{group.is_creator && <Crown className="h-3.5 w-3.5 text-green-700" />}</div>
            <h3 className="truncate font-serif text-lg font-medium text-ink">{group.name}</h3>
          </div>
          <div className="min-w-0 space-y-1 text-xs text-ink-soft">
            <p className="flex items-center truncate"><Clock className="mr-2 h-3.5 w-3.5 shrink-0 text-purple-700" />{group.frequency} · {group.schedule}</p>
            <p className="flex items-center truncate"><Users className="mr-2 h-3.5 w-3.5 shrink-0 text-purple-700" />{group.member_count}/{group.max_members} members · {group.platform}</p>
          </div>
          <div className="flex gap-2 sm:w-36">
            <Button variant="primary" size="sm" className="flex-1" asChild><Link href={`/groups/${group.id}`}>Details</Link></Button>
            {group.is_creator && <Button variant="outline" size="icon" className="border-purple-700/45 bg-purple-100/45 text-purple-700 hover:border-purple-700 hover:bg-purple-100 hover:text-purple-700" asChild><Link href={`/groups/${group.id}/manage`} aria-label={`Manage ${group.name}`}><Settings /></Link></Button>}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-sm border border-ink/20 bg-[#fffcf5] transition-all duration-200 hover:-translate-y-0.5 hover:border-purple-700/40 hover:shadow-[3px_3px_0_rgba(36,26,53,.1)]">
      <CardHeader className="p-4 pb-2">
        <div className="mb-2 flex items-start justify-between">
          <Badge className="rounded-xs border border-purple-700/35 bg-transparent px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em] text-purple-700">
            {group.subject}
          </Badge>
          <div className="flex items-center gap-1.5">
            {group.is_creator && (
              <Badge variant="outline" className="rounded-xs border-green-700/30 bg-green-50 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-widest text-green-700">
                <Crown className="h-2.5 w-2.5" />
                <span className="hidden sm:inline">Creator</span>
              </Badge>
            )}
            <div className="font-mono text-[9px] text-ink-soft">
              {Math.round(progressPercentage)}%
            </div>
          </div>
        </div>
        <CardTitle className="font-serif text-lg font-medium leading-tight text-ink">
          {group.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 space-y-3 px-4 pb-3">
        {/* Description */}
        <p className="line-clamp-2 text-xs leading-relaxed text-ink-soft">
          {group.description}
        </p>

        {/* Details */}
        <div>
          <div className="flex items-center border-b border-dashed border-ink/15 py-1 text-[11px] text-ink-soft">
            <Clock className="mr-2 h-3 w-3 shrink-0 text-purple-700" />
            <span className="truncate">{group.frequency} • {group.schedule}</span>
          </div>
          <div className="flex items-center border-b border-dashed border-ink/15 py-1 text-[11px] text-ink-soft">
            <MapPin className="mr-2 h-3 w-3 shrink-0 text-purple-700" />
            <span className="truncate">{group.platform}</span>
          </div>
          <div className="flex items-center border-b border-dashed border-ink/15 py-1 text-[11px] text-ink-soft">
            <Calendar className="mr-2 h-3 w-3 shrink-0 text-purple-700" />
            <span className="truncate">
              Joined {new Date(group.joined_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Members Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.08em]">
            <span className="flex items-center text-ink">
              <Users className="mr-1 h-3 w-3 text-purple-700" />
              {group.member_count}/{group.max_members} members
            </span>
          </div>
          <div className="h-1 w-full bg-ink/10">
            <div
              className="h-1 bg-purple-700 transition-all duration-500"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
        </div>
      </CardContent>

      <div className="mt-auto flex gap-2 p-4 pt-0">
        <Button
          variant="primary"
          size="lg"
          className="h-9 flex-1 px-4"
          asChild
        >
          <Link href={`/groups/${group.id}`}>
            <span className="hidden sm:inline">View Details</span>
            <span className="sm:hidden">View</span>
          </Link>
        </Button>
        {group.is_creator && (
          <Button
            variant="outline"
            size="lg"
            className="h-9 w-9 border-purple-700/45 bg-purple-100/45 text-purple-700 hover:border-purple-700 hover:bg-purple-100 hover:text-purple-700"
            asChild
          >
            <Link href={`/groups/${group.id}/manage`}>
              <Settings className="h-3.5 w-3.5" />
            </Link>
          </Button>
        )}
      </div>
    </Card>
  );
}
