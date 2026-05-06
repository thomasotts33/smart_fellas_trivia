export type TeamRole = "owner" | "admin" | "member";

export function canManageGames(role?: string | null) {
  return role === "owner" || role === "admin";
}

export function canManageMembers(role?: string | null) {
  return role === "owner";
}
