<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:form-patterns -->

# Form Patterns

Schemas in `src/lib/zodSchema.ts` — export both schema and `type X = z.infer<typeof xSchema>`.

Components use `"use client"`, `react-hook-form` + `@hookform/resolvers/zod`, and shadcn primitives:

```typescript
const { handleSubmit, control, formState: { isSubmitting } } = useForm({
  resolver: zodResolver(mySchema),
  defaultValues: { ... },
  mode: "all",
});
```

Each field goes through `Controller`:

```typescript
<Controller
  name="fieldName"
  control={control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>Label</FieldLabel>
      <Input {...field} id={field.name} aria-invalid={fieldState.invalid} autoComplete="..." />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

Submit: `<form onSubmit={handleSubmit(handler)} noValidate>`. Button disabled while submitting with icon toggle.

See existing examples under `src/components/Auth/`.

<!-- END:form-patterns -->

## Agent behavior

- **Ask questions.** When the request is ambiguous, when there are real implementation choices with tradeoffs, or before any non-obvious / destructive action, use the `question` tool to confirm. Prefer one short batched question over back-and-forth guessing.
- **Remember new learning.** When you discover something non-obvious about this repo — a gotcha, a convention, a fix, a command that wasn't documented — add it back to this file (or a clearly-scoped section) so future sessions benefit. Keep entries concise and high-signal; delete stale ones.
- **Use available skills and MCPs.** Before writing code for a task that matches a listed skill (e.g. `shadcn`, `prisma-*`, `next-*`, `better-auth-*`, `vercel-react-*`, `zod`, etc.), load it with the `skill` tool. And MCPs that are directly relevant to this stack e.g. **`shadcn`** (local; component registry / audit) and **`better-auth`** (remote; auth setup). Use them when the task fits instead of guessing from training data.

## Stack at a glance

- Next.js 16.2 + React 19.2 (App Router, Turbopack default, React Compiler on, `typedRoutes` on)
- Prisma 7 with `@prisma/adapter-neon` (PostgreSQL, Neon serverless driver)
- Tailwind CSS v4 (CSS-only config in `globals.css`; no `tailwind.config.ts`)
- shadcn/ui with the `base-luma` style preset; primitives from `@base-ui/react` (not Radix)
- `next-themes` (default `dark`, `enableSystem={false}`), `react-toastify`, `lucide-react`
- `@t3-oss/env-nextjs` + Zod for env validation
- Better Auth for authentication

## Verification

- **Primary check**: `bun lint` — runs `eslint` with `eslint-config-next` core-web-vitals + typescript.
- **Full build (prisma + ts)**: `bun run build` — runs `prisma generate && next build`. TypeScript errors surface only during build (no separate typecheck script; no test framework).
- **`bun prod` runs `next build && next start`** — does NOT run prisma generate or eslint. If schema changed, run `bun run build` first.

## Prisma (Prisma 7, PostgreSQL + Neon)

- Schema at `prisma/schema.prisma`. Generator: `provider = "prisma-client"` (Prisma 7 syntax, not `prisma-client-js`). Output to `../generated/prisma`.
- Import client as `import { PrismaClient } from "@generated/prisma/client"`. No `@prisma/client` import surface.
- **No `datasource.url` in schema.** The Prisma CLI URL comes from `prisma.config.ts` via `env("DIRECT_URL")`. The runtime adapter URL comes from `src/lib/database/dbClient.ts` using `serverEnv.DATABASE_URL`.
- Runtime uses `@prisma/adapter-neon` (Neon serverless driver for PostgreSQL). `dbClient.ts` is a `globalThis` singleton (HMR-safe). Do not instantiate `PrismaClient` elsewhere.
- `serverEnv.DATABASE_URL` validated to start with `postgresql://`. Both `DATABASE_URL` and `DIRECT_URL` are required env vars.
- No migrations exist yet — `bun migrate` (`prisma migrate dev && prisma generate`) creates `prisma/migrations/`. Use this for schema changes, not `prisma db push`.
- `bun studio` runs headless (`--browser none`); open the printed URL manually.
- `generated/**` is gitignored and excluded from ESLint. Do not hand-edit.
- Both `build` and `migrate` scripts prepend `prisma generate` — running raw `next build` will fail with stale generated types.

## Env validation (T3 env)

- `src/lib/env/serverEnv.ts` and `src/lib/env/clientEnv.ts` define Zod schemas via `@t3-oss/env-nextjs`.
- `serverEnv.ts` uses `experimental__runtimeEnv: process.env` — keep this prefix verbatim.
- `next.config.ts` imports both env files **as side effects** at the top to trigger validation at load time. Do not remove these imports.
- New vars: add to `serverEnv.ts` (server, non-`NEXT_PUBLIC_*`) or `clientEnv.ts` (must be `NEXT_PUBLIC_*`), then mirror in `.env.example`.
- Required env: `DATABASE_URL`, `DIRECT_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`. Optional: `BETTER_AUTH_ALLOWED_ORIGINS`, `BETTER_AUTH_TELEMETRY`, S3 vars, `CHECKPOINT_DISABLE`.

## Styling

- Tailwind v4: all config lives in `src/app/globals.css` via `@theme` and `@custom-variant`. PostCSS plugin is `@tailwindcss/postcss`. No `tailwind.config.ts` — do not create one.
- `globals.css` imports `shadcn/tailwind.css` and `tw-animate-css`. Removing either breaks tokens or animations.
- Prettier: `singleAttributePerLine: true`, `bracketSameLine: true`, `experimentalTernaries: true`, `prettier-plugin-tailwindcss`. JSX props one per line, closing bracket same line.

## shadcn / Base UI

- `components.json` sets `ui` → `@/components/shadcnui` (not default `@/components/ui`). Use `bunx shadcn add ...`; components land in `src/components/shadcnui/`.
- Shipped `Button` wraps `Button as ButtonPrimitive` from `@base-ui/react/button`. Do not introduce Radix or `react-aria` primitives — they don't share Base Luma styling.

## Better Auth

- Server: `src/lib/auth.ts` — configures `betterAuth()` with email/password, email verification, admin plugin, `nextCookies()` plugin, session cookies, rate limiting, Argon2 password hashing via `@node-rs/argon2` with `BETTER_AUTH_SECRET` as secret key.
- Client: `src/lib/auth-client.ts` — `createAuthClient()` with `inferAdditionalFields` + `adminClient()` plugins. Import as `authClient`.
- API route: `src/app/api/auth/[...all]/route.ts` — single `{ GET, POST }` handler via `toNextJsHandler(auth.handler)`.
- Server component session check: `auth.api.getSession({ headers: await headers() })`.
- Client component session: `authClient.useSession()` returns `{ data, isPending, error }`.
- Auth methods: `authClient.signIn.email(...)`, `authClient.signUp.email(...)`, `authClient.requestPasswordReset(...)`, `authClient.resetPassword(...)`.
- Rate limits configured: sign-in 10/5min, sign-up 5/10min, reset-password 3/15min.

## Auth routing layout

- `(public)/` route group: home page (`/`) = login page in centered card layout. Register, forgot-password, reset-password sub-pages. Guest-accessible.
- `(private)/` route group: layout checks session via `auth.api.getSession()` server-side and redirects to `/` if null. Also renders `Header` component.
- Pages rendering LoginForm or RegisterForm must wrap them in `<Suspense>` (they use `useSearchParams()` for callback URL). Build fails without it.
- Callback URL pattern: `searchParams.get("redirect") ?? "/"` passed as `callbackURL` to signIn/signUp.

## Path aliases (`tsconfig.json`)

- `@/*` → `./src/*`
- `@generated/*` → `./generated/*` (Prisma client only)

## Reserved directories

- `src/server/` — server-only modules (server actions, anything importing `server-only`).
- `src/hooks/` — custom React hooks.

## Package manager

- `bun.lock` committed; Bun is the primary workflow (`bun install`, `bun <script>`). npm works but scripts and README assume `bun`.

## Misc

- ESLint ignores: `.next/**`, `out/**`, `build/**`, `next-env.d.ts`, `generated/**`.
- `.env` is gitignored; `.env.example` is the committed template. Do not commit secrets.
- `CHECKPOINT_DISABLE=1` silences Prisma telemetry. `BETTER_AUTH_TELEMETRY=0` silences Better Auth telemetry.
- No CI workflows or pre-commit hooks. Pre-PR verification: `bun lint` then `bun run build`.
