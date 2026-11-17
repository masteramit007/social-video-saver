# Project rules

- Routing is file-based TanStack Start under `src/routes/`; the shared layout (navbar, footer, background, providers, GTM) lives in `src/routes/__root.tsx`. Why: server-side rendering needs one root shell.
- Page components in `src/pages/` import router helpers from `@/lib/router-compat` (react-router-style API over TanStack). Why: keeps call sites unchanged after the migration.
- `/download/$platform` serves both region hubs and platform pages, choosing by `REGION_BY_ID`. Why: one URL pattern, no route conflicts.
- Per-page SEO tags come from `<SEOHead>` (react-helmet-async v3, React 19 native hoisting), so they render in server HTML; do not add title/description/og tags to the root `head()`. Why: avoids duplicate tags.
- UI language is derived from the URL prefix (`languageFromPath`) with a per-render i18n clone in `__root.tsx`; no browser language detection. Why: server and browser must render identical text to avoid hydration errors.
- Never add static `index.html` stubs under `public/`. Why: static files override server-rendered routes.
- Code that touches `window`/`document`/`localStorage` must run inside effects or event handlers, never during render or at module scope. Why: pages render on the server too.
- Contact messages use a public POST server function with shared schema validation and server-only inserts into contact_submissions; visitors have no table access. Why: anonymous contact must persist without exposing private messages.
- The contact route owns its head metadata without SEOHead. Why: avoids duplicate metadata while using native route head management on this updated page.
