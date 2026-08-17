import { desc } from "drizzle-orm";
import { getDb } from "../../../db";
import { jobs } from "../../../db/schema";

export async function GET() {
  try { return Response.json({ jobs: await getDb().select().from(jobs).orderBy(desc(jobs.score), desc(jobs.id)) }); }
  catch { return Response.json({ jobs: [] }); }
}

export async function POST(request: Request) {
  try {
    const p = await request.json() as Record<string, unknown>;
    const now = new Date().toISOString();
    const [job] = await getDb().insert(jobs).values({
      company:String(p.company||""), role:String(p.role||""), track:String(p.track||"其他"), location:String(p.location||"待确认"),
      eligibility:String(p.eligibility||"待确认"), score:Number(p.score||70), status:String(p.status||"待投"), deadline:p.deadline?String(p.deadline):null,
      sourceUrl:String(p.sourceUrl||"#"), nextAction:String(p.nextAction||"核验资格并准备投递"), lastSeenAt:String(p.lastSeenAt||now.slice(0,10)), createdAt:now, updatedAt:now,
    }).returning();
    return Response.json({ job }, { status:201 });
  } catch (error) { return Response.json({ error:error instanceof Error?error.message:"保存失败" }, { status:500 }); }
}
