import { requireAdminPage } from "@/shared/lib/admin-guard";

export const dynamic = "force-dynamic";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  await requireAdminPage();
  return <>{children}</>;
};

export default AdminLayout;
