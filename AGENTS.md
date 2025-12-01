# Repository Guidelines

## Project Structure & Modules
- `src/main.tsx` boots the React 19 + Vite app and applies the global dark theme from `src/index.css`.
- `src/App.tsx` is the landing experience; reusable UI primitives live in `src/components/ui/*`; data visualizations live in `src/components/charts`.
- Domain data and config are in `src/data`; shared hooks in `src/hooks`; utilities in `src/lib`; static assets in `src/assets`; static files served as-is from `public/`.
- Path alias `@/*` resolves to `./src/*` (see `tsconfig.json`); prefer it for intra-app imports.

## Build, Test, and Development Commands
- `npm run dev` — start Vite dev server with hot reload.
- `npm run build` — type-check via project references then generate production build to `dist/`.
- `npm run preview` — serve the built app locally to verify production output.
- `npm run lint` — ESLint flat config (TypeScript, React Hooks, React Refresh); run before opening a PR.

## Coding Style & Naming Conventions
- Language: TypeScript with strict compiler options; JSX via the React runtime.
- Components are functional; keep stateful logic in hooks (`src/hooks`) and presentation in components.
- Styling uses Tailwind CSS v4 utilities declared in `src/index.css`; prefer utility-first classes and shared tokens over inline styles.
- Use the `@/` alias, descriptive file names (`FeaturePanel.tsx`, `useChartData.ts`), and named exports when multiple items are present.
- Keep components small; pass explicit props objects rather than spreading unrelated values.

## Testing Guidelines
- No automated tests exist yet; before shipping, run `npm run build` and exercise key flows locally (landing hero, chart interactions, navigation buttons).
- If adding tests, use Vitest + React Testing Library to match the Vite toolchain; mirror file names with `.test.tsx` beside the component.
- Aim for coverage of data transforms in `src/lib` and interaction-heavy components; prefer deterministic fixture data from `src/data`.

## Commit & Pull Request Guidelines
- Commits: present-tense, concise subject (≤72 chars), e.g., `Add Sankey legend interactions`; group logical changes and avoid mixed concerns.
- PRs should include: short summary, screenshots/gifs for UI changes, noted manual checks (dev/build/lint), and linked issue or ticket when available.
- Keep diffs minimal; update docs and sample data when behavior changes; mention any new npm scripts or environment assumptions.

## Security & Configuration Tips
- Secrets are not expected; avoid introducing runtime env variables without documenting defaults.
- Keep dependencies minimal; prefer existing UI primitives over new libraries to reduce bundle size.
