'use client';

import { motion, type Variants } from 'framer-motion';
import { Briefcase, CalendarDays, MapPin } from 'lucide-react';

interface ExperienceEntry {
  company: string;
  role: string;
  team: string;
  location: string;
  period: string;
  type: string;
  current: boolean;
  logo: string;
  highlights: string[];
  // 3D emoji assets that pop out from behind the card corners on hover
  emojiLeft: string;
  emojiRight: string;
}

const experiences: ExperienceEntry[] = [
  {
    company: 'Amazon',
    role: 'Program Manager Working Student',
    team: 'Grocery Partnerships',
    location: 'Munich, Germany',
    period: 'Mar 2026 – Present',
    type: 'Working Student',
    current: true,
    logo: '/Amazon.png',
    highlights: [
      'Built the campaign analytics framework adopted as the team standard for in-cycle performance monitoring across the grocery merchant portfolio',
      'Develop merchant-facing content and onboarding collateral for FMCG partner campaigns',
      'Coordinate concurrent marketing workstreams — all alongside my final year at TUM',
    ],
    emojiLeft: '/amazon program 1.png',
    emojiRight: '/amazon program 2.png',
  },
  {
    company: 'Amazon',
    role: 'Product Manager Intern',
    team: 'Supply Chain',
    location: 'Munich, Germany',
    period: 'Aug 2025 – Feb 2026',
    type: 'Internship',
    current: false,
    logo: '/Amazon.png',
    highlights: [
      'Built a RAG-based internal AI assistant on a 1,500+ file knowledge base — cut metric retrieval time by 80%',
      '$250K Q4 logistics cost savings via defect resolution sprints across 30 high-impact vendors',
      'Automated weekly KPI tracking — +15% on-time delivery across flagged vendors',
      'Continuous Learning & Development Award within an 80+ person management team',
    ],
    emojiLeft: '/amazon product 1.png',
    emojiRight: '/amazon product 2.png',
  },
  {
    company: 'TUM School of Management',
    role: 'Research Assistant',
    team: 'Chair of Economics',
    location: 'Heilbronn, Germany',
    period: 'May 2025 – Aug 2025',
    type: 'Student Assistant',
    current: false,
    logo: '/TUM.png',
    highlights: [
      'Built SQL + Python/R pipelines that fully automated research dataset preparation — manual hours down to two scripts',
      'Supported PhD empirical research on student behaviour and learning outcomes',
      'Designed and taught the full Microeconomics tutoring curriculum from scratch',
    ],
    emojiLeft: '/tum1.png',
    emojiRight: '/tum2.png',
  },
  {
    company: 'Campus Founders',
    role: 'Program Manager',
    team: 'Startup & Innovation Programs',
    location: 'Heilbronn, Germany',
    period: 'Sep 2024 – Feb 2025',
    type: 'Working Student',
    current: false,
    logo: '/CF.png',
    highlights: [
      'Ran a 150+ survey and 20+ interview research program that shaped the next cohort design',
      "Authored the team's first PRD in Confluence — adopted as the core knowledge base",
      'Ops for the Corporate Campus Challenge with corporate partners incl. Porsche',
    ],
    emojiLeft: '/campusfounders1.png',
    emojiRight: '/campusfounders2.png',
  },
  {
    company: 'INVISID (DeepSign GmbH)',
    role: 'Product Marketing Manager',
    team: 'Privacy-first behavioural authentication',
    location: 'Saarbrücken, Germany',
    period: 'Apr 2024 – Aug 2024',
    type: 'Work Study',
    current: false,
    logo: '/INVISID.png',
    highlights: [
      'Validated market demand via 20+ user interviews — local-only data became the MVP anchor',
      'Defined the MVP feature set and data-backed roadmap that carried the team to launch',
      'Redesigned the landing page around a research-backed positioning framework',
    ],
    emojiLeft: '/invisid1.png',
    emojiRight: '/invisid2.png',
  },
  {
    company: 'VEON / Beeline Kazakhstan',
    role: 'Product Manager Intern',
    team: 'Digital Products',
    location: 'Astana, Kazakhstan',
    period: 'Jul 2023 – Oct 2023',
    type: 'Internship',
    current: false,
    logo: '/VEON.png',
    highlights: [
      'Cut sign-up from 5 steps to 2 via iterative A/B testing — +15% new user conversion',
      'Automated dashboard deployment: setup time from 1 day to 10 minutes, ~2,000 hours saved per year',
      'Ran UX research and a hypothesis backlog at a NASDAQ-listed telecom with 60+ digital products',
    ],
    emojiLeft: '/veon1.png',
    emojiRight: '/veon2.png',
  },
];

// Emojis hide behind the card (z-0 vs card z-10) and spring up past the top
// edge on hover — left one tilts left, right one tilts right.
const emojiLeftVariants: Variants = {
  rest: {
    opacity: 0,
    y: 24,
    x: 16,
    scale: 0.4,
    rotate: 8,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
  hover: {
    opacity: 1,
    y: -34,
    x: 0,
    scale: 1,
    rotate: -14,
    transition: { type: 'spring', stiffness: 380, damping: 17, mass: 0.8 },
  },
};

const emojiRightVariants: Variants = {
  rest: {
    opacity: 0,
    y: 24,
    x: -16,
    scale: 0.4,
    rotate: -8,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
  hover: {
    opacity: 1,
    y: -34,
    x: 0,
    scale: 1,
    rotate: 14,
    transition: {
      type: 'spring',
      stiffness: 380,
      damping: 17,
      mass: 0.8,
      delay: 0.04,
    },
  },
};

const cardVariants: Variants = {
  rest: { y: 0, transition: { duration: 0.2 } },
  hover: { y: -3, transition: { type: 'spring', stiffness: 300, damping: 20 } },
};

export function WorkExperience() {
  return (
    <div className="mx-auto w-full max-w-5xl py-6 font-sans">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-accent flex h-10 w-10 items-center justify-center rounded-full">
          <Briefcase className="text-foreground h-5 w-5" />
        </div>
        <div>
          <h2 className="text-foreground text-xl font-semibold md:text-2xl">
            Work Experience
          </h2>
          <p className="text-muted-foreground text-sm">
            Where I shipped things — hover a role for a little surprise
          </p>
        </div>
      </div>

      {/* Entries */}
      <div className="space-y-5">
        {experiences.map((exp, i) => (
          <motion.div
            key={`${exp.company}-${exp.role}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' }}
          >
            <motion.div
              className="relative z-0 hover:z-20"
              initial="rest"
              animate="rest"
              whileHover="hover"
              whileTap="hover"
            >
              {/* Pop-out emojis (behind the card) */}
              <motion.img
                src={exp.emojiLeft}
                alt=""
                aria-hidden
                variants={emojiLeftVariants}
                className="pointer-events-none absolute top-0 left-3 z-0 h-14 w-14 object-contain drop-shadow-md select-none md:left-5"
              />
              <motion.img
                src={exp.emojiRight}
                alt=""
                aria-hidden
                variants={emojiRightVariants}
                className="pointer-events-none absolute top-0 right-3 z-0 h-14 w-14 object-contain drop-shadow-md select-none md:right-5"
              />

              {/* Card */}
              <motion.div
                variants={cardVariants}
                className="bg-accent relative z-10 rounded-2xl p-6"
              >
                <div className="flex items-start gap-4">
                  {/* Logo */}
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-2">
                    <img
                      src={exp.logo}
                      alt={`${exp.company} logo`}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  {/* Title + status */}
                  <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-foreground text-lg font-semibold">
                        {exp.role}
                      </h3>
                      <p className="text-muted-foreground">{exp.company}</p>
                      <p className="text-muted-foreground mt-0.5 text-sm">
                        {exp.team}
                      </p>
                    </div>
                    <span
                      className={`w-fit flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                        exp.current
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      {exp.current ? 'Current' : exp.type}
                    </span>
                  </div>
                </div>

                {/* Meta + highlights, aligned under the title text on desktop */}
                <div className="md:pl-[72px]">
                  <div className="text-muted-foreground mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {exp.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4" />
                      {exp.period}
                    </span>
                  </div>

                  <ul className="mt-4 space-y-1.5">
                    {exp.highlights.map((h) => (
                      <li
                        key={h}
                        className="text-foreground flex gap-2 text-sm leading-relaxed"
                      >
                        <span className="bg-muted-foreground mt-2 h-1 w-1 flex-shrink-0 rounded-full" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default WorkExperience;
