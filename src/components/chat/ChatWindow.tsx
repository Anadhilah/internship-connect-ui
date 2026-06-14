import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ArrowLeft, Video, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatConversation, ChatMessage } from "@/data/chat";
import CallWindow from "./CallWindow";
import { supabase } from "@/integrations/supabase/client";

interface ChatWindowProps {
  conversation: ChatConversation;
  currentUserId: string;
  onBack?: () => void;
  compact?: boolean;
}

export default function ChatWindow({ conversation, currentUserId, onBack, compact = false }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(conversation.messages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [activeCall, setActiveCall] = useState<{ mode: "video" | "voice" } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const otherParticipant = conversation.participants.find((p) => p.id !== currentUserId);

  useEffect(() => {
    setMessages(conversation.messages);
  }, [conversation.id, conversation.messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Realtime subscribe to new messages in this conversation
  useEffect(() => {
    const channel = supabase
      .channel(`messages-${conversation.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversation.id}` },
        (payload) => {
          const m: any = payload.new;
          setMessages((prev) => {
            if (prev.some((x) => x.id === m.id)) return prev;
            return [...prev, { id: m.id, senderId: m.sender_id, text: m.body, timestamp: m.created_at }];
          });
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [conversation.id]);

  const sendMessage = async () => {
    const body = input.trim();
    if (!body || sending) return;
    setSending(true);
    setInput("");
    const { data, error } = await supabase
      .from("messages")
      .insert({ conversation_id: conversation.id, sender_id: currentUserId, body })
      .select("id, sender_id, body, created_at")
      .single();
    if (!error && data) {
      setMessages((prev) =>
        prev.some((x) => x.id === data.id)
          ? prev
          : [...prev, { id: data.id, senderId: data.sender_id, text: data.body, timestamp: data.created_at }]
      );
      await supabase
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", conversation.id);
    }
    setSending(false);
  };

  const formatTime = (ts: string) => new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {activeCall && otherParticipant && (
        <CallWindow
          callerName={otherParticipant.name}
          callerInitial={otherParticipant.name.charAt(0)}
          mode={activeCall.mode}
          onEnd={() => setActiveCall(null)}
          compact={compact}
        />
      )}
      <div className={cn("flex flex-col", compact ? "h-full" : "h-[calc(100vh-12rem)]")}>
        <div className="flex items-center gap-3 p-3 border-b bg-card">
          {onBack && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
            {otherParticipant?.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{otherParticipant?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{otherParticipant?.role}</p>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setActiveCall({ mode: "voice" })}>
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setActiveCall({ mode: "video" })}>
              <Video className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20">
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                  isMe ? "bg-primary text-primary-foreground rounded-br-md" : "bg-card border rounded-bl-md"
                )}>
                  <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                  <p className={cn("text-[10px] mt-1", isMe ? "text-primary-foreground/60" : "text-muted-foreground")}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <div className="p-3 border-t bg-card flex gap-2">
          <Input
            placeholder="Type a message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1"
            disabled={sending}
          />
          <Button size="icon" onClick={sendMessage} disabled={!input.trim() || sending}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
