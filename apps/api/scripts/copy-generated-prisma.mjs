import { cp, rm } from "node:fs/promises";
import path from "node:path";

const appRoot = path.resolve(import.meta.dirname, "..");
const source = path.join(appRoot, "src", "generated", "prisma");
const target = path.join(appRoot, "dist", "src", "generated", "prisma");

await rm(target, { force: true, recursive: true });
await cp(source, target, { recursive: true });
