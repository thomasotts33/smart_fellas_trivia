import { z } from "zod";

const clientConfigSchema = z.object({
  API_BASE_URL: z.string().url(),
});

export const clientConfig = clientConfigSchema.parse({
  API_BASE_URL: process.env.API_BASE_URL ?? "http://localhost:4000",
});
