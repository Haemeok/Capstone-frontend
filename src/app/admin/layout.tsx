import { requireAdminPage } from "@/shared/lib/admin-guard";

// Admin routes are per-request (cookie-based auth + env-gated). Forcing dynamic
// here prevents build-time prerender from running requireAdminPage, which would
// throw without ADMIN_USER_ID/cookies in the build environment.
export const dynamic = "force-dynamic";

// Server component (no "use client"). Runs requireAdminPage on every render
// of any /admin/* route, including curation-test which previously had no gate.
// Failure → notFound() (404) so admin routes aren't enumerable.
const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  await requireAdminPage();
  return <>{children}</>;
};

export default AdminLayout;
