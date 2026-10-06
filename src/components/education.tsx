"use client";

import { motion } from "framer-motion";
import { Award, CalendarDays, GraduationCap, MapPin } from "lucide-react";

interface EducationEntry {
  institution: string;
  degree: string;
  detail: string;
  location: string;
  period: string;
  status: string;
  current: boolean;
  gpa?: string;
  logo: string;
  highlights: string[];
}

const education: EducationEntry[] = [
  {
    institution: "Technical University of Munich (TUM)",
    degree: "M.Sc. Management & Technology",
    detail: "Current master’s studies",
    location: "Munich, Germany",
    period: "Oct 2026 – Present",
    status: "In progress",
    current: true,
    logo: "/TUM.png",
    highlights: [
      "Continuing at TUM after completing my bachelor’s in Management & Technology",
      "Combining my studies with hands-on AI adoption and data analysis at Red Hat",
    ],
  },
  {
    institution: "Technical University of Munich (TUM)",
    degree: "B.Sc. Management & Technology",
    detail: "Specialization: Digital Technologies",
    location: "Munich, Germany",
    period: "Oct 2023 – Sep 2026",
    status: "Completed",
    current: false,
    gpa: "Thesis grade 1.3 (1.0 = best)",
    logo: "/TUM.png",
    highlights: [
      "Bachelor's thesis on AI adoption and firm productivity",
      "TUMSelect member: selective network for high-GPA students (McKinsey, Porsche, P&G)",
      "Top grades: 1.3 on a 12 ECTS market-research project, 1.0 in CEO Leadership & Strategy",
      "Cross-disciplinary: business core plus CS, ML/data science, and digital systems",
    ],
  },
  {
    institution: "Astana IT University (AITU)",
    degree: "B.Sc. Software Engineering",
    detail: "Transferred to TUM as a last-chance opportunity",
    location: "Astana, Kazakhstan",
    period: "2021 – May 2023",
    status: "Incomplete · 2 of 3 years",
    current: false,
    gpa: "GPA 3.32 / 4.0",
    logo: "/AITU.png",
    highlights: [
      "Completed 138 credits, with only the thesis remaining",
      "Solid CS core: C++, Java, OOP, algorithms, SQL & NoSQL, design patterns",
      "A grades in Back-End Web Dev & Industrial Practice; A- in NoSQL and Design Patterns",
      "Co-Lead of Google Developer Groups, ran DevFest for 500+ people",
    ],
  },
  {
    institution: "Carnegie Mellon University",
    degree: "Mechatronics, Robotics & Automation Engineering",
    detail: "Computer Science 5 Certification",
    location: "Pittsburgh, USA",
    period: "Mar 2018 – May 2018",
    status: "Completed",
    current: false,
    gpa: "Grade 4.0 / 4.0",
    logo: "/CMU.png",
    highlights: [
      "Scored 98%, showing strong proficiency in programming and computational concepts",
    ],
  },
];

export function Education() {
  return (
    <div className="mx-auto w-full max-w-5xl py-6 font-sans">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-accent flex h-10 w-10 items-center justify-center rounded-full">
          <GraduationCap className="text-foreground h-5 w-5" />
        </div>
        <div>
          <h2 className="text-foreground text-xl font-semibold md:text-2xl">Education</h2>
          <p className="text-muted-foreground text-sm">
            Where I learned to connect business and technology
          </p>
        </div>
      </div>

      {/* Entries */}
      <div className="space-y-4">
        {education.map((edu, i) => (
          <motion.div
            key={`${edu.institution}-${edu.degree}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1, ease: "easeOut" }}
            className="bg-accent rounded-2xl p-6"
          >
            <div className="flex items-start gap-4">
              {/* Logo */}
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-2">
                <img
                  src={edu.logo}
                  alt={`${edu.institution} logo`}
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Title + status */}
              <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-foreground text-lg font-semibold">{edu.degree}</h3>
                  <p className="text-muted-foreground">{edu.institution}</p>
                  <p className="text-muted-foreground mt-0.5 text-sm">{edu.detail}</p>
                </div>
                <span
                  className={`w-fit flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                    edu.current
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {edu.status}
                </span>
              </div>
            </div>

            {/* Meta + highlights, aligned under the title text on desktop */}
            <div className="md:pl-[72px]">
              {/* Meta row */}
              <div className="text-muted-foreground mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {edu.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  {edu.period}
                </span>
                {edu.gpa && (
                  <span className="flex items-center gap-1.5">
                    <Award className="h-4 w-4" />
                    {edu.gpa}
                  </span>
                )}
              </div>

              {/* Highlights */}
              {edu.highlights.length > 0 && (
                <ul className="mt-4 space-y-1.5">
                  {edu.highlights.map((h) => (
                    <li key={h} className="text-foreground flex gap-2 text-sm leading-relaxed">
                      <span className="bg-muted-foreground mt-2 h-1 w-1 flex-shrink-0 rounded-full" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Education;
