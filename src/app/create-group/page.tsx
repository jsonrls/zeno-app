"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Users, BookOpen, Clock, MapPin, FileText, ArrowLeft, Plus, Loader2, CalendarDays, X, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ProtectedRoute from "@/components/ProtectedRoute";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { sanitizeName, sanitizeInput } from "@/lib/inputSanitization";
import { ensureProfile } from "@/lib/ensureProfile";

export default function CreateGroup() {
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    description: "",
    frequency: "",
    platform: "",
    maxMembers: "",
  });
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const subjects = [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Engineering",
    "Business",
    "Economics",
    "Psychology",
    "Literature",
    "History",
    "Art",
  ];

  const frequencies = [
    "Daily",
    "Twice weekly",
    "Weekly",
    "Bi-weekly",
    "Monthly",
  ];

  const platforms = [
    "Discord",
    "Zoom",
    "Google Meet",
    "Microsoft Teams",
    "Skype",
    "In-person",
    "Hybrid",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Form validation
      if (!formData.name.trim()) {
        throw new Error("Group name is required");
      }
      if (!formData.subject) {
        throw new Error("Please select a subject");
      }
      if (!formData.description.trim()) {
        throw new Error("Description is required");
      }
      if (!formData.frequency) {
        throw new Error("Please select a frequency");
      }
      if (!formData.platform) {
        throw new Error("Please select a platform");
      }
      if (selectedDays.length === 0) {
        throw new Error("Please select at least one meeting day");
      }
      if (!startTime) {
        throw new Error("Please set a start time");
      }
      if (!endTime) {
        throw new Error("Please set an end time");
      }

      if (!user) {
        throw new Error("You must be logged in to create a group");
      }

      // study_groups.creator_id references public.profiles(id), not auth.users(id).
      await ensureProfile(user);

      // Format schedule from selected data
      const scheduleData = {
        days: selectedDays.map(day => format(day, "EEEE")),
        startTime,
        endTime,
        formattedSchedule: `${selectedDays.map(day => format(day, "EEE")).join("/")} ${startTime} - ${endTime}`
      };

      // Create the study group in Supabase
      const { data: groupData, error: groupError } = await supabase
        .from('study_groups')
        .insert({
          name: formData.name,
          subject: formData.subject,
          description: formData.description,
          frequency: formData.frequency,
          platform: formData.platform,
          schedule: scheduleData.formattedSchedule,
          max_members: parseInt(formData.maxMembers),
          creator_id: user.id
        })
        .select()
        .single();

      if (groupError) {
        console.error('Error creating group:', groupError);
        throw new Error(groupError.message || "Failed to create group");
      }

      // Add the creator as the first member of the group
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: groupData.id,
          user_id: user.id
        });

      if (memberError) {
        console.error('Error adding creator as member:', memberError);
        throw new Error("Group created but failed to add you as a member. Please try joining manually.");
      }

      // Add tags if any were provided
      if (tags.length > 0) {
        const tagData = tags.map(tag => ({
          name: tag,
          group_id: groupData.id
        }));

        const { error: tagsError } = await supabase
          .from('tags')
          .insert(tagData);

        if (tagsError) {
          console.error('Error adding tags:', tagsError);
          // Don't throw error for tags, just log it since the group was created successfully
        }
      }

      console.log("Group created successfully:", groupData);
      console.log("Creator automatically added as member");

      // Redirect to dashboard on success
      router.push("/dashboard");

    } catch (error: any) {
      setError(error.message || "Failed to create group");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let sanitizedValue = value;

    // Apply appropriate sanitization based on field type
    if (name === 'name') {
      sanitizedValue = sanitizeName(value);
    } else if (name === 'description') {
      sanitizedValue = sanitizeInput(value, { maxLength: 1000 });
    } else if (name === 'subject' || name === 'frequency' || name === 'platform') {
      sanitizedValue = sanitizeInput(value, { maxLength: 100 });
    } else if (name === 'maxMembers') {
      sanitizedValue = value; // Keep as is for number input
    }

    setFormData({
      ...formData,
      [name]: sanitizedValue,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleTimeChange = (field: "startTime" | "endTime", value: string) => {
    if (field === "startTime") {
      setStartTime(value);
    } else {
      setEndTime(value);
    }
    // Clear error when user starts selecting
    if (error) setError("");
  };

  const handleDaySelect = (day: Date | undefined) => {
    if (!day) return;

    setSelectedDays(prev => {
      const isSelected = prev.some(selectedDay =>
        selectedDay.getDay() === day.getDay()
      );

      if (isSelected) {
        return prev.filter(selectedDay => selectedDay.getDay() !== day.getDay());
      } else {
        return [...prev, day];
      }
    });

    // Clear error when user starts selecting
    if (error) setError("");
  };

  const handleAddTag = () => {
    const trimmedTag = sanitizeInput(tagInput.trim(), { maxLength: 50 });
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags(prev => [...prev, trimmedTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {/* Header */}
        <div className="animate-fade-up mb-10">
          <div className="flex items-center mb-6">
            <button
              type="button"
              onClick={() => {
                if (window.history.length > 1) {
                  router.back();
                } else {
                  router.push('/dashboard');
                }
              }}
              aria-label="Return to previous page"
              className="flex items-center cursor-pointer font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft transition-colors hover:text-purple-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to previous page
            </button>
          </div>
          <div>
            <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-purple-700">New catalog entry · Draft</p>
            <h1 className="mb-3 font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
              Create a <em className="highlight-marker italic text-purple-700">study circle</em>.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-ink-soft">
              Start a new study group and connect with fellow students
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 border border-red-700/30 bg-red-100/50 px-4 py-3 text-red-900">
            {error}
          </div>
        )}

        {/* Create Group Form */}
        <form onSubmit={handleSubmit} className="form-sheet catalog-form space-y-7">
          {/* Group Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Group Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="pl-10"
                placeholder="e.g., Advanced Calculus Study Circle"
              />
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
              Subject
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BookOpen className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-md  border-purple-300 hover:border-purple-500 bg-white text-gray-900"
                required
              >
                <option value="">Select a subject</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full pl-10 pr-4 py-3 border rounded-md border-purple-300 hover:border-purple-500 bg-white text-gray-900 resize-none"
                placeholder="Describe what your study group will focus on, goals, and what members can expect..."
                required
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Tags <span className="text-gray-500">(optional, max 5)</span>
            </label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Hash className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    value={tagInput}
                                            onChange={(e) => setTagInput(sanitizeInput(e.target.value, { maxLength: 50 }))}
                    onKeyPress={handleTagInputKeyPress}
                    className="pl-10"
                    placeholder="Enter a tag (e.g., algorithms, midterm, advanced)"
                    maxLength={20}
                    disabled={tags.length >= 5}
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim() || tags.includes(tagInput.trim()) || tags.length >= 5}
                  variant="primary"
                  className="h-12 max-h-12 min-w-20 rounded-sm px-4"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </Button>
              </div>

              {/* Display Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <div
                      key={tag}
                      className="inline-flex items-center gap-1 border border-purple-700/35 bg-transparent px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-purple-700"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-purple-900 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-500">
                Tags help other students find your group more easily. Use relevant keywords like study topics, exam preparation, or difficulty level.
              </p>
            </div>
          </div>

          {/* Meeting Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Meeting Frequency */}
            <div className="space-y-2">
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                Meeting Frequency
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  className="h-12 w-full rounded-sm border border-ink/25 bg-paper pl-10 pr-4 text-ink"
                  required
                >
                  <option value="">Select frequency</option>
                  {frequencies.map((frequency) => (
                    <option key={frequency} value={frequency}>
                      {frequency}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Platform */}
            <div className="space-y-2">
              <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
                Platform
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="platform"
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  className="h-12 w-full rounded-sm border border-ink/25 bg-paper pl-10 pr-4 text-ink"
                  required
                >
                  <option value="">Select platform</option>
                  {platforms.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Schedule Section */}
          <div className="space-y-6">
            <div>
              <div className="mb-5 flex items-center gap-3 border-b border-ink/15 pb-3">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-purple-700">Section 02</span>
                <h3 className="font-serif text-xl font-medium text-ink">Meeting schedule</h3>
              </div>

              {/* Days Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Select Meeting Days
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-12 w-full justify-start rounded-sm border-ink/25 bg-paper text-left font-normal hover:border-ink/25 hover:bg-[#fffcf5] hover:text-ink",
                        !selectedDays.length && "text-muted-foreground"
                      )}
                    >
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {selectedDays.length > 0
                        ? `${selectedDays.map(day => format(day, "EEE")).join(", ")} (${selectedDays.length} day${selectedDays.length > 1 ? 's' : ''})`
                        : "Pick meeting days"
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto rounded-sm border-ink/20 bg-[#fffcf5] p-0 shadow-[4px_4px_0_rgba(36,26,53,.1)]" align="start">
                    <Calendar
                      mode="multiple"
                      selected={selectedDays}
                      onSelect={(days) => {
                        if (days) {
                          setSelectedDays(days);
                          if (error) setError("");
                        }
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="bg-white calendar-purple"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                    Start Time
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="startTime"
                      type="time"
                      value={startTime}
                      onChange={(e) => handleTimeChange("startTime", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                    End Time
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={(e) => handleTimeChange("endTime", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Schedule Preview */}
              {selectedDays.length > 0 && startTime && endTime && (
                <div className="mt-5 border border-dashed border-purple-700/40 bg-purple-100/35 p-4">
                  <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-purple-700">Schedule preview</p>
                  <p className="font-serif text-lg text-ink">
                    {selectedDays.map(day => format(day, "EEEE")).join(", ")} from {startTime} to {endTime}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Max Members */}
          <div className="space-y-2">
            <label htmlFor="maxMembers" className="block text-sm font-medium text-gray-700">
              Max Members
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="maxMembers"
                name="maxMembers"
                type="number"
                required
                value={formData.maxMembers}
                onChange={handleChange}
                className="pl-10"
                placeholder="15"
                min="2"
                max="50"
              />
            </div>
          </div>

          {/* Pro Tips */}
          <aside className="relative border border-amber-800/30 bg-marker/15 p-6">
            <span aria-hidden className="absolute -top-2 right-8 h-4 w-16 rotate-2 bg-marker/60" />
            <h3 className="mb-3 font-serif text-lg font-medium text-ink">
              Notes for a strong study circle
            </h3>
            <ul className="space-y-2 text-sm leading-relaxed text-ink-soft">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Be specific about topics and goals in your description</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Select multiple meeting days for flexible scheduling</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Choose realistic time slots that work for your target group</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Start with a smaller group (5-8 people) for better engagement</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>You'll automatically be added as the first member</strong> when you create the group</span>
              </li>
            </ul>
          </aside>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="group h-12 w-full rounded-sm shadow-[0.25rem_0.25rem_0_0_#241a35] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[0.1rem_0.1rem_0_0_#241a35]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Group...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                Create Study Group
              </>
            )}
          </Button>
        </form>
      </div>
    </ProtectedRoute>
  );
}
