# Frontend Setup Guide (React + Next.js + TypeScript)

## 1) Start after pulling repository
1. Install dependencies: `npm install`
2. Create `.env.local` and set API URLs.
3. Run development server: `npm run dev`

## 2) Workflow after receiving UI from design team
1. Convert design to feature tasks (auth, marketplace, community...).
2. Build layout shell first (`Navbar`, `Sidebar`, dashboard layout).
3. Implement reusable UI components inside `src/components/ui`.
4. Build feature components under `src/components/features/*`.
5. Connect API services in `src/lib/api/services/*`.
6. Add type-safe contracts in `src/types/*`.

## 3) Recommended order
- Global tokens/styles
- Layouts
- Shared components
- Feature pages
- API integration
- Validation and polish
