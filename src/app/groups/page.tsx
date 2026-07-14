"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, Plus, X, BookOpen } from "lucide-react";
import GroupCard from "@/components/GroupCard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { sanitizeInput } from "@/lib/inputSanitization";

const subjects = ["All Subjects", "Computer Science", "Mathematics", "Physics", "Chemistry", "Business", "Engineering"];
const frequencies = ["All Frequencies", "Daily", "Twice weekly", "Weekly", "Bi-weekly"];

// Interface matching GroupCard expectations
interface Group {
  id: string;
  name: string;
  subject: string;
  description: string;
  frequency: string;
  platform: string;
  members: number;
  maxMembers: number;
  schedule: string;
  tags: string[];
  creator_id: string;
  created_at: string;
  updated_at: string;
}

export default function Groups() {
  const { user, loading: authLoading } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedFrequency, setSelectedFrequency] = useState("All Frequencies");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch groups from Supabase
  useEffect(() => {
    // ProtectedRoute redirects anonymous visitors, but effects still run while
    // that redirect is being scheduled. Do not request member-only data first.
    if (authLoading) return;

    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchGroups() {
      try {
        const { data, error } = await supabase
          .from('study_groups')
          .select(`
            *,
            group_members(user_id),
            tags(name)
          `);

        if (error) {
          console.error('Error fetching groups:', error);
          return;
        }

        // Transform data to match GroupCard interface
        const groupsWithMembers = data?.map(group => ({
          ...group,
          members: group.group_members?.length || 0,
          maxMembers: group.max_members,
          tags: group.tags?.map((tag: any) => tag.name) || []
        })) || [];

        setGroups(groupsWithMembers);
      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchGroups();
  }, [authLoading, user]);

  const filteredGroups = groups.filter((group: any) => {
    const matchesSearch = group.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSubject = selectedSubject === "All Subjects" || group.subject === selectedSubject;
    const matchesFrequency = selectedFrequency === "All Frequencies" || group.frequency === selectedFrequency;

    return matchesSearch && matchesSubject && matchesFrequency;
  });

  const hasActiveFilters = Boolean(
    searchTerm || selectedSubject !== "All Subjects" || selectedFrequency !== "All Frequencies"
  );

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSubject("All Subjects");
    setSelectedFrequency("All Frequencies");
  };

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      {/* Header */}
      <div className="animate-fade-up mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-4xl">
          <p className="mb-3 flex items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft">
            <span aria-hidden className="h-px w-9 bg-purple-700/60" />
            The open catalog · Volume 01
          </p>
          <h1 className="mb-3 font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Find your <em className="highlight-marker italic text-purple-700">study circle</em>.
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
            Browse student-led groups by subject, schedule, and shared goals. Your next
            breakthrough may be one conversation away.
          </p>
        </div>
        <Button asChild size="lg" className="group h-10 w-full rounded-sm px-5 text-sm sm:w-auto">
          <Link href="/create-group">
            <Plus className="transition-transform group-hover:rotate-90" />
            Create a group
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <section aria-label="Search and filter study groups" className="catalog-toolbar animate-fade-up [animation-delay:100ms]">
        <div className="catalog-toolbar__row">
          {/* Search */}
          <div className="catalog-toolbar__search relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-ink-soft" />
            <Input
              type="text"
              placeholder="Search groups by name, description, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(sanitizeInput(e.target.value, { maxLength: 100 }))}
              className="h-10 rounded-sm border-ink/25 bg-paper pl-10 text-sm shadow-none"
            />
          </div>

          {/* Filter Button */}
          <Button
            type="button"
            size="lg"
            variant={showFilters ? "outline" : "primary"}
            onClick={() => setShowFilters(!showFilters)}
            aria-expanded={showFilters}
            className="catalog-toolbar__filter h-10 rounded-sm px-4"
          >
            {showFilters ? <X /> : <SlidersHorizontal />}
            <span>{showFilters ? "Close" : "Filters"}</span>
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="animate-fade-up mt-3 border-t border-dashed border-ink/20 pt-3">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
                  Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="h-12 w-full rounded-sm border border-ink/25 bg-paper px-3 text-sm"
                >
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
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
                  className="h-12 w-full rounded-sm border border-ink/25 bg-paper px-3 text-sm"
                >
                  {frequencies.map((frequency) => (
                    <option key={frequency} value={frequency}>
                      {frequency}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Results Count */}
      {!loading && (
        <div className="catalog-results-toolbar">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-ink-soft">
            Catalog results · {String(filteredGroups.length).padStart(2, "0")} group{filteredGroups.length !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button type="button" onClick={clearFilters} className="inline-flex w-fit items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-purple-700 underline decoration-purple-700/35 underline-offset-4 hover:decoration-purple-700">
                <X className="h-3.5 w-3.5" /> Clear search & filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-2 border-ink/15 border-t-purple-700"></div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">Opening the catalog...</p>
        </div>
      ) : (
        /* Groups Grid */
        <div className="animate-fade-up grid gap-6 [animation-delay:160ms] md:grid-cols-2 lg:grid-cols-3">
          {filteredGroups.map((group) => (
            <GroupCard key={group.id} group={group} layout="card" />
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && filteredGroups.length === 0 && (
        <div className="animate-fade-up py-16 text-center sm:py-24">
          <div className="mx-auto mb-6 grid h-20 w-20 -rotate-2 place-items-center border border-dashed border-ink/30 bg-marker/20">
            {hasActiveFilters ? <Search className="h-10 w-10 text-ink-soft" /> : <BookOpen className="h-10 w-10 text-ink-soft" />}
          </div>
          <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-purple-700">Catalog note · 000</p>
          <h3 className="mb-3 font-serif text-2xl font-medium text-ink sm:text-3xl">
            {hasActiveFilters ? "No matching study circles" : "The shelves are waiting"}
          </h3>
          <p className="mx-auto mb-8 max-w-lg leading-relaxed text-ink-soft">
            {hasActiveFilters
              ? "Try a broader search, clear your filters, or begin a group of your own."
              : "Be the first to add a study group and invite others to learn alongside you."}
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            {hasActiveFilters && <Button variant="outline" size="lg" onClick={clearFilters} className="h-12 rounded-sm px-6">Clear filters</Button>}
            <Button asChild size="lg" className="group h-12 rounded-sm px-6 shadow-[0.25rem_0.25rem_0_0_#241a35] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[0.1rem_0.1rem_0_0_#241a35]">
              <Link href="/create-group"><Plus className="transition-transform group-hover:rotate-90" />Create a group</Link>
            </Button>
          </div>
        </div>
      )}
      </div>
    </ProtectedRoute>
  );
}
