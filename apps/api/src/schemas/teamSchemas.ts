import { z } from "zod";

export const createTeamSchema = z.object({
  name: z.string().trim().min(2, "Team name must be at least 2 characters.").max(80),
  slug: z.string().trim().min(2).max(80).optional(),
});

export const inviteMemberSchema = z.object({
  email: z.string().trim().email(),
  role: z.enum(["member", "admin"]).default("member"),
});
