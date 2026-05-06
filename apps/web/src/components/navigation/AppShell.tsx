import { Sidebar } from "./Sidebar";
import { getCurrentTeam } from "@/lib/team";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const { team } = await getCurrentTeam();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "240px 1fr",
        minHeight: "100vh",
      }}
    >
      <Sidebar role={team?.role} />
      <main style={{ padding: "24px" }}>{children}</main>
    </div>
  );
}
