import { AppShell } from "@/components/navigation/AppShell";

export default function ProtectedAppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
