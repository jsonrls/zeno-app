"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Users, Trash2, UserMinus, Pencil, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ProtectedRoute from "@/components/ProtectedRoute";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { sanitizeName, sanitizeInput } from "@/lib/inputSanitization";

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

export default function ManageGroupPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [group, setGroup] = useState<GroupDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingBasic, setEditingBasic] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    max_members: "",
  });

  // Calculate if deletion should be disabled (1 day before event)
  const isDeleteDisabled = () => {
    if (!group?.schedule) return false;

    try {
      // Parse schedule format: "Mon/Wed 7:00 PM - 9:00 PM" or "Thu/Fri 17:00 - 18:00"
      const scheduleMatch = group.schedule.match(/^([A-Za-z/]+)\s+(\d{1,2}):(\d{2})/);
      if (!scheduleMatch) return false;

      const [, daysStr, hours, minutes] = scheduleMatch;
      const days = daysStr.split('/');

      // Convert day abbreviations to numbers (0 = Sunday, 1 = Monday, etc.)
      const dayMap: { [key: string]: number } = {
        'sun': 0, 'mon': 1, 'tue': 2, 'wed': 3, 'thu': 4, 'fri': 5, 'sat': 6
      };

      const now = new Date();
      const currentDay = now.getDay();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      // Find the next occurrence of any scheduled day
      let nextEventDate: Date | null = null;

      for (const dayAbbr of days) {
        const dayKey = dayAbbr.toLowerCase().substring(0, 3);
        const targetDay = dayMap[dayKey];

        if (targetDay !== undefined) {
          // Calculate days until this scheduled day
          let daysUntil = targetDay - currentDay;
          if (daysUntil < 0) daysUntil += 7; // Next week

          // If it's today, check if the time has passed
          if (daysUntil === 0) {
            const eventTime = parseInt(hours) * 60 + parseInt(minutes);
            if (currentTime >= eventTime) {
              daysUntil = 7; // Next week's occurrence
            }
          }

          const eventDate = new Date(now);
          eventDate.setDate(now.getDate() + daysUntil);
          eventDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

          if (!nextEventDate || eventDate < nextEventDate) {
            nextEventDate = eventDate;
          }
        }
      }

      if (nextEventDate) {
        const timeDiff = nextEventDate.getTime() - now.getTime();
        const hoursUntil = timeDiff / (1000 * 60 * 60);
        return hoursUntil <= 24; // Disable if 24 hours or less
      }

      return false;
    } catch (error) {
      console.error('Error parsing schedule:', error);
      return false;
    }
  };

  const getNextEventInfo = () => {
    if (!group?.schedule) return null;

    try {
      const scheduleMatch = group.schedule.match(/^([A-Za-z/]+)\s+(\d{1,2}):(\d{2})/);
      if (!scheduleMatch) return null;

      const [, daysStr, hours, minutes] = scheduleMatch;
      const days = daysStr.split('/');

      const dayMap: { [key: string]: number } = {
        'sun': 0, 'mon': 1, 'tue': 2, 'wed': 3, 'thu': 4, 'fri': 5, 'sat': 6
      };

      const now = new Date();
      const currentDay = now.getDay();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      let nextEventDate: Date | null = null;

      for (const dayAbbr of days) {
        const dayKey = dayAbbr.toLowerCase().substring(0, 3);
        const targetDay = dayMap[dayKey];

        if (targetDay !== undefined) {
          let daysUntil = targetDay - currentDay;
          if (daysUntil < 0) daysUntil += 7;

          if (daysUntil === 0) {
            const eventTime = parseInt(hours) * 60 + parseInt(minutes);
            if (currentTime >= eventTime) {
              daysUntil = 7;
            }
          }

          const eventDate = new Date(now);
          eventDate.setDate(now.getDate() + daysUntil);
          eventDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

          if (!nextEventDate || eventDate < nextEventDate) {
            nextEventDate = eventDate;
          }
        }
      }

      if (nextEventDate) {
        const timeDiff = nextEventDate.getTime() - now.getTime();
        const hoursUntil = Math.ceil(timeDiff / (1000 * 60 * 60));
        return {
          date: nextEventDate,
          hoursUntil,
          isWithin24Hours: hoursUntil <= 24
        };
      }

      return null;
    } catch (error) {
      console.error('Error calculating next event:', error);
      return null;
    }
  };

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

        // Check if user is the creator
        if (data.creator_id !== user?.id) {
          setError("You don't have permission to manage this group");
          return;
        }

        setGroup(data);
        setFormData({
          name: data.name,
          description: data.description,
          max_members: data.max_members.toString(),
        });
      } catch (err) {
        console.error('Error:', err);
        setError("Failed to load group details");
      } finally {
        setLoading(false);
      }
    }

    if (groupId && user) {
      fetchGroupDetails();
    }
  }, [groupId, user]);

  const handleSaveBasic = async () => {
    try {
      setSaving(true);
      setError("");

      const { error } = await supabase
        .from('study_groups')
        .update({
          name: formData.name,
          description: formData.description,
          max_members: parseInt(formData.max_members),
        })
        .eq('id', groupId);

      if (error) {
        throw error;
      }

      setSuccess("Group updated successfully!");
      setEditingBasic(false);

      // Refresh group data
      if (group) {
        setGroup({
          ...group,
          name: formData.name,
          description: formData.description,
          max_members: parseInt(formData.max_members),
        });
      }

      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error('Error updating group:', err);
      setError(err.message || "Failed to update group");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveMember = async (memberId: string, memberUserId: string) => {
    if (memberUserId === user?.id) {
      setError("You cannot remove yourself as the creator");
      return;
    }

    try {
      setError("");
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('id', memberId);

      if (error) {
        throw error;
      }

      // Update local state
      if (group) {
        setGroup({
          ...group,
          group_members: group.group_members.filter(member => member.id !== memberId)
        });
      }

      setSuccess("Member removed successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error('Error removing member:', err);
      setError(err.message || "Failed to remove member");
    }
  };

  const handleDeleteGroup = async () => {
    // Check if deletion is disabled due to upcoming event
    if (isDeleteDisabled()) {
      const nextEvent = getNextEventInfo();
      setError(`Cannot delete group - next session is in ${nextEvent?.hoursUntil} hours. Groups cannot be deleted within 24 hours of a scheduled session.`);
      return;
    }

    try {
      setError("");

      // Delete group members first
      await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId);

      // Delete the group
      const { error } = await supabase
        .from('study_groups')
        .delete()
        .eq('id', groupId);

      if (error) {
        throw error;
      }

      setShowDeleteDialog(false);
      router.push("/dashboard");
    } catch (err: any) {
      console.error('Error deleting group:', err);
      setError(err.message || "Failed to delete group");
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-ink/15 border-t-purple-700"></div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">Opening management record...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error && !group) {
    return (
      <ProtectedRoute>
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="py-12 text-center">
            <h2 className="mb-4 font-serif text-3xl font-medium text-ink">{error}</h2>
            <Link
              href="/groups"
              className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft transition-colors hover:text-purple-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to groups
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!group) return null;

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {/* Header */}
        <div className="animate-fade-up mb-10">
          <button
            type="button"
            onClick={() => window.history.length > 1 ? router.back() : router.push(`/groups/${groupId}`)}
            className="mb-7 inline-flex items-center gap-2 cursor-pointer font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft transition-colors hover:text-purple-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Group Details
          </button>

          <div className="flex flex-col gap-4 border-b border-ink/20 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="mb-2 font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
                Manage Group
              </h1>
              <p className="text-ink-soft">
                Manage your study group settings and members
              </p>
            </div>
            <Badge className="w-fit rounded-xs border border-purple-700/35 bg-transparent px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-purple-700">
              Creator Access
            </Badge>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mt-4 border border-red-700/30 bg-red-100/50 p-3">
              <p className="text-sm text-red-900">{error}</p>
            </div>
          )}
        </div>

        {success && typeof document !== "undefined" && createPortal((
          <div className="fixed right-4 top-4 z-50 w-[calc(100%-2rem)] max-w-sm sm:right-6 sm:top-6" role="status" aria-live="polite">
            <section
              aria-labelledby="manage-success-title"
              className="animate-fade-up relative border border-green-700/40 bg-[#fffcf5] p-5 shadow-[5px_5px_0_#241a35]"
            >
              <span aria-hidden className="absolute -top-2 left-6 h-3.5 w-14 -rotate-2 bg-marker/70" />
              <button type="button" onClick={() => setSuccess("")} aria-label="Close confirmation" className="absolute right-3 top-3 text-ink-soft transition-colors hover:text-ink">
                <X className="h-4 w-4" />
              </button>
              <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-green-700">Record saved</p>
              <p className="text-sm leading-relaxed text-ink-soft">{success}</p>
            </section>
          </div>
        ), document.body)}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Basic Information */}
            <Card className="rounded-sm border-ink/20 bg-[#fffcf5] shadow-[4px_4px_0_rgba(36,26,53,.09)]">
              <CardHeader className="border-b border-ink/15 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-purple-700">Record fields</p>
                    <CardTitle className="font-serif text-2xl font-medium">Basic information</CardTitle>
                  </div>
                  {!editingBasic ? (
                    <button
                      type="button"
                      onClick={() => setEditingBasic(true)}
                      className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-purple-700 transition-colors hover:text-purple-800"
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingBasic(false);
                          setFormData({
                            name: group.name,
                            description: group.description,
                            max_members: group.max_members.toString(),
                          });
                        }}
                      >
                        <X />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveBasic}
                        disabled={saving}
                        variant="primary"
                      >
                        <Save />
                        {saving ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {editingBasic ? (
                  <>
                    <div>
                      <label className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                        Group Name
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: sanitizeName(e.target.value)})}
                        placeholder="Enter group name"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: sanitizeInput(e.target.value, { maxLength: 500 })})}
                        className="w-full rounded-sm border border-ink/25 bg-paper px-3 py-2 text-ink"
                        rows={3}
                        placeholder="Enter group description"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                        Max Members
                      </label>
                      <Input
                        type="number"
                        value={formData.max_members}
                        onChange={(e) => setFormData({...formData, max_members: e.target.value})}
                        min="2"
                        max="50"
                        placeholder="Maximum number of members"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="font-serif text-2xl font-medium text-ink">{group.name}</h3>
                      <p className="mt-2 leading-relaxed text-ink-soft">{group.description}</p>
                    </div>
                    <div className="grid grid-cols-1 border-t border-ink/15 pt-4 text-sm sm:grid-cols-2">
                      <div className="border-b border-dashed border-ink/15 py-2 sm:border-r sm:pr-4">
                        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-ink-soft">Subject</span>
                        <span className="ml-2 text-ink">{group.subject}</span>
                      </div>
                      <div className="border-b border-dashed border-ink/15 py-2 sm:pl-4">
                        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-ink-soft">Max members</span>
                        <span className="ml-2 text-ink">{group.max_members}</span>
                      </div>
                      <div className="border-b border-dashed border-ink/15 py-2 sm:border-b-0 sm:border-r sm:pr-4">
                        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-ink-soft">Frequency</span>
                        <span className="ml-2 text-ink">{group.frequency}</span>
                      </div>
                      <div className="py-2 sm:pl-4">
                        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-ink-soft">Platform</span>
                        <span className="ml-2 text-ink">{group.platform}</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Member Management */}
            <Card className="rounded-sm border-ink/20 bg-[#fffcf5] shadow-[4px_4px_0_rgba(36,26,53,.09)]">
              <CardHeader className="border-b border-ink/15 pb-4">
                <CardTitle className="flex items-center font-serif text-2xl font-medium">
                  <Users className="mr-2 h-5 w-5 text-purple-700" />
                  Member Management ({group.group_members.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-0">
                  {group.group_members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between gap-3 border-b border-dashed border-ink/15 py-3 last:border-0">
                      <div className="flex items-center space-x-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center border border-purple-700/35 bg-purple-100/60 font-serif text-sm font-semibold text-purple-700">
                          {member.profiles?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink">
                            {member.profiles?.name || 'Unknown'}
                            {member.user_id === group.creator_id && (
                              <Badge variant="outline" className="ml-2 rounded-xs font-mono text-[8px] uppercase tracking-[0.08em]">
                                Creator
                              </Badge>
                            )}
                          </p>
                          <p className="text-xs text-ink-soft">
                            {member.profiles?.course} • {member.profiles?.year_level}
                          </p>
                          <p className="text-xs text-ink-soft/70">
                            Joined {new Date(member.joined_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {member.user_id !== group.creator_id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveMember(member.id, member.user_id)}
                          className="border-red-700/45 bg-[#fffcf5] text-red-700 hover:border-red-700 hover:bg-red-50 hover:text-red-800"
                        >
                          <UserMinus />
                          Remove
                        </Button>
                      )}
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Danger Zone */}
            <Card className="border-red-700/40 bg-[#fffcf5] shadow-[4px_4px_0_rgba(127,29,29,.12)]">
              <CardHeader className="border-b border-red-700/20 pb-4">
                <CardTitle className="flex items-center font-serif text-2xl font-medium text-red-700">
                  <Trash2 className="mr-2 h-5 w-5" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-serif text-xl font-medium text-ink">Delete group</h4>
                    <p className="mb-4 text-sm leading-relaxed text-ink-soft">
                      Permanently delete this group and remove all members. This action cannot be undone.
                    </p>

                    {/* Show warning if deletion is disabled */}
                    {isDeleteDisabled() && (
                      <div className="mb-4 border border-amber-700/35 bg-amber-100/50 p-3">
                        <div className="flex items-start">
                          <div className="shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-amber-900">
                              Deletion Temporarily Disabled
                            </h3>
                            <div className="mt-1 text-sm text-amber-800">
                              <p>
                                Cannot delete group within 24 hours of a scheduled session.
                                {(() => {
                                  const nextEvent = getNextEventInfo();
                                  return nextEvent ? (
                                    <> Next session is in {nextEvent.hoursUntil} hour{nextEvent.hoursUntil !== 1 ? 's' : ''}.</>
                                  ) : null;
                                })()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        setDeleteConfirmation("");
                        setShowDeleteDialog(true);
                      }}
                      disabled={isDeleteDisabled()}
                      className={`w-full ${
                        isDeleteDisabled()
                          ? "border-ink/20 bg-paper text-ink-soft cursor-not-allowed"
                          : "border-red-700 bg-red-700 text-white hover:bg-red-800"
                      }`}
                    >
                      <Trash2 />
                      Delete Group
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {showDeleteDialog && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4 backdrop-blur-[2px]" onMouseDown={() => setShowDeleteDialog(false)}>
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-group-title"
              className="animate-fade-up relative w-full max-w-md border border-red-700/45 bg-[#fffcf5] p-6 shadow-[6px_6px_0_#241a35]"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <span aria-hidden className="absolute -top-2 left-8 h-4 w-16 rotate-2 bg-red-200/90" />
              <button type="button" onClick={() => setShowDeleteDialog(false)} aria-label="Close delete confirmation" className="absolute right-3 top-3 text-ink-soft transition-colors hover:text-ink">
                <X className="h-4 w-4" />
              </button>
              <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-red-700">Irreversible action</p>
              <h2 id="delete-group-title" className="mb-3 font-serif text-3xl font-medium text-ink">Delete this group?</h2>
              <p className="mb-5 text-sm leading-relaxed text-ink-soft">This permanently removes <span className="font-medium text-ink">{group.name}</span> and its member records. This cannot be undone.</p>
              <label htmlFor="delete-confirmation" className="mb-2 block font-mono text-xs font-semibold tracking-[0.08em] text-ink-soft">Type <span className="text-red-700">Confirm</span> to continue</label>
              <Input
                id="delete-confirmation"
                value={deleteConfirmation}
                onChange={(event) => setDeleteConfirmation(event.target.value)}
                placeholder="Confirm"
                autoComplete="off"
                className="h-10 border-red-700/35 bg-paper"
              />
              <div className="mt-5 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowDeleteDialog(false)} className="bg-[#fffcf5]">Cancel</Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={deleteConfirmation !== "Confirm"}
                  onClick={handleDeleteGroup}
                  className="border-red-700 bg-red-700 text-white hover:border-red-800 hover:bg-red-800 disabled:border-ink/25 disabled:bg-paper disabled:text-ink-soft disabled:opacity-100"
                >
                  <Trash2 />
                  Delete group
                </Button>
              </div>
            </section>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
