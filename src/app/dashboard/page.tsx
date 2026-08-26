import { redirect } from "next/navigation";
import { auth } from "../../../auth";

export default async function DashboardRedirect() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  redirect(session.user.role === "ADMIN" ? "/dashboard/admin" : session.user.role === "CLIENT" ? "/dashboard/client" : "/dashboard/security");
}
