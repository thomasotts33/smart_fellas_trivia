import { apiFetch } from "./api";
import { getAuthOptions, getSessionIdentity } from "./session";

export type TeamSummary = {
  id: string;
  name: string;
  slug: string;
  role: string;
};

export async function getCurrentTeam() {
  const identity = await getSessionIdentity();
  const authOptions = getAuthOptions(identity);
  const me = await apiFetch<{ teams: TeamSummary[] }>("/api/me", authOptions);

  return {
    authOptions,
    team: me.teams[0] ?? null,
  };
}
