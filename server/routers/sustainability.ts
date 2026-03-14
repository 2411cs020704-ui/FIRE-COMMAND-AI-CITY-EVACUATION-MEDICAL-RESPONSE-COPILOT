import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { generatePolicyBrief } from "../agent/policy";

export const sustainabilityRouter = router({
  getPolicyBrief: publicProcedure
    .input(z.object({
      waste: z.number(),
      transit: z.number(),
      density: z.number(),
    }))
    .mutation(async ({ input }) => {
      return await generatePolicyBrief(input);
    }),
});
