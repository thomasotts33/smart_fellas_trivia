import { Sidebar } from "./Sidebar";
import { getCurrentTeam } from "@/lib/team";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const { team } = await getCurrentTeam();

  return (
    <div className="sf-app-shell">
      <Sidebar role={team?.role} />
      <main className="sf-app-main">{children}</main>
    </div>
  );
}
