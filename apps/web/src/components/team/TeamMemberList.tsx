import { RemoveMemberButton } from "./RemoveMemberButton";
import { MemberRoleSelect } from "./MemberRoleSelect";

type TeamMember = {
  id: string;
  email: string;
  name: string | null;
  role: string;
};

type PendingInvite = {
  id: string;
  email: string;
  role: string;
  status: string;
};

export function TeamMemberList({
  canManageMembers = false,
  members,
  pendingInvites = [],
  teamId,
}: {
  canManageMembers?: boolean;
  members: TeamMember[];
  pendingInvites?: PendingInvite[];
  teamId: string;
}) {
  return (
    <div style={{ border: "1px solid var(--sf-border)", borderRadius: "8px", overflow: "hidden" }}>
      <div
        style={{
          background: "var(--sf-surface-raised)",
          borderBottom: "1px solid var(--sf-border)",
          display: "grid",
          fontWeight: 700,
          gap: "12px",
          gridTemplateColumns: canManageMembers ? "1fr 140px 100px" : "1fr 120px",
          padding: "10px 12px",
        }}
      >
        <span>Member</span>
        <span>Role</span>
        {canManageMembers ? <span>Action</span> : null}
      </div>
      {members.map((member) => (
        <div
          key={member.id}
          style={{
            borderBottom: "1px solid var(--sf-border)",
            display: "grid",
            gap: "12px",
            gridTemplateColumns: canManageMembers ? "1fr 140px 100px" : "1fr 120px",
            padding: "10px 12px",
          }}
        >
          <span>{member.name || member.email}</span>
          {canManageMembers && member.role !== "owner" ? (
            <>
              <MemberRoleSelect memberId={member.id} role={member.role} teamId={teamId} />
              <RemoveMemberButton memberId={member.id} teamId={teamId} />
            </>
          ) : (
            <>
              <span style={{ textTransform: "capitalize" }}>{member.role}</span>
              {canManageMembers ? <span /> : null}
            </>
          )}
        </div>
      ))}
      {pendingInvites.map((invite) => (
        <div
          key={invite.id}
          style={{
            borderBottom: "1px solid var(--sf-border)",
            color: "var(--sf-muted)",
            display: "grid",
            gap: "12px",
            gridTemplateColumns: canManageMembers ? "1fr 140px 100px" : "1fr 120px",
            padding: "10px 12px",
          }}
        >
          <span>{invite.email} pending</span>
          <span style={{ textTransform: "capitalize" }}>{invite.role}</span>
          {canManageMembers ? <span /> : null}
        </div>
      ))}
    </div>
  );
}
