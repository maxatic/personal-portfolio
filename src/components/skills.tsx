"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Brain,
  ClipboardList,
  Cpu,
  Languages,
  MessageCircle,
  Target,
  Users,
  Workflow,
  Wrench,
} from "lucide-react";
import { useState } from "react";

type SkillGroup = {
  category: string;
  icon: React.ReactNode;
  skills: string[];
};

/* ----------------------------------------------------------------------------
 * Skill sets aligned with what junior / graduate Project Manager roles across
 * the EU (Germany-focused) consistently ask for: agile + classic delivery,
 * the standard PM tool-chain (Jira / Confluence / MS Project / Office), data
 * literacy, and the people skills that dominate the job descriptions.
 * -------------------------------------------------------------------------- */
const hardSkills: SkillGroup[] = [
  {
    category: "Methodologies & Frameworks",
    icon: <Workflow className="h-5 w-5" />,
    skills: ["Agile", "Scrum", "Kanban", "Waterfall", "Hybrid Delivery", "Lean", "OKRs & KPIs"],
  },
  {
    category: "Planning & Delivery",
    icon: <ClipboardList className="h-5 w-5" />,
    skills: [
      "Project Planning",
      "Roadmapping & Prioritisation",
      "Scope & Requirements",
      "Sprint Planning",
      "Backlog Management",
      "Gantt & Timelines",
      "Risk & Issue Management",
      "Budget & Resource Tracking",
      "Change Management",
      "Status Reporting",
    ],
  },
  {
    category: "Tools & Software",
    icon: <Wrench className="h-5 w-5" />,
    skills: [
      "Jira",
      "Confluence",
      "Asana",
      "Trello",
      "Monday.com",
      "MS Project",
      "Notion",
      "Miro",
      "Excel / Sheets",
      "Google Workspace",
      "PowerPoint",
      "Slack",
      "Zapier",
      "n8n",
    ],
  },
  {
    category: "Data & Analytics",
    icon: <BarChart3 className="h-5 w-5" />,
    skills: [
      "Data Analysis",
      "KPI Dashboards",
      "SQL (PostgreSQL)",
      "Python",
      "NumPy / Matplotlib / Plotly",
      "JavaScript",
      "A/B Testing",
      "Power BI / Tableau",
      "Excel Modelling",
    ],
  },
  {
    category: "Product, AI & Technical",
    icon: <Cpu className="h-5 w-5" />,
    skills: [
      "Product Discovery",
      "User Research",
      "PRD / Spec Writing",
      "RAG / LLM Systems",
      "Prompt Engineering",
      "Claude Code",
      "Cursor AI",
      "Amazon Quick Suite",
      "Figma",
      "Framer",
      "Sketch",
      "Axure",
      "Canva",
      "Adobe Photoshop",
      "Git / GitHub",
      "CMS",
    ],
  },
];

const softSkills: SkillGroup[] = [
  {
    category: "Communication",
    icon: <MessageCircle className="h-5 w-5" />,
    skills: [
      "Stakeholder Communication",
      "Written Communication",
      "Presentation & Public Speaking",
      "Active Listening",
      "Data Storytelling",
      "Status Updates & Reporting",
    ],
  },
  {
    category: "Collaboration & Leadership",
    icon: <Users className="h-5 w-5" />,
    skills: [
      "Cross-functional Facilitation",
      "Team Coordination",
      "Workshop Facilitation",
      "Conflict Resolution",
      "Negotiation",
      "Mentoring & Onboarding",
    ],
  },
  {
    category: "Personal Effectiveness",
    icon: <Target className="h-5 w-5" />,
    skills: [
      "Ownership & Proactivity",
      "Time Management",
      "Organisation & Structure",
      "Adaptability",
      "Attention to Detail",
      "Results Orientation",
    ],
  },
  {
    category: "Problem Solving & Mindset",
    icon: <Brain className="h-5 w-5" />,
    skills: [
      "Analytical Thinking",
      "Critical Thinking",
      "Decision Making",
      "Emotional Intelligence",
      "Continuous Learning",
    ],
  },
  {
    category: "Languages & Culture",
    icon: <Languages className="h-5 w-5" />,
    skills: [
      "English (Fluent)",
      "Russian (Native)",
      "Kazakh (Native)",
      "German (B1 → C1)",
      "Intercultural Fluency",
    ],
  },
];

const tabs = [
  { key: "hard" as const, label: "Hard Skills" },
  { key: "soft" as const, label: "Soft Skills" },
];

const Skills = () => {
  const [activeTab, setActiveTab] = useState<"hard" | "soft">("hard");
  const activeData = activeTab === "hard" ? hardSkills : softSkills;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.19, 1, 0.22, 1] as [number, number, number, number],
      },
    },
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" as const },
    },
  };

  return (
    <motion.div
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className="mx-auto w-full max-w-5xl rounded-4xl"
    >
      <Card className="w-full border-none bg-transparent px-0 pb-12 shadow-none">
        <CardHeader className="px-0 pb-1">
          <CardTitle className="text-primary px-0 text-4xl font-bold">Skills & Expertise</CardTitle>
        </CardHeader>

        <CardContent className="px-0">
          {/* hard / soft switch */}
          <div className="border-border bg-muted/40 mb-8 inline-flex rounded-full border p-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="relative cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-colors"
                >
                  {isActive && (
                    <motion.span
                      layoutId="skillsTabPill"
                      className="bg-primary absolute inset-0 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span
                    className={`relative z-10 ${
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="space-y-8 px-0"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: 8, transition: { duration: 0.2 } }}
            >
              {activeData.map((section, index) => (
                <motion.div key={index} className="space-y-3 px-0" variants={itemVariants}>
                  <div className="flex items-center gap-2">
                    {section.icon}
                    <h3 className="text-accent-foreground text-lg font-semibold">
                      {section.category}
                    </h3>
                  </div>

                  <motion.div
                    className="flex flex-wrap gap-2"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {section.skills.map((skill, idx) => (
                      <motion.div
                        key={idx}
                        variants={badgeVariants}
                        whileHover={{
                          scale: 1.04,
                          transition: { duration: 0.2 },
                        }}
                      >
                        <Badge className="border px-3 py-1.5 font-normal">{skill}</Badge>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Skills;
