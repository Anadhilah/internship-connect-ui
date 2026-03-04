import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mockConversations, ChatConversation } from "@/data/mockChat";
import ConversationList from "@/components/chat/ConversationList";
import ChatWindow from "@/components/chat/ChatWindow";
import { MessageCircle } from "lucide-react";

export default function RecruiterMessages() {
  const { user } = useAuth();
  const [selected, setSelected] = useState<ChatConversation | null>(null);

  const conversations = mockConversations.filter((c) =>
    c.participants.some((p) => p.id === user?.id)
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold">Messages</h2>
        <p className="text-muted-foreground">Chat with applicants and potential interns.</p>
      </div>

      <div className="border rounded-xl bg-card shadow-card overflow-hidden" style={{ height: "calc(100vh - 14rem)" }}>
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <MessageCircle className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="font-display font-semibold text-lg">No messages yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Start conversations with applicants from the Applicants page.
            </p>
          </div>
        ) : (
          <div className="flex h-full">
            <div className={`w-full md:w-80 border-r flex-shrink-0 ${selected ? "hidden md:flex md:flex-col" : "flex flex-col"}`}>
              <ConversationList
                conversations={conversations}
                currentUserId={user?.id || ""}
                selectedId={selected?.id}
                onSelect={setSelected}
              />
            </div>
            <div className={`flex-1 ${!selected ? "hidden md:flex" : "flex"} flex-col`}>
              {selected ? (
                <ChatWindow
                  conversation={selected}
                  currentUserId={user?.id || ""}
                  onBack={() => setSelected(null)}
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <MessageCircle className="h-10 w-10 text-muted-foreground/20 mb-3" />
                  <p className="text-sm text-muted-foreground">Select a conversation to start chatting</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
