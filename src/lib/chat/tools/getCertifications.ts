import { tool } from "ai";
import { z } from "zod";

export const getCertifications = tool({
  description:
    "Use this tool when the user asks about my certifications, certificates, credentials, courses I completed, or professional qualifications (e.g. Scrum, Google Project Management, IPMA, AWS).",
  parameters: z.object({}),
  execute: async () => {
    return {
      certifications:
        "Here are the certifications I actually hold: Harvard's CS50x (Introduction to Computer Science), Amazon Machine Learning University's Agentic AI: Essential Concepts for Builders, Amazon's Product Management Essentials, the McKinsey.org Forward Program, Google's Foundations of Project Management (Coursera), Wharton/UPenn's Introduction to Marketing (Coursera), Meta's Introduction to Social Media Marketing (Coursera), Cisco's IT Essentials, and the Campus Founders Corporate Campus Challenge. The card lists each one - click any credential to preview the actual certificate.",
    };
  },
});
