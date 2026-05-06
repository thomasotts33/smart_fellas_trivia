import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });
dotenv.config();

process.env.NODE_ENV = "test";
process.env.DATABASE_URL = process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/smartfellas";
process.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET ?? "test-secret";
process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
process.env.API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:4000";
process.env.WEB_ORIGIN = process.env.WEB_ORIGIN ?? "http://localhost:3000";
process.env.PORT = process.env.PORT ?? "4000";
