# Generate App Description PDF

Create a downloadable PDF document containing the full description of the InternshipConnect app — features by role, all routes, the complete tech stack, and design system details.

## What you'll get

- A polished, multi-page PDF saved to `/mnt/documents/InternshipConnect-Overview.pdf`
- Cover page with app name and tagline
- Sections: Overview, Features by Role (Student, Recruiter, Admin), Communication & PWA features, Full route list, Technology stack tables, Design system, Architecture notes
- Clean typography, proper page breaks, and tables for libraries/routes
- A download link surfaced in chat once generated

## Technical approach

- Python + ReportLab (Platypus) to build the PDF with proper styling and page flow
- Visual QA pass: render pages to images and inspect for layout/clipping issues, fix and re-render until clean
- No project source files will be modified
