import { requireAdminPage } from "@/shared/lib/admin-guard";

// Server component (no "use client"). Runs requireAdminPage on every render
// of any /admin/* route, including curation-test which previously had no gate.
// Failure → notFound() (404) so admin routes aren't enumerable.
const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  await requireAdminPage();
  return <>{children}</>;
};

export default AdminLayout;
