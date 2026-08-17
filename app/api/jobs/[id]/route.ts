import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { jobs } from "../../../../db/schema";

export async function PATCH(request: Request, context: { params: Promise<{ id:string }> }) {
  try {
    const { id } = await context.params; const p = await request.json() as Record<string, unknown>;
    const [job] = await getDb().update(jobs).set({ status:String(p.status||"待投"), updatedAt:new Date().toISOString() }).where(eq(jobs.id, Number(id))).returning();
    return Response.json({ job });
  } catch (error) { return Response.json({ error:error instanceof Error?error.message:"更新失败" }, { status:500 }); }
}
