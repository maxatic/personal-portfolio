import { tool } from "ai";
import { z } from "zod";

export const getCertifications = tool({
  description:
    "Use this tool when the user asks about my certifications, certificates, credentials, courses I completed, or professional qualifications (e.g. Scrum, Google Project Management, IPMA, AWS).",
  parameters: z.object({}),
  execute: async () => {
    return {
      certifications:
        "I back up my product, project-management and tech skills with recognised certifications: Harvard's CS50x (Introduction to Computer Science), Amazon's Product Management Essentials and Agentic AI: Essential Concepts for Builders, the McKinsey.org Forward Program, Google's Foundations of Project Management, marketing courses from Wharton (UPenn) and Meta, and Cisco IT Essentials. The card lists each one — click any credential to preview the actual certificate.",
    };
  },
});
