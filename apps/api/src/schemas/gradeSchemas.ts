import { z } from "zod";

export const gradeBodySchema = z.object({
  quizId: z.string().min(1),
  answer: z.string().min(1),
});
export type GradeBody = z.infer<typeof gradeBodySchema>;
