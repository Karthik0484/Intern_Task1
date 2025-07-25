# Secure Sight Pulse View

## Deployment Instructions

1. Install dependencies:
   ```bash
   npm install
   ```
2. Environment setup:
   - Copy `.env.example` to `.env` and fill in your Supabase credentials (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
3. Add images:
   - Place all incident images in the `public/images/` folder. Filenames should match the `thumbnail_url` field in your database (e.g., `incident1.jpg`).
4. Run locally:
   ```bash
   npm run dev
   ```
   - Visit [http://localhost:3000](http://localhost:3000) in your browser.
5. Build for production:
   ```bash
   npm run build
   npm run preview
   ```
   - Deploy the `dist` folder to your preferred static hosting provider (e.g., Vercel, Netlify).

## Tech Decisions

- Frontend: React (Vite) with functional components and hooks for state management.
- Styling: Tailwind CSS for rapid, consistent, and modern UI development.
- Backend/Data: Supabase for authentication and incident data storage (PostgreSQL + Realtime).
  - No external storage/CDN is used for images in this version.
- Live Updates: Uses Supabase's realtime channels for incident updates.

## If I had more time… (Future Improvements)

- Add image upload and management UI (with drag-and-drop and preview).
- Support for storing and serving images from Supabase Storage or a CDN for scalability.
- Add role-based access control and more granular permissions.
- Implement advanced filtering, search, and analytics for incidents.
- Add video support for incidents (not just images).
- Improve mobile responsiveness and accessibility.
- Add automated tests (unit, integration, and E2E).
- Add error boundaries and more robust error handling.
- Internationalization (i18n) and localization support.
- Performance optimizations for large incident datasets.
