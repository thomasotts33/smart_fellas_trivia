import { z } from "zod";

export const upsertCategorySchema = z.object({
  name: z.string().trim().min(1, "Category name is required.").max(80),
});
