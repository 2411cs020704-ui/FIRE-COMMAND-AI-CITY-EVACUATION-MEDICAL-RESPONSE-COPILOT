import { invokeLLM } from "../_core/llm";

export interface PolicyBrief {
  title: string;
  recommendation: string;
  targetSDG: string;
  impactEstimate: string;
}

/**
 * Generates Urban Policy Briefs based on current simulation metrics
 */
export async function generatePolicyBrief(metrics: {
  waste: number;
  transit: number;
  density: number;
}): Promise<PolicyBrief> {
  const systemPrompt = "You are an Urban Policy Consultant for the MRUH Fortress (SDG 11). Your goal is to provide strategic, high-level policy recommendations based on urban health metrics.";

  const userPrompt = `
CURRENT METRICS:
- Waste Efficiency: ${metrics.waste}%
- Transit Flow: ${metrics.transit}%
- Housing Density: ${metrics.density}%

Generate one strategic policy recommendation to improve the lowest performing metric. Focus on aggressive, high-tech solutions (e.g., IoT, Blockchain, Autonomous systems).

Return valid JSON with keys: title, recommendation, targetSDG, impactEstimate.`;

  const response = await invokeLLM({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ] as any,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "policy_brief",
        strict: true,
        schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            recommendation: { type: "string" },
            targetSDG: { type: "string" },
            impactEstimate: { type: "string" },
          },
          required: ["title", "recommendation", "targetSDG", "impactEstimate"],
          additionalProperties: false,
        },
      },
    },
  } as any);

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No response from LLM");

  const contentStr = typeof content === "string" ? content : JSON.stringify(content);
  return JSON.parse(contentStr) as PolicyBrief;
}
