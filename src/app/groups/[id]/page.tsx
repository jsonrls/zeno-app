"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Clock, MapPin, Calendar, UserPlus, UserMinus, MessageCircle, Settings, X, ExternalLink, Facebook, Instagram, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import ProtectedRoute from "@/components/ProtectedRoute";
import { supabase, type SocialContact } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

interface GroupMember {
  id: string;
  user_id: string;
  joined_at: string;
  profiles: {
    name: string;
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
    course: string;
    year_level: string;
  };
  group_members: GroupMember[];
}

const socialContactIcons = {
  WhatsApp: Phone,
  Instagram,
  Facebook,
  Messenger: MessageCircle,
} as const;

function getSafeExternalUrl(value: string | null | undefined): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [group, setGroup] = useState<GroupDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [joinConfirmation, setJoinConfirmation] = useState("");
  const [showUnjoinDialog, setShowUnjoinDialog] = useState(false);
  const [unjoinConfirmation, setUnjoinConfirmation] = useState("");
  const [unjoining, setUnjoining] = useState(false);
  const [meetingLink, setMeetingLink] = useState<string | null>(null);
  const [creatorContacts, setCreatorContacts] = useState<SocialContact[]>([]);

  const groupId = params.id as string;
  const userId = user?.id;

  useEffect(() => {
    async function fetchGroupDetails() {
      try {
        setMeetingLink(null);
        setCreatorContacts([]);
        const { data, error } = await supabase
          .from('study_groups')
          .select(`
            *,
            creator:profiles!creator_id (
              name,
              course,
              year_level
            ),
            group_members (
              id,
              user_id,
              joined_at,
              profiles (
                name,
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

        const isCurrentUserMember = Boolean(userId && data.group_members.some(
          (member: GroupMember) => member.user_id === userId
        ));

        if (isCurrentUserMember) {
          const [meetingLinkResult, creatorContactsResult] = await Promise.all([
            supabase
              .from("group_meeting_links")
              .select("meeting_link")
              .eq("group_id", data.id)
              .maybeSingle(),
            supabase
              .from("social_contacts")
              .select("id, user_id, platform, username, url, created_at, updated_at")
              .eq("user_id", data.creator_id)
              .order("created_at", { ascending: true }),
          ]);

          if (meetingLinkResult.error) {
            console.error("Error loading meeting link:", meetingLinkResult.error);
          } else {
            setMeetingLink(getSafeExternalUrl(meetingLinkResult.data?.meeting_link ?? null));
          }

          if (creatorContactsResult.error) {
            console.error("Error loading creator contacts:", creatorContactsResult.error);
          } else {
            setCreatorContacts(creatorContactsResult.data ?? []);
          }
        }
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
  }, [groupId, userId]);

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
        setShowJoinDialog(false);
        return;
      }

      // Check if group is full
      if (group.group_members.length >= group.max_members) {
        setError("This group is already full");
        setShowJoinDialog(false);
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
        setShowJoinDialog(false);
        return;
      }

      // Refresh group data
      window.location.reload();
    } catch (err) {
      console.error('Error:', err);
      setError("Failed to join group");
      setShowJoinDialog(false);
    } finally {
      setJoining(false);
    }
  };

  const handleUnjoinGroup = async () => {
    if (!user || !group || group.creator_id === user.id) return;

    try {
      setUnjoining(true);
      setError("");

      const { error: unjoinError } = await supabase
        .from("group_members")
        .delete()
        .eq("group_id", group.id)
        .eq("user_id", user.id);

      if (unjoinError) {
        console.error("Error leaving group:", unjoinError);
        setError(unjoinError.message || "Failed to leave group");
        setShowUnjoinDialog(false);
        return;
      }

      window.location.reload();
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to leave group");
      setShowUnjoinDialog(false);
    } finally {
      setUnjoining(false);
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
              {!isCreator && isMember && (
                <Button
                  onClick={() => {
                    setUnjoinConfirmation("");
                    setShowUnjoinDialog(true);
                  }}
                  disabled={unjoining}
                  variant="outline"
                  size="lg"
                  className="h-10 border-red-700 bg-red-700 px-5 text-white hover:border-red-800 hover:bg-red-800"
                >
                  <UserMinus />
                  {unjoining ? "Unjoining..." : "Unjoin Group"}
                </Button>
              )}

              {!isMember && !isFull && (
                <Button
                  onClick={() => {
                    setJoinConfirmation("");
                    setShowJoinDialog(true);
                  }}
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
                      {isMember && meetingLink && (
                        <a
                          href={meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-purple-700 underline-offset-2 hover:underline"
                        >
                          Open meeting link
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      {!isMember && group.platform !== "In-person" && (
                        <p className="mt-1 text-xs text-ink-soft">Join this group to access the meeting link.</p>
                      )}
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
                  {isMember && creatorContacts.length > 0 && (
                    <div className="mt-4 border-t border-dashed border-ink/15 pt-3">
                      <p className="mb-2 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                        Connect with {group.creator?.name?.split(" ")[0] || "the creator"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {creatorContacts.map((contact) => {
                          const Icon = socialContactIcons[contact.platform];
                          const contactUrl = getSafeExternalUrl(contact.url);
                          const contactContent = (
                            <>
                              <Icon className="h-3.5 w-3.5 shrink-0 text-purple-700" aria-hidden="true" />
                              <span>{contact.platform}</span>
                              <span className="max-w-28 truncate text-ink-soft">{contact.username}</span>
                              {contactUrl && <ExternalLink className="h-3 w-3 shrink-0 text-ink-soft" aria-hidden="true" />}
                            </>
                          );

                          return contactUrl ? (
                            <a
                              key={contact.id}
                              href={contactUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Open ${contact.platform} for ${group.creator?.name || "the creator"}`}
                              className="inline-flex max-w-full items-center gap-1.5 border border-purple-700/30 bg-purple-100/45 px-2 py-1.5 text-xs text-ink transition-colors hover:border-purple-700 hover:bg-purple-100"
                            >
                              {contactContent}
                            </a>
                          ) : (
                            <div
                              key={contact.id}
                              className="inline-flex max-w-full items-center gap-1.5 border border-ink/20 bg-paper px-2 py-1.5 text-xs text-ink"
                            >
                              {contactContent}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
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

        {showJoinDialog && (
          <div
            className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4 backdrop-blur-[2px]"
            onMouseDown={() => {
              if (!joining) setShowJoinDialog(false);
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="join-group-title"
              className="animate-fade-up relative w-full max-w-md border border-purple-700/45 bg-[#fffcf5] p-6 shadow-[6px_6px_0_#241a35]"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <span aria-hidden className="absolute -top-2 left-8 h-4 w-16 rotate-2 bg-marker/80" />
              <button
                type="button"
                onClick={() => setShowJoinDialog(false)}
                aria-label="Close join confirmation"
                disabled={joining}
                className="absolute right-3 top-3 text-ink-soft transition-colors hover:text-ink disabled:cursor-not-allowed"
              >
                <X className="h-4 w-4" />
              </button>
              <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-purple-700">Membership confirmation</p>
              <h2 id="join-group-title" className="mb-3 font-serif text-3xl font-medium text-ink">Join this group?</h2>
              <p className="mb-5 text-sm leading-relaxed text-ink-soft">
                You are about to join <span className="font-medium text-ink">{group.name}</span>. Type <span className="font-medium text-purple-700">Confirm</span> to add yourself as a member.
              </p>
              <label htmlFor="join-confirmation" className="mb-2 block font-mono text-xs font-semibold tracking-[0.08em] text-ink-soft">
                Type <span className="text-purple-700">Confirm</span> to continue
              </label>
              <Input
                id="join-confirmation"
                value={joinConfirmation}
                onChange={(event) => setJoinConfirmation(event.target.value)}
                placeholder="Confirm"
                autoComplete="off"
                disabled={joining}
                className="h-10 border-purple-700/35 bg-paper"
              />
              <div className="mt-5 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowJoinDialog(false)} disabled={joining} className="bg-[#fffcf5]">
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  disabled={joinConfirmation !== "Confirm" || joining}
                  onClick={handleJoinGroup}
                >
                  <UserPlus />
                  {joining ? "Joining..." : "Join group"}
                </Button>
              </div>
            </section>
          </div>
        )}

        {showUnjoinDialog && (
          <div
            className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4 backdrop-blur-[2px]"
            onMouseDown={() => {
              if (!unjoining) setShowUnjoinDialog(false);
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="unjoin-group-title"
              className="animate-fade-up relative w-full max-w-md border border-red-700/45 bg-[#fffcf5] p-6 shadow-[6px_6px_0_#241a35]"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <span aria-hidden className="absolute -top-2 left-8 h-4 w-16 rotate-2 bg-red-200/90" />
              <button
                type="button"
                onClick={() => setShowUnjoinDialog(false)}
                aria-label="Close unjoin confirmation"
                disabled={unjoining}
                className="absolute right-3 top-3 text-ink-soft transition-colors hover:text-ink disabled:cursor-not-allowed"
              >
                <X className="h-4 w-4" />
              </button>
              <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-red-700">Membership change</p>
              <h2 id="unjoin-group-title" className="mb-3 font-serif text-3xl font-medium text-ink">Unjoin this group?</h2>
              <p className="mb-5 text-sm leading-relaxed text-ink-soft">
                You will leave <span className="font-medium text-ink">{group.name}</span> and lose access to its meeting link. Type <span className="font-medium text-red-700">Confirm</span> to continue.
              </p>
              <label htmlFor="unjoin-confirmation" className="mb-2 block font-mono text-xs font-semibold tracking-[0.08em] text-ink-soft">
                Type <span className="text-red-700">Confirm</span> to continue
              </label>
              <Input
                id="unjoin-confirmation"
                value={unjoinConfirmation}
                onChange={(event) => setUnjoinConfirmation(event.target.value)}
                placeholder="Confirm"
                autoComplete="off"
                disabled={unjoining}
                className="h-10 border-red-700/35 bg-paper"
              />
              <div className="mt-5 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowUnjoinDialog(false)} disabled={unjoining} className="bg-[#fffcf5]">
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={unjoinConfirmation !== "Confirm" || unjoining}
                  onClick={handleUnjoinGroup}
                  className="border-red-700 bg-red-700 text-white hover:border-red-800 hover:bg-red-800 disabled:border-ink/25 disabled:bg-paper disabled:text-ink-soft disabled:opacity-100"
                >
                  <UserMinus />
                  {unjoining ? "Unjoining..." : "Unjoin group"}
                </Button>
              </div>
            </section>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
