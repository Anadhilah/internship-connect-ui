import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { ChatConversation, ChatParticipant } from "@/data/chat";

export function useConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data: convs } = await supabase
      .from("conversations")
      .select("id, student_id, recruiter_id, last_message_at")
      .or(`student_id.eq.${user.id},recruiter_id.eq.${user.id}`)
      .order("last_message_at", { ascending: false });

    if (!convs) {
      setConversations([]);
      setLoading(false);
      return;
    }

    // Fetch profiles + last message for each
    const userIds = Array.from(new Set(convs.flatMap((c) => [c.student_id, c.recruiter_id])));
    const [{ data: profiles }, { data: lastMsgs }] = await Promise.all([
      supabase.from("profiles").select("id, display_name, avatar_url").in("id", userIds),
      supabase.from("messages").select("id, conversation_id, sender_id, body, created_at").in("conversation_id", convs.map((c) => c.id)).order("created_at", { ascending: true }),
    ]);

    const profileMap = new Map((profiles || []).map((p) => [p.id, p]));
    const messagesByConv = new Map<string, any[]>();
    (lastMsgs || []).forEach((m) => {
      const arr = messagesByConv.get(m.conversation_id) || [];
      arr.push(m);
      messagesByConv.set(m.conversation_id, arr);
    });

    const result: ChatConversation[] = convs.map((c) => {
      const studentProfile = profileMap.get(c.student_id);
      const recruiterProfile = profileMap.get(c.recruiter_id);
      const participants: ChatParticipant[] = [
        { id: c.student_id, name: studentProfile?.display_name || "Student", role: "student", avatar: studentProfile?.avatar_url },
        { id: c.recruiter_id, name: recruiterProfile?.display_name || "Recruiter", role: "recruiter", avatar: recruiterProfile?.avatar_url },
      ];
      const msgs = (messagesByConv.get(c.id) || []).map((m) => ({
        id: m.id,
        senderId: m.sender_id,
        text: m.body,
        timestamp: m.created_at,
      }));
      return {
        id: c.id,
        participants,
        messages: msgs,
        lastActivity: c.last_message_at,
      };
    });

    setConversations(result);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  // Realtime: refresh on new messages
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("conversations-updates")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        () => { load(); }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "conversations" },
        () => { load(); }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, load]);

  return { conversations, loading, reload: load };
}

export async function getOrCreateConversation(studentId: string, recruiterId: string): Promise<string | null> {
  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("student_id", studentId)
    .eq("recruiter_id", recruiterId)
    .maybeSingle();
  if (existing) return existing.id;
  const { data: created, error } = await supabase
    .from("conversations")
    .insert({ student_id: studentId, recruiter_id: recruiterId })
    .select("id")
    .single();
  if (error) {
    console.error(error);
    return null;
  }
  return created.id;
}
