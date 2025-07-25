# SecureSight Security Monitoring Dashboard

A modern, real-time dashboard for monitoring live and recorded video feeds, managing security incidents, and ensuring facility safety. Built with React, Vite, Supabase, and Tailwind CSS.

## Features
- Live and recorded camera feed monitoring
- Real-time incident list and status updates
- Incident resolution and management
- Camera management and details view
- Responsive, dark-themed UI
- Supabase integration for authentication, data, and real-time updates

## Tech Stack
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd secure-sight-pulse-view-main
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the project root with:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```
You can find these in your Supabase project settings.

### 4. Run the app
```bash
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure
- `src/pages/` — Main app pages (Dashboard, Incidents, Cameras, etc.)
- `src/components/` — Reusable UI components
- `src/assets/` and `public/images/` — Images and static assets
- `supabase/` — Supabase migrations and types

## Customization
- Update the logo and images in `public/images/` or `src/assets/` as needed.
- Edit `index.html` for meta tags and branding.
- Adjust Tailwind config for custom styles.

## License
This project is for internal use. Contact the SecureSight team for more information.
