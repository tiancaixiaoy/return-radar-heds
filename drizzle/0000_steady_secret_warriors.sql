CREATE TABLE `jobs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`company` text NOT NULL,
	`role` text NOT NULL,
	`track` text NOT NULL,
	`location` text DEFAULT '待确认' NOT NULL,
	`eligibility` text DEFAULT '待确认' NOT NULL,
	`score` integer DEFAULT 70 NOT NULL,
	`status` text DEFAULT '待投' NOT NULL,
	`deadline` text,
	`source_url` text NOT NULL,
	`next_action` text DEFAULT '核验资格并准备投递' NOT NULL,
	`last_seen_at` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_jobs_status_score` ON `jobs` (`status`,`score`);
--> statement-breakpoint
CREATE INDEX `idx_jobs_last_seen_at` ON `jobs` (`last_seen_at`);
--> statement-breakpoint
INSERT INTO `jobs` (`company`,`role`,`track`,`location`,`eligibility`,`score`,`status`,`deadline`,`source_url`,`next_action`,`last_seen_at`,`created_at`,`updated_at`) VALUES
('罗氏制药中国','StartUp China · National Market Access','市场准入','上海 / 北京','海外院校 2026-07—2027-06 毕业',93,'准备材料',NULL,'https://careers.roche.com/cn/zh/startup-china-pharma','完成准入版中英文简历与NRDL案例','2026-08-17','2026-08-17T09:00:00Z','2026-08-17T09:00:00Z'),
('IQVIA','HE/HTA (Associate) Consultant','HEOR/HTA','上海 / 北京','硕士匹配；研究经历要求较高',93,'待投',NULL,'https://jobs.iqvia.com/en/jobs/R1522739-0','英文简历定制并寻找校友内推','2026-08-17','2026-08-17T09:00:00Z','2026-08-17T09:00:00Z'),
('德勤中国','2026 Graduate Program · Consulting','咨询','中国多地','接受 2025/2026 海内外毕业生',84,'待投',NULL,'https://www.deloitte.com/cn/zh/careers/explore-your-fit/students/graduate-program.html','筛选生命科学 / AI & Data / Strategy','2026-08-17','2026-08-17T09:00:00Z','2026-08-17T09:00:00Z'),
('Sanofi','特药事业部市场部实习生','医药商业','上海','2026/2027毕业；需确认实习协议',80,'待投','2026-09-22','https://jobs.sanofi.com','确认毕业后实习资格，符合则投','2026-08-17','2026-08-17T09:00:00Z','2026-08-17T09:00:00Z'),
('华为','校园招聘 · 产品 / 解决方案 / 数据','AI Product','中国多地','海外高校毕业窗口覆盖2026',75,'待投','2026-12-31','https://career.huawei.com/cn/campus-recruitment','筛选非算法产品与解决方案岗位','2026-08-17','2026-08-17T09:00:00Z','2026-08-17T09:00:00Z'),
('阿斯利康','Market Access Specialist','市场准入','台北','截止日期已过',89,'已关闭','2026-08-16','https://careers.astrazeneca.com','关闭并保留JD关键词','2026-08-17','2026-08-17T09:00:00Z','2026-08-17T09:00:00Z');
--> statement-breakpoint
PRAGMA optimize;
