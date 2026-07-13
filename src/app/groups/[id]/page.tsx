"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Clock, MapPin, Calendar, UserPlus, MessageCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProtectedRoute from "@/components/ProtectedRoute";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

interface GroupMember {
  id: string;
  user_id: string;
  joined_at: string;
  profiles: {
    name: string;
    email: string;
    course: string;
    year_level: string;
  };
}

interface GroupDetails {
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
  creator: {
    name: string;
    email: string;
    course: string;
    year_level: string;
  };
  group_members: GroupMember[];
}

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [group, setGroup] = useState<GroupDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  const groupId = params.id as string;

  useEffect(() => {
    async function fetchGroupDetails() {
      try {
        const { data, error } = await supabase
          .from('study_groups')
          .select(`
            *,
            creator:profiles!creator_id (
              name,
              email,
              course,
              year_level
            ),
            group_members (
              id,
              user_id,
              joined_at,
              profiles (
                name,
                email,
                course,
                year_level
              )
            )
          `)
          .eq('id', groupId)
          .single();

        if (error) {
          console.error('Error fetching group:', error);
          setError("Group not found");
          return;
        }

        console.log('Fetched group data:', data);
        console.log('Creator data:', data?.creator);
        setGroup(data);
      } catch (err) {
        console.error('Error:', err);
        setError("Failed to load group details");
      } finally {
        setLoading(false);
      }
    }

    if (groupId) {
      fetchGroupDetails();
    }
  }, [groupId]);

  const handleJoinGroup = async () => {
    if (!user || !group) return;

    try {
      setJoining(true);
      setError("");

      // Check if user is already a member
      const isAlreadyMember = group.group_members.some(
        member => member.user_id === user.id
      );

      if (isAlreadyMember) {
        setError("You are already a member of this group");
        return;
      }

      // Check if group is full
      if (group.group_members.length >= group.max_members) {
        setError("This group is already full");
        return;
      }

      const { error: joinError } = await supabase
        .from('group_members')
        .insert({
          group_id: group.id,
          user_id: user.id
        });

      if (joinError) {
        console.error('Error joining group:', joinError);
        setError(joinError.message || "Failed to join group");
        return;
      }

      // Refresh group data
      window.location.reload();
    } catch (err) {
      console.error('Error:', err);
      setError("Failed to join group");
    } finally {
      setJoining(false);
    }
  };

  const isCreator = user && group && group.creator_id === user.id;
  const isMember = user && group && group.group_members.some(
    member => member.user_id === user.id
  );
  const isFull = group && group.group_members.length >= group.max_members;

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-ink/15 border-t-purple-700"></div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">Opening the group record...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !group) {
    return (
      <ProtectedRoute>
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="py-12 text-center">
            <h2 className="mb-4 font-serif text-3xl font-medium text-ink">
              {error || "Group not found"}
            </h2>
            <Button onClick={() => window.history.length > 1 ? router.back() : router.push("/groups")}>
              <ArrowLeft />
              Back to groups
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {/* Header */}
        <div className="animate-fade-up mb-10">
          <button
            type="button"
            onClick={() => window.history.length > 1 ? router.back() : router.push("/groups")}
            className="mb-7 inline-flex cursor-pointer items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft transition-colors hover:text-purple-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to previous page
          </button>

          <div className="relative border border-ink/20 bg-[#fffcf5] p-5 shadow-[5px_5px_0_rgba(36,26,53,.10)] sm:p-8">
            <span aria-hidden className="absolute -top-2 left-10 h-4 w-20 -rotate-2 bg-marker/60" />
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-4 flex flex-wrap items-center gap-3">
              <Badge className="rounded-xs border border-purple-700/40 bg-transparent px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-purple-700">
                {group.subject}
              </Badge>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">Group record · {group.id.slice(0, 6)}</span>
              </div>
              <h1 className="mb-4 font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
                {group.name}
              </h1>
              <p className="max-w-3xl text-base leading-relaxed text-ink-soft sm:text-lg">
                {group.description}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-3">
              {!isMember && !isFull && (
                <Button
                  onClick={handleJoinGroup}
                  disabled={joining}
                  variant="primary"
                  size="lg"
                  className="h-10 px-5"
                >
                  <UserPlus />
                  {joining ? "Joining..." : "Join Group"}
                </Button>
              )}

              {isCreator && (
                <Button variant="primary" size="lg" className="h-10 px-5" asChild>
                  <Link href={`/groups/${group.id}/manage`}>
                    <Settings />
                    Manage Group
                  </Link>
                </Button>
              )}
            </div>
          </div>
          </div>

          {error && (
            <div className="mt-5 border border-red-700/30 bg-red-100/50 p-3">
              <p className="text-sm text-red-900">{error}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2 lg:flex">
            {/* Group Details */}
            <Card className="flex h-full flex-col rounded-sm border-ink/20 bg-[#fffcf5] shadow-[3px_3px_0_rgba(36,26,53,.08)] lg:flex-1">
              <CardHeader className="border-b border-ink/15 pb-4">
                <p className="mb-1 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-purple-700">Reference details</p>
                <CardTitle className="font-serif text-2xl font-medium">The essentials</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col p-0">
                <div className="grid grid-cols-1 sm:grid-cols-2">
                  <div className="flex items-center border-b border-r-0 border-dashed border-ink/15 p-4 sm:border-r">
                    <Clock className="mr-3 h-5 w-5 text-purple-700" />
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-soft">Frequency</p>
                      <p className="text-sm text-ink">{group.frequency}</p>
                    </div>
                  </div>

                  <div className="flex items-center border-b border-dashed border-ink/15 p-4">
                    <Calendar className="mr-3 h-5 w-5 text-purple-700" />
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-soft">Schedule</p>
                      <p className="text-sm text-ink">{group.schedule}</p>
                    </div>
                  </div>

                  <div className="flex items-center border-b border-r-0 border-dashed border-ink/15 p-4 sm:border-b-0 sm:border-r">
                    <MapPin className="mr-3 h-5 w-5 text-purple-700" />
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-soft">Platform</p>
                      <p className="text-sm text-ink">{group.platform}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4">
                    <Users className="mr-3 h-5 w-5 text-purple-700" />
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-soft">Members</p>
                      <p className="text-sm text-ink">
                        {group.group_members.length}/{group.max_members} members
                      </p>
                    </div>
                  </div>
                </div>

                {/* Creator Information */}
                <div className="mt-auto border-t border-ink/15 p-4">
                  <div className="flex items-center">
                    <div className="mr-3 grid h-9 w-9 place-items-center border border-purple-700/40 bg-purple-100/60 font-serif text-base font-semibold text-purple-700">
                      {group.creator?.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">
                        Created by {group.creator?.name || 'Unknown'}
                      </p>
                      <p className="text-xs text-ink-soft">
                        {group.creator?.course} • {group.creator?.year_level}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Members List */}
            <Card className="rounded-sm border-ink/20 bg-[#fffcf5] shadow-[3px_3px_0_rgba(36,26,53,.08)]">
              <CardHeader className="border-b border-ink/15 pb-4">
                <CardTitle className="flex items-center font-serif text-xl font-medium">
                  <Users className="mr-2 h-4 w-4 text-purple-700" />
                  Members ({group.group_members.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-0">
                  {group.group_members.map((member) => (
                    <div key={member.id} className="flex items-center space-x-3 border-b border-dashed border-ink/15 py-3 last:border-0">
                      <div className="grid h-8 w-8 shrink-0 place-items-center border border-purple-700/35 bg-purple-100/60 font-serif text-sm font-semibold text-purple-700">
                        {member.profiles?.name?.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-ink">
                          {member.profiles?.name || 'Unknown'}
                          {member.user_id === group.creator_id && (
                            <Badge variant="outline" className="ml-2 rounded-xs font-mono text-[8px] uppercase tracking-[0.08em]">
                              Creator
                            </Badge>
                          )}
                        </p>
                        <p className="truncate text-xs text-ink-soft">
                          {member.profiles?.course} • {member.profiles?.year_level}
                        </p>
                      </div>
                    </div>
                  ))}

                  {group.group_members.length === 0 && (
                    <p className="py-4 text-center text-sm text-ink-soft">
                      No members yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Progress */}
            <Card className="rounded-sm border-ink/20 bg-[#fffcf5] shadow-[3px_3px_0_rgba(36,26,53,.08)]">
              <CardHeader className="border-b border-ink/15 pb-4">
                <CardTitle className="font-serif text-xl font-medium">Capacity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">
                    <span>Members</span>
                    <span className="text-ink">{group.group_members.length}/{group.max_members}</span>
                  </div>
                  <div className="h-2 w-full bg-ink/10">
                    <div
                      className="h-2 bg-purple-700 transition-all duration-300"
                      style={{
                        width: `${(group.group_members.length / group.max_members) * 100}%`
                      }}
                    ></div>
                  </div>
                  <p className="text-center font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">
                    {isFull ? "Group is full!" : `${group.max_members - group.group_members.length} spots remaining`}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
