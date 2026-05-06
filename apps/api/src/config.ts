import path from "node:path";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });
dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL"),
  API_BASE_URL: z.string().url("API_BASE_URL must be a valid URL").default("http://localhost:4000"),
  WEB_ORIGIN: z.string().url("WEB_ORIGIN must be a valid URL").default("http://localhost:3000"),
  PORT: z.coerce.number().int().positive().default(4000),
});

export type ApiConfig = z.infer<typeof envSchema>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ApiConfig {
  const result = envSchema.safeParse(env);

  if (!result.success) {
    const message = result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
    throw new Error(`Invalid API environment: ${message}`);
  }

  return result.data;
}

export const config = loadConfig();
