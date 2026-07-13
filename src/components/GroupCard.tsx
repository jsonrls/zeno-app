import { Users, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

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
}

interface GroupCardProps {
  group: Group;
  layout?: "card" | "list";
}

export default function GroupCard({ group, layout = "card" }: GroupCardProps) {
  const { user } = useAuth();
  const [isJoined, setIsJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [memberCount, setMemberCount] = useState(group.members);
  const progressPercentage = (memberCount / group.maxMembers) * 100;

  // Check if user is already a member
  useEffect(() => {
    async function checkMembership() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('group_members')
          .select('id')
          .eq('group_id', group.id)
          .eq('user_id', user.id)
          .single();

        if (data && !error) {
          setIsJoined(true);
        }
      } catch (error) {
        // User is not a member, which is fine
        setIsJoined(false);
      }
    }

    checkMembership();
  }, [user, group.id]);

  const handleJoinGroup = async () => {
    if (!user) return;

    setIsJoining(true);

    try {
      const { error } = await supabase
        .from('group_members')
        .insert({
          group_id: group.id,
          user_id: user.id,
          joined_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error joining group:', error);
        alert('Failed to join group. Please try again.');
        return;
      }

      setIsJoined(true);
      setMemberCount(prev => prev + 1);
    } catch (error) {
      console.error('Error joining group:', error);
      alert('Failed to join group. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  if (layout === "list") {
    return (
      <Card className="group min-h-28 overflow-hidden rounded-sm border border-ink/20 bg-[#fffcf5] transition-all hover:border-purple-700/40 hover:shadow-[3px_3px_0_rgba(36,26,53,.1)]">
        <div className="grid min-h-28 gap-3 p-3 sm:grid-cols-[minmax(12rem,1fr)_minmax(14rem,1.15fr)_auto] sm:items-center sm:p-4">
          <div className="min-w-0">
            <div className="mb-1.5 flex items-center gap-2">
              <Badge className="rounded-xs border-purple-700/40 bg-transparent px-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-purple-700">{group.subject}</Badge>
              <span className="font-mono text-[9px] uppercase tracking-widest text-ink-soft">{Math.round(progressPercentage)}% full</span>
            </div>
            <h3 className="truncate font-serif text-lg font-medium text-ink">{group.name}</h3>
          </div>

          <div className="min-w-0 space-y-1 text-xs text-ink-soft">
            <p className="flex items-center truncate"><Clock className="mr-2 h-3.5 w-3.5 shrink-0 text-purple-700" />{group.frequency || "Not specified"} · {group.schedule || "Schedule TBD"}</p>
            <p className="flex items-center truncate"><Users className="mr-2 h-3.5 w-3.5 shrink-0 text-purple-700" />{memberCount}/{group.maxMembers} members · {group.platform || "Platform TBD"}</p>
          </div>

          <div className="flex gap-2 sm:w-44">
            <Button variant="outline" size="sm" className="flex-1 shadow-[2px_2px_0_#241a35] hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0_#241a35]" asChild>
              <Link href={`/groups/${group.id}`}>Details</Link>
            </Button>
            <Button size="sm" className="flex-1 shadow-[2px_2px_0_#241a35] hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0_#241a35] disabled:shadow-[2px_2px_0_#241a35]" onClick={isJoined ? undefined : handleJoinGroup} disabled={isJoining || isJoined || memberCount >= group.maxMembers}>
              {isJoining ? "Joining" : isJoined ? "Joined" : memberCount >= group.maxMembers ? "Full" : "Join"}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-purple-700/40 hover:shadow-[4px_4px_0_0_rgba(36,26,53,0.12)]">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-baseline mb-3 border-b border-ink/15 pb-2.5">
          <Badge className="rounded-xs border-purple-700/40 bg-transparent px-2 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-purple-700">
            {group.subject}
          </Badge>
          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft/80">
            {Math.round(progressPercentage)}% full
          </div>
        </div>
        <CardTitle className="text-xl leading-snug">
          {group.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 pb-4">
        {/* Description */}
        <p className="text-ink-soft text-sm leading-relaxed line-clamp-2 min-h-10">
          {group.description || "No description available."}
        </p>

        {/* Details */}
        <div>
          <div className="flex items-center border-b border-dashed border-ink/15 py-1.5 text-sm text-ink-soft">
            <Clock className="w-4 h-4 mr-2 shrink-0 text-purple-700" />
            <span className="truncate">
              {group.frequency || "Not specified"} • {group.schedule || "Schedule TBD"}
            </span>
          </div>
          <div className="flex items-center border-b border-dashed border-ink/15 py-1.5 text-sm text-ink-soft">
            <MapPin className="w-4 h-4 mr-2 shrink-0 text-purple-700" />
            <span className="truncate">{group.platform || "Platform TBD"}</span>
          </div>
        </div>

        {/* Members Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center font-mono text-xs text-ink">
              <Users className="w-4 h-4 mr-1.5 text-purple-700" />
              {memberCount}/{group.maxMembers} members
            </span>
          </div>
          <div className="w-full bg-ink/10 h-1.5">
            <div
              className="bg-purple-700 h-1.5 transition-all duration-500"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 min-h-6">
          {group.tags && group.tags.length > 0 ? (
            <>
              {group.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="font-mono text-[10px] uppercase tracking-[0.08em]">
                  {tag}
                </Badge>
              ))}
              {group.tags.length > 2 && (
                <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-[0.08em]">
                  +{group.tags.length - 2}
                </Badge>
              )}
            </>
          ) : (
            <div className="text-xs text-ink-soft/60 italic">No tags</div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-0">
        <Button
          variant="outline"
          size="lg"
          className="h-9 flex-1 px-4 shadow-[2px_2px_0_0_#241a35] hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0_0_#241a35]"
          asChild
        >
          <Link href={`/groups/${group.id}`}>
            View Details
          </Link>
        </Button>
        <Button
          className={`h-9 flex-1 px-4 shadow-[2px_2px_0_0_#241a35] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0_0_#241a35] disabled:shadow-[2px_2px_0_0_#241a35] ${
            isJoined ? "cursor-not-allowed" : ""
          }`}
          size="lg"
          onClick={isJoined ? undefined : handleJoinGroup}
          disabled={isJoining || isJoined || memberCount >= group.maxMembers}
        >
          {isJoining ? "Joining..." : isJoined ? "Joined" : memberCount >= group.maxMembers ? "Full" : "Join Group"}
        </Button>
      </CardFooter>
    </Card>
  );
}
