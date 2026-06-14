
# Backend Migration Plan — InternshipConnect

Move InternshipConnect from a frontend-only app with mock data and a half-wired `localhost:5000` API to a fully functional backend on **Lovable Cloud** (a fresh Supabase project provisioned and managed inside Lovable — no external account needed). The existing standalone Supabase project is left untouched.

## Goals
- Real authentication (email/password + Google), with persisted sessions.
- User profiles and proper role storage (student, recruiter, admin).
- Persisted internships, applications, recruiter verification, and meetings.
- Real-time chat between students and recruiters (replaces in-memory mock).
- Mock data seeded as starter content.
- Calls remain a simulated UI for now (real WebRTC is a much larger project we can tackle later).

---

## Phase 1 — Provision Lovable Cloud
- Enable Lovable Cloud. This creates a brand-new backend (database, auth, storage, edge functions). The Supabase client is auto-wired into the project.
- Configure Auth: email/password enabled, Google sign-in enabled, leaked-password protection on, email confirmation off for smoother local testing.

## Phase 2 — Database Schema
Tables (all in `public`, all with RLS and explicit grants):

```text
profiles            id (= auth.uid), display_name, avatar_url, bio, created_at
user_roles          user_id, role (enum: student | recruiter | admin)
recruiter_orgs      id, owner_id, name, website, status (pending|approved|rejected)
student_profiles    user_id, university, major, graduation_year, skills[], resume_url
internships         id, recruiter_id, org_id, title, description, location,
                    type (remote|hybrid|onsite), stipend, deadline, status, created_at
applications        id, internship_id, student_id, cover_letter, resume_url,
                    status (pending|reviewing|accepted|rejected), created_at
conversations       id, student_id, recruiter_id, last_message_at
messages            id, conversation_id, sender_id, body, created_at, read_at
meetings            id, conversation_id, host_id, guest_id, scheduled_at, status
```

- `has_role(uuid, app_role)` security-definer function backs all role checks (avoids recursive RLS).
- Trigger on `auth.users` insert auto-creates a `profiles` row and assigns a default role from signup metadata.
- Realtime enabled on `messages` and `conversations`.
- Storage buckets: `avatars` (public), `resumes` (private with owner-only RLS).

## Phase 3 — Auth Rewiring
- Replace the Axios `localhost:5000` `AuthContext` with a Supabase-backed context:
  - `onAuthStateChange` listener registered first; `getUser()` used for trusted checks.
  - Email/password sign in & sign up with `emailRedirectTo: window.location.origin`.
  - Google OAuth button on Login + Register.
  - Role chosen at signup (student / recruiter); admin role cannot be self-assigned.
  - `/reset-password` route added for password recovery.
- `ProtectedRoute` reads role from `user_roles` (via a cached query in the auth context) instead of localStorage.
- Remove `mockUsers`, redundant `ic_role` / `ic_name` / `ic_email` localStorage keys, and the unused `services/auth.ts` axios helpers.

## Phase 4 — Data Layer
Replace hardcoded arrays with Supabase queries (via TanStack Query, already in the project):
- **Student**: Browse Internships, Internship Details, My Applications, Apply flow.
- **Recruiter**: Post Internship, Manage Internships (edit/delete), Applicants list with real status updates.
- **Admin**: Manage Recruiters (approve/reject), Manage Users, Manage Internships.
- **Student Onboarding**: writes to `student_profiles`.
- **Recruiter Verification**: creates `recruiter_orgs` row with `pending`; admin approval flips status; `/recruiter/pending` reads live status.

## Phase 5 — Real-time Chat
- `FloatingChat`, `ConversationList`, `ChatWindow` rewritten on top of `conversations` + `messages`.
- Subscribe to new messages via Supabase Realtime; mark `read_at` on view.
- Sending a message upserts the conversation and bumps `last_message_at`.

## Phase 6 — Meetings & Calls
- `meetings` persisted; scheduling and listing become real CRUD.
- `CallWindow` keeps its simulated audio/video for now (clearly labeled). We'll plan a separate WebRTC milestone when you're ready.

## Phase 7 — Seed Data
Run a one-off seed script (via SQL migration with `INSERT … ON CONFLICT DO NOTHING`) to load the existing mock content:
- 3 demo users (student/recruiter/admin) — created in Auth via the Supabase admin API in a setup edge function the first time it's invoked.
- 6 internships from `BrowseInternships.tsx`.
- Sample applications, 3 conversations + messages from `mockChat.ts`, 4 meetings from `mockMeetings.ts`.

## Phase 8 — Cleanup & Verification
- Delete `src/data/mockChat.ts`, `mockMeetings.ts`, `mockUsers`, axios `api.ts`, `services/auth.ts`.
- Verify: login as each role, post an internship, apply, status change, real-time chat between two browser tabs, recruiter approval flow, password reset.
- Run security scan and fix any RLS gaps before declaring done.

---

## Technical notes
- Stack additions: `@supabase/supabase-js` (auto-installed by Cloud). No other deps required.
- Roles stored exclusively in `user_roles` (never on `profiles`) to prevent privilege escalation.
- Every new public table will get explicit `GRANT`s for `authenticated` / `service_role` alongside its RLS policies.
- The existing standalone Supabase project you mentioned is **not** touched — this new Lovable Cloud project is independent.
- This is a large migration; I'll execute it in the phase order above and check in after Phase 3 (auth working end-to-end) before continuing, so you can sanity-check before we wipe the mock data.
