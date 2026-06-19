import { tool } from 'ai';
import { z } from 'zod';

export const getInternship = tool({
  description:
    "Gives a summary of what kind of full-time role I'm looking for, plus my contact info and how to reach me. Use this tool when the user asks about my job search, hiring me, or how to contact me for opportunities.",
  parameters: z.object({}),
  execute: async () => {
    return `Here's what I'm looking for 👇

- 📅 **Availability**: Full-time from **October 2026** (after I graduate from TUM)
- 🌍 **Location**: **Munich / Germany** 🇩🇪 or remote
- 🧑‍💻 **Roles**: Product Manager, AI Product Manager, or Strategy / Operations
- 🎯 **Focus**: AI products & tooling, data-driven operations, cross-functional execution
- 🛠️ **Toolkit**: Product & program management, data analytics (SQL, Python, R), RAG/LLM tooling, Figma, KPI systems
- ✅ **What I bring**: Real impact at Amazon, including a RAG AI assistant that cut metric retrieval time 80%, $250K Q4 logistics savings, and ~3 years across Amazon, TUM, and startups
- 🚀 I ship fast, automate everything I can, and turn messy data into clear decisions

📬 **Contact me** via:
- Email: issaliyev.maxat@gmail.com
- LinkedIn: [linkedin.com/in/maxat-issaliyev](https://www.linkedin.com/in/maxat-issaliyev/)
- GitHub: [github.com/maxissaliyev](https://github.com/maxissaliyev)

Let's build something great together ✌️
    `;
  },
});
