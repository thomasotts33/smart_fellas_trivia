import { TeamCreateForm } from "@/components/team/TeamCreateForm";

export default function NewTeamPage() {
  return (
    <main style={{ minHeight: "100vh", padding: "32px" }}>
      <p style={{ color: "var(--sf-primary)", fontWeight: 700, margin: "0 0 8px" }}>Team setup</p>
      <h1 style={{ margin: "0 0 12px" }}>Create your trivia team</h1>
      <p style={{ color: "var(--sf-muted)", lineHeight: 1.5, margin: "0 0 24px", maxWidth: "640px" }}>
        Start with a shared team space. You can add teammates after the first team exists.
      </p>
      <TeamCreateForm />
    </main>
  );
}
