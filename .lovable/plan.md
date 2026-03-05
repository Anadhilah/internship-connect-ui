

## Plan: Add Video/Voice Call Feature

### Overview
Add a frontend-only call system with both video and voice capabilities. Calls can be initiated from chat conversations and also scheduled via a dedicated meetings page. Since this is frontend-only, calls will be simulated with a realistic call UI (no actual WebRTC).

### What will be built

**1. Call UI Component** (`src/components/chat/CallWindow.tsx`)
- Full-screen overlay with caller info, call timer, and controls
- Toggle between video/voice mode
- Controls: mute, camera on/off, end call
- Simulated "ringing" → "connected" → "ended" states
- Compact mode for floating widget

**2. Call buttons in ChatWindow**
- Add Phone and Video icons to the chat header next to the participant name
- Clicking either launches the CallWindow in the appropriate mode

**3. Meetings/Schedule Page** (`src/pages/student/Meetings.tsx` and `src/pages/recruiter/Meetings.tsx`)
- List of upcoming/past mock meetings with date, time, participant, and type (video/voice)
- "Schedule Meeting" button opening a dialog with: participant selector, date/time picker, call type toggle
- Join button that opens CallWindow

**4. Mock Data** (`src/data/mockMeetings.ts`)
- Sample scheduled meetings for demo purposes

**5. Routing & Navigation Updates**
- Add `/student/meetings` and `/recruiter/meetings` routes in `App.tsx`
- Add "Meetings" nav item with `Video` icon to both `StudentLayout` and `RecruiterLayout` sidebars

### Files to create/modify
| File | Action |
|------|--------|
| `src/components/chat/CallWindow.tsx` | Create — call UI with timer, controls, states |
| `src/data/mockMeetings.ts` | Create — mock meeting data |
| `src/pages/student/Meetings.tsx` | Create — student meetings page |
| `src/pages/recruiter/Meetings.tsx` | Create — recruiter meetings page |
| `src/components/chat/ChatWindow.tsx` | Modify — add call buttons to header |
| `src/components/layouts/StudentLayout.tsx` | Modify — add Meetings nav item |
| `src/components/layouts/RecruiterLayout.tsx` | Modify — add Meetings nav item |
| `src/App.tsx` | Modify — add meeting routes |

