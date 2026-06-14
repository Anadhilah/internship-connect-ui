// Shared chat types backed by the database
export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface ChatParticipant {
  id: string;
  name: string;
  role: "student" | "recruiter";
  avatar?: string | null;
}

export interface ChatConversation {
  id: string;
  participants: ChatParticipant[];
  messages: ChatMessage[];
  lastActivity: string;
}
