import { desc } from "drizzle-orm";
import { getDb } from "../../../db";
import { jobs } from "../../../db/schema";

const escapeXml = (value: unknown) => String(value ?? "").replace(/[<>&'\"]/g, (char) => ({"<":"&lt;", ">":"&gt;", "&":"&amp;", "'":"&apos;", '"':"&quot;"}[char] ?? char));

export async function GET() {
  let rows: typeof jobs.$inferSelect[] = [];
  try { rows = await getDb().select().from(jobs).orderBy(desc(jobs.score), desc(jobs.id)); } catch { rows = []; }
  const headers = ["公司","岗位","赛道","地点","资格判断","匹配分","状态","截止日期","下一步","官方链接","最后核验"];
  const values = rows.map((j) => [j.company,j.role,j.track,j.location,j.eligibility,j.score,j.status,j.deadline||"",j.nextAction,j.sourceUrl,j.lastSeenAt]);
  const rowXml = [headers, ...values].map((row, rowIndex) => `<Row>${row.map((cell, colIndex) => `<Cell${rowIndex===0?' ss:StyleID="Header"':colIndex===5?' ss:StyleID="Score"':''}><Data ss:Type="${typeof cell === "number" ? "Number" : "String"}">${escapeXml(cell)}</Data></Cell>`).join("")}</Row>`).join("");
  const body = `<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Styles><Style ss:ID="Header"><Font ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#0B766E" ss:Pattern="Solid"/></Style><Style ss:ID="Score"><Font ss:Bold="1"/><NumberFormat ss:Format="0"/></Style></Styles><Worksheet ss:Name="岗位雷达"><Table>${rowXml}</Table></Worksheet></Workbook>`;
  return new Response(body, { headers:{ "content-type":"application/vnd.ms-excel; charset=utf-8", "content-disposition":`attachment; filename="return-radar-${new Date().toISOString().slice(0,10)}.xls"` } });
}
