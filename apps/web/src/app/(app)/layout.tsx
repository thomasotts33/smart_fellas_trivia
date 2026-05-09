import { redirect } from "next/navigation";
import { AppShell } from "@/components/navigation/AppShell";
import { getSessionIdentity } from "@/lib/session";

export default async function ProtectedAppLayout({ children }: { children: React.ReactNode }) {
  const identity = await getSessionIdentity();

  if (!identity) {
    redirect("/sign-in");
  }

  return <AppShell>{children}</AppShell>;
}
