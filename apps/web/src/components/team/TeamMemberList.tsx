type TeamMember = {
  id: string;
  email: string;
  name: string | null;
  role: string;
};

export function TeamMemberList({ members }: { members: TeamMember[] }) {
  return (
    <div style={{ border: "1px solid var(--sf-border)", borderRadius: "8px", overflow: "hidden" }}>
      <div
        style={{
          background: "var(--sf-surface-raised)",
          borderBottom: "1px solid var(--sf-border)",
          display: "grid",
          fontWeight: 700,
          gap: "12px",
          gridTemplateColumns: "1fr 120px",
          padding: "10px 12px",
        }}
      >
        <span>Member</span>
        <span>Role</span>
      </div>
      {members.map((member) => (
        <div
          key={member.id}
          style={{
            borderBottom: "1px solid var(--sf-border)",
            display: "grid",
            gap: "12px",
            gridTemplateColumns: "1fr 120px",
            padding: "10px 12px",
          }}
        >
          <span>{member.name || member.email}</span>
          <span style={{ textTransform: "capitalize" }}>{member.role}</span>
        </div>
      ))}
    </div>
  );
}
