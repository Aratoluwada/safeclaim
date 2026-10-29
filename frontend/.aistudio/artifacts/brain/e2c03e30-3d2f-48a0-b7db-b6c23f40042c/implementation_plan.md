# SafeClaim AI — Initial View & Verification Assistant Alignment (Completed)

The root application entry point (`/`) now directly renders the Public Ask verification assistant as specified in `FRONTEND_SPEC.md` (`Route: / or /ask`), with the newsroom aesthetic, official evidence grounding interface, and the Rumour Desk readily accessible.

### Completed Changes

- **Root Route Aligned to Ask Assistant**: Route `/` and `/ask` both render `AskPage`, immediately presenting the mandatory official disclaimer banner, the search input, the 4 canonical starter prompts, and instant verification answers.
- **Top Bar & Active Route Highlighting**: Updated `Navbar.tsx` so the "Ask SafeClaim" nav item highlights when on either `/` or `/ask`. Preserved the "Rumour Desk", "Overview", "How It Works", "Verdicts", and "FAQ" tabs.
- **Dual Localization (English / Naija Pidgin)**: Instant language switching across all views, search placeholder, starter cards, grounded verdicts, and hotline callouts.
- **Dev Server Refreshed**: Restarted Vite dev server to guarantee that newly compiled assets and styles are immediately served without caching issues.
- **Verification & Unit Tests**: Verified build compilation with `tsc --noEmit` and Vite build; unit tests for the brief generator all pass cleanly.
