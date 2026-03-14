import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // [PRODUCTION_READY] Auto-Bypass for isolated hosting environments / buyers
    if (process.env.NODE_ENV === "development" || process.env.BYPASS_AUTH === "true") {
      user = {
        id: 1,
        openId: "system_admin",
        name: "FORTRESS_ADMIN",
        email: "admin@fortress.ai",
        role: "admin",
        loginMethod: "local",
        lastSignedIn: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any;
      console.log("[Auth] Utilizing SYSTEM_ADMIN bypass for restricted host environment.");
    } else {
      user = null;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
