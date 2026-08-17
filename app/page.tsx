"use client";

import { useEffect, useMemo, useState } from "react";

type Job = {
  id: number;
  company: string;
  role: string;
  track: string;
  location: string;
  eligibility: string;
  score: number;
  status: string;
  deadline: string | null;
  sourceUrl: string;
  nextAction: string;
  lastSeenAt: string;
};

const statusOptions = ["待投", "准备材料", "已投", "笔试/面试", "Offer", "暂不投", "已关闭"];
const trackLabels = ["全部", "HEOR/HTA", "市场准入", "医药商业", "AI Healthcare", "AI Product", "Global Ops", "咨询"];

const fallbackJobs: Job[] = [
  { id: 1, company: "罗氏制药中国", role: "StartUp China · National Market Access", track: "市场准入", location: "上海 / 北京", eligibility: "海外院校 2026-07—2027-06 毕业", score: 93, status: "准备材料", deadline: null, sourceUrl: "https://careers.roche.com/cn/zh/startup-china-pharma", nextAction: "完成准入版中英文简历与NRDL案例", lastSeenAt: "2026-08-17" },
  { id: 2, company: "IQVIA", role: "HE/HTA (Associate) Consultant", track: "HEOR/HTA", location: "上海 / 北京", eligibility: "硕士匹配；研究经历要求较高", score: 93, status: "待投", deadline: null, sourceUrl: "https://jobs.iqvia.com/en/jobs/R1522739-0", nextAction: "英文简历定制并寻找校友内推", lastSeenAt: "2026-08-17" },
  { id: 3, company: "德勤中国", role: "2026 Graduate Program · Consulting", track: "咨询", location: "中国多地", eligibility: "接受 2025/2026 海内外毕业生", score: 84, status: "待投", deadline: null, sourceUrl: "https://www.deloitte.com/cn/zh/careers/explore-your-fit/students/graduate-program.html", nextAction: "筛选生命科学 / AI & Data / Strategy", lastSeenAt: "2026-08-17" },
  { id: 4, company: "Sanofi", role: "特药事业部市场部实习生", track: "医药商业", location: "上海", eligibility: "2026/2027毕业；需确认实习协议", score: 80, status: "待投", deadline: "2026-09-22", sourceUrl: "https://jobs.sanofi.com", nextAction: "确认毕业后实习资格，符合则投", lastSeenAt: "2026-08-17" },
  { id: 5, company: "华为", role: "校园招聘 · 产品 / 解决方案 / 数据", track: "AI Product", location: "中国多地", eligibility: "海外高校毕业窗口覆盖2026", score: 75, status: "待投", deadline: "2026-12-31", sourceUrl: "https://career.huawei.com/cn/campus-recruitment", nextAction: "筛选非算法产品与解决方案岗位", lastSeenAt: "2026-08-17" },
  { id: 6, company: "阿斯利康", role: "Market Access Specialist", track: "市场准入", location: "台北", eligibility: "截止日期已过", score: 89, status: "已关闭", deadline: "2026-08-16", sourceUrl: "https://careers.astrazeneca.com", nextAction: "关闭并保留JD关键词", lastSeenAt: "2026-08-17" },
];

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>(fallbackJobs);
  const [search, setSearch] = useState("");
  const [track, setTrack] = useState("全部");
  const [status, setStatus] = useState("全部状态");
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/jobs")
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => data.jobs?.length && setJobs(data.jobs))
      .catch(() => undefined);
  }, []);

  const visible = useMemo(() => jobs
    .filter((j) => track === "全部" || j.track === track)
    .filter((j) => status === "全部状态" || j.status === status)
    .filter((j) => `${j.company} ${j.role} ${j.location}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.score - a.score), [jobs, search, track, status]);

  const counts = {
    active: jobs.filter((j) => !["暂不投", "已关闭"].includes(j.status)).length,
    applied: jobs.filter((j) => ["已投", "笔试/面试", "Offer"].includes(j.status)).length,
    interviewing: jobs.filter((j) => j.status === "笔试/面试").length,
    high: jobs.filter((j) => j.score >= 80 && j.status !== "已关闭").length,
  };

  async function updateStatus(id: number, nextStatus: string) {
    setJobs((old) => old.map((j) => j.id === id ? { ...j, status: nextStatus } : j));
    await fetch(`/api/jobs/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ status: nextStatus }) }).catch(() => undefined);
  }

  async function addJob(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const local: Job = {
      id: Date.now(), company: String(payload.company), role: String(payload.role),
      track: String(payload.track), location: String(payload.location || "待确认"),
      eligibility: String(payload.eligibility || "待确认"), score: Number(payload.score || 70),
      status: "待投", deadline: String(payload.deadline || "") || null,
      sourceUrl: String(payload.sourceUrl || "#"), nextAction: String(payload.nextAction || "核验资格并准备投递"),
      lastSeenAt: new Date().toISOString().slice(0, 10),
    };
    try {
      const response = await fetch("/api/jobs", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(local) });
      const data = await response.json();
      setJobs((old) => [data.job ?? local, ...old]);
    } catch { setJobs((old) => [local, ...old]); }
    setSaving(false); setShowAdd(false);
  }

  return (
    <main>
      <header className="topbar">
        <div className="brand"><span className="brandMark">R</span><div><strong>Return Radar</strong><small>留学生秋招情报与执行系统</small></div></div>
        <div className="topActions"><span className="sync"><i /> 每个工作日 09:00 更新</span><a className="ghost" href="/api/export">导出 Excel</a><button className="primary" onClick={() => setShowAdd(true)}>＋ 添加岗位</button></div>
      </header>

      <section className="hero">
        <div><p className="eyebrow">UCL HEDS · 2026 GRADUATE</p><h1>从信息噪音里，<br/><em>抓住真正值得投的机会。</em></h1><p className="lede">围绕 HEOR、市场准入、AI 医疗与全球业务，自动聚合、评分、去重并形成今日行动。</p></div>
        <aside className="todayCard"><span>今日聚焦</span><strong>3</strong><p>项关键行动</p><ol><li>投递 IQVIA HE/HTA</li><li>筛选德勤咨询岗</li><li>准备罗氏准入案例</li></ol></aside>
      </section>

      <section className="metrics">
        <article><span>活跃机会</span><strong>{counts.active}</strong><small>排除关闭与暂不投</small></article>
        <article><span>已进入流程</span><strong>{counts.applied}</strong><small>已投 / 笔试 / 面试</small></article>
        <article><span>面试中</span><strong>{counts.interviewing}</strong><small>等待下一轮动作</small></article>
        <article className="accent"><span>高优先岗位</span><strong>{counts.high}</strong><small>匹配分 ≥ 80</small></article>
      </section>

      <section className="workspace">
        <div className="workspaceHead"><div><p className="sectionLabel">OPPORTUNITY RADAR</p><h2>岗位雷达</h2></div><div className="filters"><input aria-label="搜索岗位" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索公司、岗位或城市"/><select aria-label="筛选状态" value={status} onChange={(e) => setStatus(e.target.value)}><option>全部状态</option>{statusOptions.map((s) => <option key={s}>{s}</option>)}</select></div></div>
        <nav className="trackTabs" aria-label="赛道筛选">{trackLabels.map((t) => <button className={track === t ? "active" : ""} onClick={() => setTrack(t)} key={t}>{t}</button>)}</nav>
        <div className="tableWrap"><table><thead><tr><th>机会</th><th>赛道 / 地点</th><th>资格判断</th><th>匹配分</th><th>状态</th><th>下一步</th><th /></tr></thead><tbody>
          {visible.map((job) => <tr key={job.id} className={job.status === "已关闭" ? "mutedRow" : ""}>
            <td><strong>{job.company}</strong><span>{job.role}</span>{job.deadline && <small>截止 {job.deadline}</small>}</td>
            <td><b>{job.track}</b><span>{job.location}</span></td><td><span>{job.eligibility}</span><small>核验 {job.lastSeenAt}</small></td>
            <td><div className="score"><strong>{job.score}</strong><i style={{width: `${job.score}%`}} /></div></td>
            <td><select aria-label={`${job.company}状态`} value={job.status} onChange={(e) => updateStatus(job.id, e.target.value)}>{statusOptions.map((s) => <option key={s}>{s}</option>)}</select></td>
            <td><span>{job.nextAction}</span></td><td><a className="arrow" href={job.sourceUrl} target="_blank" rel="noreferrer" aria-label={`打开${job.company}岗位`}>↗</a></td>
          </tr>)}
        </tbody></table>{visible.length === 0 && <div className="empty">没有符合当前筛选的岗位。</div>}</div>
      </section>

      <section className="sources"><p>设计参考</p><a href="https://github.com/Gsync/jobsync" target="_blank">JobSync · 申请追踪</a><a href="https://github.com/tcpsyn/CareerPulse" target="_blank">CareerPulse · 去重与分析</a><a href="https://github.com/jason-huanghao/jobradar" target="_blank">JobRadar · 中国源与Excel</a><span>数据以企业官网为准</span></section>

      {showAdd && <div className="modalBackdrop" onMouseDown={() => setShowAdd(false)}><form className="modal" onSubmit={addJob} onMouseDown={(e) => e.stopPropagation()}><div className="modalTitle"><div><p className="sectionLabel">NEW OPPORTUNITY</p><h2>添加岗位</h2></div><button type="button" onClick={() => setShowAdd(false)}>×</button></div><label>公司<input name="company" required /></label><label>岗位<input name="role" required /></label><div className="formGrid"><label>赛道<select name="track">{trackLabels.slice(1).map((t) => <option key={t}>{t}</option>)}</select></label><label>匹配分<input name="score" type="number" min="0" max="100" defaultValue="75" /></label></div><div className="formGrid"><label>地点<input name="location" /></label><label>截止日期<input name="deadline" type="date" /></label></div><label>资格判断<input name="eligibility" /></label><label>官方链接<input name="sourceUrl" type="url" /></label><label>下一步<input name="nextAction" /></label><button className="primary submit" disabled={saving}>{saving ? "保存中…" : "保存到雷达"}</button></form></div>}
    </main>
  );
}
