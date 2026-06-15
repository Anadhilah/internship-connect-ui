# Refactor Recruiter Signup — Split Auth from Company Verification

Mirror the student flow: recruiters create an account on the unified `/register` page, then complete a separate recruiter onboarding page for company details.

## Flow

```text
/register  (email+password OR Google, role=recruiter)
   ↓ auth user + profile + recruiter role created
/recruiter/onboarding  (company info — was steps 2–4)
   ↓ inserts row in recruiter_orgs (status=pending)
/recruiter/pending-approval  (waits for admin)
   ↓ admin approves
/recruiter/dashboard
```

## Changes

**`src/pages/Register.tsx`** (unified register)
- Add a role selector (Student / Recruiter) like Login already has, or accept `?role=recruiter` query param.
- On recruiter signup, set `raw_user_meta_data.role = 'recruiter'` so the `handle_new_user` trigger assigns the recruiter role.
- After signup, redirect recruiters to `/recruiter/onboarding` instead of the dashboard.

**`src/pages/recruiter/Onboarding.tsx`** (new)
- 3-step wizard reusing the existing step UI from `Register.tsx`:
  1. Company info (name, website, industry, size, address, description)
  2. Verification docs (registration #, tax ID, proof file upload to `resumes` bucket or a new `verification-docs` bucket)
  3. Review & submit
- On submit: `INSERT INTO recruiter_orgs (...)` with `status='pending'`, owner = `auth.uid()`.
- Redirect to `/recruiter/pending-approval`.

**`src/pages/recruiter/Register.tsx`** (delete)
- Remove file and its route. Replace any links to `/register/recruiter` with `/register?role=recruiter`.

**`src/components/ProtectedRoute.tsx`** / route guards
- If a logged-in recruiter has no `recruiter_orgs` row → force redirect to `/recruiter/onboarding`.
- If their org `status='pending'` → redirect to `/recruiter/pending-approval`.

**`src/App.tsx`**
- Remove `/register/recruiter` route.
- Add `/recruiter/onboarding` route (auth-required, recruiter role).

## DB

No schema migration required — `recruiter_orgs` already exists. We just start populating the columns currently dropped on the floor (registration_number, tax_id, etc.). If those columns are missing from the table, a small migration will add them (will confirm by reading the schema during implementation).

## Out of scope

- Admin approval UI (already exists per memory `recruiter/verification`).
- Changing student flow.
- Visual redesign of the steps — reuse current styling.

## Memory updates after build

- Update `mem://features/recruiter/verification` to reflect the new two-stage flow.

Confirm and I'll switch to build mode.