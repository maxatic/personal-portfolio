import { tool } from "ai";
import { z } from "zod";

export const getExperience = tool({
  description:
    "Use this tool when the user asks about my work experience, professional background, career, jobs, internships, where I have worked, or about specific companies like Red Hat, Amazon, VEON/Beeline, Campus Founders, INVISID, TUM (research assistant), Astana Hub, or GDG.",
  parameters: z.object({}),
  execute: async () => {
    return {
      experience:
        "Quick tour of where I've worked: right now I'm an AI Data Analyst Working Student at Red Hat in Munich, leading team AI adoption and analyzing data for regional GTM decisions. Before that I was a Program Manager Working Student at Amazon Grocery Partnerships and a PM Intern on Amazon Supply Chain, where I built a RAG-based AI assistant (80% faster metric retrieval), drove $250K in logistics cost savings, and won the Continuous Learning & Development Award. Earlier stops: Research Assistant at TUM's Chair of Economics (data pipelines in SQL/Python/R), Program Manager at Campus Founders (150+ survey research program, first team PRD), Product Marketing Manager at privacy-tech startup INVISID (guided the MVP to launch), and PM Intern at VEON/Beeline Kazakhstan (+15% sign-up conversion, ~2,000 hours/year saved through automation). I also did PM & UX internships at Astana Hub and co-led GDG Astana, organizing DevFest for 500+ developers.",
    };
  },
});
