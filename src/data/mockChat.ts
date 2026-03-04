export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface ChatConversation {
  id: string;
  participants: { id: string; name: string; role: "student" | "recruiter"; avatar?: string }[];
  messages: ChatMessage[];
  lastActivity: string;
}

export const mockConversations: ChatConversation[] = [
  {
    id: "conv-1",
    participants: [
      { id: "1", name: "Alex Johnson", role: "student" },
      { id: "2", name: "Sarah Chen", role: "recruiter" },
    ],
    lastActivity: "2026-03-04T10:30:00",
    messages: [
      { id: "m1", senderId: "2", text: "Hi Alex! I saw your application for the Frontend Internship. Your portfolio looks impressive.", timestamp: "2026-03-04T10:00:00" },
      { id: "m2", senderId: "1", text: "Thank you, Sarah! I'm really excited about the opportunity at TechCorp.", timestamp: "2026-03-04T10:05:00" },
      { id: "m3", senderId: "2", text: "Would you be available for a quick video call this week to discuss the role?", timestamp: "2026-03-04T10:15:00" },
      { id: "m4", senderId: "1", text: "Absolutely! I'm free Wednesday and Thursday afternoon. What works best for you?", timestamp: "2026-03-04T10:30:00" },
    ],
  },
  {
    id: "conv-2",
    participants: [
      { id: "1", name: "Alex Johnson", role: "student" },
      { id: "5", name: "Lisa Park", role: "recruiter" },
    ],
    lastActivity: "2026-03-03T16:45:00",
    messages: [
      { id: "m5", senderId: "5", text: "Hello Alex, we have an opening for a Data Analyst intern at GlobalFin. Would you be interested?", timestamp: "2026-03-03T14:00:00" },
      { id: "m6", senderId: "1", text: "Hi Lisa! That sounds great. Could you tell me more about the day-to-day responsibilities?", timestamp: "2026-03-03T14:30:00" },
      { id: "m7", senderId: "5", text: "You'd be working with our analytics team on financial datasets, building dashboards, and creating reports. We use Python and Tableau.", timestamp: "2026-03-03T16:45:00" },
    ],
  },
  {
    id: "conv-3",
    participants: [
      { id: "6", name: "Jordan Lee", role: "student" },
      { id: "2", name: "Sarah Chen", role: "recruiter" },
    ],
    lastActivity: "2026-03-02T09:20:00",
    messages: [
      { id: "m8", senderId: "6", text: "Hi Sarah, I wanted to follow up on my application for the UX Design internship.", timestamp: "2026-03-02T09:00:00" },
      { id: "m9", senderId: "2", text: "Hi Jordan! Thanks for reaching out. We're still reviewing applications and will get back to you by end of this week.", timestamp: "2026-03-02T09:20:00" },
    ],
  },
];
