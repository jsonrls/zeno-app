"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, Users, Plus, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GroupCard from "@/components/GroupCard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { supabase } from "@/lib/supabase";
import { sanitizeInput } from "@/lib/inputSanitization";

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

const subjects = ["All Subjects", "Computer Science", "Mathematics", "Physics", "Chemistry", "Biology", "Engineering", "Business"];
const frequencies = ["All Frequencies", "Daily", "Twice weekly", "Weekly", "Bi-weekly"];

export default function Dashboard() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedFrequency, setSelectedFrequency] = useState("All Frequencies");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch groups from Supabase
  useEffect(() => {
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
  }, []);

  const filteredGroups = groups.filter((group: any) => {
    const matchesSearch = group.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubject === "All Subjects" || group.subject === selectedSubject;
    const matchesFrequency = selectedFrequency === "All Frequencies" || group.frequency === selectedFrequency;

    return matchesSearch && matchesSubject && matchesFrequency;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentGroups = filteredGroups.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSubject, selectedFrequency]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {/* Header */}
        <div className="animate-fade-up mb-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 flex items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft">
                <span aria-hidden className="h-px w-9 bg-purple-700/60" />
                Your study desk
              </p>
              <h1 className="mb-2 font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
                Dashboard
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
                Discover and join study groups that match your interests
              </p>
            </div>

            {/* Create Group Button */}
            <div className="w-full lg:w-auto">
              <Button asChild variant="primary" size="lg" className="group h-12 w-full rounded-sm px-6 text-sm shadow-[0.25rem_0.25rem_0_0_#241a35] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[0.1rem_0.1rem_0_0_#241a35] lg:w-auto">
                <Link href="/create-group">
                  <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                  Create New Group
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="catalog-toolbar animate-fade-up [animation-delay:100ms]">
          <div className="catalog-toolbar__row">
            {/* Search */}
            <div className="catalog-toolbar__search">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-ink-soft" />
                </div>
                <Input
                  type="text"
                  placeholder="Search groups, subjects, or topics..."
                  value={searchTerm}
                                          onChange={(e) => setSearchTerm(sanitizeInput(e.target.value, { maxLength: 100 }))}
                  className="h-10 rounded-sm border-ink/25 bg-paper pl-10 text-sm shadow-none"
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
              {showFilters ? <X className="h-4 w-4" /> : <SlidersHorizontal className="h-4 w-4" />}
              {showFilters ? "Close" : "Filters"}
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-3 border-t border-dashed border-ink/20 pt-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
                    Frequency
                  </label>
                  <select
                    value={selectedFrequency}
                    onChange={(e) => setSelectedFrequency(e.target.value)}
                    className="h-12 w-full rounded-sm border border-ink/25 bg-paper px-3 text-sm focus:border-purple-700 focus:ring-purple-700"
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
        </div>

        {/* Results Info */}
        {!loading && filteredGroups.length > 0 && (
          <div className="catalog-results-toolbar font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">
            <p>
              Showing {startIndex + 1}-{Math.min(endIndex, filteredGroups.length)} of {filteredGroups.length} groups
            </p>
            <p>Page {currentPage} of {totalPages}</p>
          </div>
        )}

        {/* Groups Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-2 border-ink/15 border-t-purple-700"></div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">Consulting the catalog...</p>
          </div>
        ) : currentGroups.length > 0 ? (
          <>
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {currentGroups.map((group) => (
                <GroupCard key={group.id} group={group} layout="card" />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <nav aria-label="Study groups pagination" className="flex flex-wrap items-center justify-center gap-2 border-t border-ink/15 pt-8">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-10 rounded-sm"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    const showPage =
                      page === 1 ||
                      page === totalPages ||
                      page === currentPage ||
                      (page >= currentPage - 1 && page <= currentPage + 1);

                    if (!showPage) {
                      // Show ellipsis
                      if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="px-2 font-mono text-ink-soft">…</span>;
                      }
                      return null;
                    }

                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "primary" : "outline"}
                        onClick={() => handlePageChange(page)}
                        aria-label={`Go to page ${page}`}
                        aria-current={currentPage === page ? "page" : undefined}
                        className={`h-10 w-10 rounded-sm p-0 ${currentPage === page ? "shadow-[2px_2px_0_#241a35]" : ""}`}
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-10 rounded-sm"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </nav>
            )}
          </>
        ) : (
          <div className="animate-fade-up py-16 text-center sm:py-24">
            <div className="mx-auto mb-6 grid h-20 w-20 -rotate-2 place-items-center border border-dashed border-ink/30 bg-marker/20">
              <Users className="h-10 w-10 text-ink-soft" />
            </div>
            <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-purple-700">Catalog note · 000</p>
            <h3 className="mb-3 font-serif text-2xl font-medium text-ink sm:text-3xl">
              {searchTerm || selectedSubject !== "All Subjects" || selectedFrequency !== "All Frequencies"
                ? "No study groups found"
                : "No study groups yet"}
            </h3>
            <p className="mx-auto mb-8 max-w-lg leading-relaxed text-ink-soft">
              {searchTerm || selectedSubject !== "All Subjects" || selectedFrequency !== "All Frequencies"
                ? "Try adjusting your search criteria or create a new study group."
                : "Be the first to create a study group and start learning together!"}
            </p>
            <Button asChild variant="primary" size="lg" className="group h-12 rounded-sm px-6 shadow-[0.25rem_0.25rem_0_0_#241a35] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[0.1rem_0.1rem_0_0_#241a35]">
              <Link href="/create-group">
                <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                Create New Group
              </Link>
            </Button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
