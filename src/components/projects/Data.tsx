import Image from 'next/image';
import { Image as Img } from 'lucide-react';
import { ChevronRight, Link } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { url } from 'inspector';

// Enhanced project content array with all projects
// NOTE: image paths below are placeholders — drop your own screenshots into /public
// using these filenames (e.g. project-syz-1.png), or update the paths to match your assets.
const PROJECT_CONTENT = [
  {
    title: 'GDG DevFest',
    description:
      "Co-leading Google Developer Groups in Astana is where I found out how much I love building communities around tech. I took on DevFest, our flagship developer conference, and grew it into one of the biggest tech gatherings in the city. The headcount isn't the part I'm proudest of, though. It's the people. Students showed up curious and left running their own workshops, I got to mentor a bunch of volunteers, and the club turned into a real home for developers in Astana. I learned to lead by building momentum. That meant partnering with universities, backing the team, and giving people a reason to grow.",
    techStack: [
      'Community Building',
      'Event Management',
      'Public Speaking',
      'Mentoring',
    ],
    date: '2023',
    links: [],
    images: [
      { src: '/Projects/GDG/GDG 1.png', alt: 'GDG DevFest in Astana' },
      { src: '/Projects/GDG/GDG 2.jpg', alt: 'GDG community at DevFest' },
      { src: '/Projects/GDG/GDG 3.jpg', alt: 'GDG DevFest stage and audience' },
    ],
  },
  {
    title: 'CardioGuard',
    description:
      "CardioGuard tackles something real: most people don't know their heart attack risk until they're already in a clinic. I built it with a team of four as a university capstone. It's a full-stack web app where patients fill out a short health questionnaire and get back an AI risk score, broken down by contributing factor using SHAP explainability. We shipped dashboards for both patients and doctors, JWT-secured APIs with token refresh, and a Random Forest classifier trained on real Kaggle medical data. The explainability layer is the part I'm proudest of. It doesn't just hand you a percentage. It shows exactly which metrics are pulling the number up or down, so a doctor can actually act on it.",
    techStack: [
      'Python',
      'Django REST Framework',
      'scikit-learn',
      'Random Forest',
      'SHAP Explainability',
      'Pandas / NumPy',
      'PostgreSQL',
      'Chart.js',
      'JWT (Refresh Flow)',
    ],
    date: '2024',
    links: [],
    images: [
      { src: '/Projects/Cardioguard/Cardioguard 1.png', alt: 'CardioGuard patient assessment form' },
      { src: '/Projects/Cardioguard/Cardioguard 2.png', alt: 'CardioGuard risk score with SHAP breakdown' },
      { src: '/Projects/Cardioguard/Cardioguard 3.png', alt: 'CardioGuard doctor dashboard' },
    ],
  },
  {
    title: 'SubSpace',
    description:
      'An Android puzzle game with portal mechanics, where I led UI/UX design. I created the full design system (HUD elements, game icons, user flows) and built the 3D assets in Blender: a portal gun, the main character robot, and a set of environmental props.',
    techStack: [
      'Figma',
      'Blender',
      '3D Modelling',
      'Texturing & Lighting',
      'Game UI/UX',
      'Design Systems',
      'Prototyping',
    ],
    date: '2023',
    links: [],
    images: [
      { src: '/Projects/Subspace/Subspace 1.webp', alt: 'SubSpace game UI' },
      { src: '/Projects/Subspace/Subspace 2.webp', alt: 'SubSpace 3D assets' },
      { src: '/Projects/Subspace/Subspace 3.webp', alt: 'SubSpace level design' },
    ],
  },
  {
    title: 'Innovote',
    description:
      "A mobile app for student clubs built during TUM's 14-week Corporate Campus Challenge with Dieter Schwarz Stiftung. It's a crowdvoting system that helps student clubs compete and grow. As Product Marketing Manager I ran 13 user interviews, designed a 20-page adaptive iOS app in Figma, and gathered 100+ survey responses to shape the roadmap.",
    techStack: [
      'Figma',
      'UX Research',
      'Product Strategy',
      'Personas',
      'iOS Design',
    ],
    date: '2024',
    links: [],
    images: [
      { src: '/Projects/Innovote/Innovote 1.webp', alt: 'Innovote app design' },
      { src: '/Projects/Innovote/Innovote 2.webp', alt: 'Innovote user flows' },
      { src: '/Projects/Innovote/Innovote 4.webp', alt: 'Innovote screens' },
    ],
  },
  {
    title: 'Syz',
    description:
      "Syz takes the Sisyphean grind out of job hunting in the DACH region. It's an AI job-application platform where a single Master CV powers everything. You paste a job description, pick German or English, and Syz generates an ATS-optimized CV and cover letter, compiled to PDF via LaTeX with proper DIN 5008 formatting. It parses your existing resume with Claude into a structured profile and tracks every application from Draft to Offer. There's even a voice-to-voice AI interview coach built on ElevenLabs so you can practice before the real thing. The whole point was to make applying feel less like pushing a boulder uphill: one source of truth, tailored documents in seconds, and a tracker that keeps the chaos in order.",
    techStack: [
      'Next.js 15',
      'TypeScript',
      'Tailwind CSS',
      'Supabase',
      'Clerk',
      'Anthropic Claude',
      'ElevenLabs',
      'LaTeX',
    ],
    date: '2025',
    links: [],
    images: [
      { src: '/Projects/Syz/Syz 1.png', alt: 'Syz dashboard' },
      { src: '/Projects/Syz/Syz 2.png', alt: 'Syz tailored CV generation' },
      { src: '/Projects/Syz/Syz 3.png', alt: 'Syz application tracker' },
      { src: '/Projects/Syz/Syz 4.png', alt: 'Syz AI interview coach' },
    ],
  },
  {
    title: 'Swiftron',
    description:
      "Swiftron is an MCP server I built at the CF x HHN AI Hackathon in Heilbronn that exposes a pretrained ONNX order-prediction model to AI agents. I was working under NDA with an inference-only model, so I wrapped it in a set of Model Context Protocol tools that let an agent actually drive procurement planning: predicting a customer's next basket, running real beam search over ranked scenarios, and personalizing predictions through the model's sensor mechanism without ever retraining the weights. Every tool call is audited with latency and identity, PII gets scrubbed before tokenization, and a Next.js dashboard shows procurement managers the live predictions. The constraint I found most interesting was honesty: instead of faking a retraining loop, I exposed the model's real personalization surface and let the agent condition on it.",
    techStack: [
      'Python',
      'FastMCP',
      'ONNX',
      'MCP',
      'Next.js',
      'Anthropic API',
      'Beam Search',
    ],
    date: '2026',
    links: [],
    images: [
      { src: '/Projects/Swiftron/Swiftron 1.png', alt: 'Swiftron procurement dashboard' },
      { src: '/Projects/Swiftron/Swiftron 2.png', alt: 'Swiftron ranked scenarios and tool calls' },
    ],
  },
  {
    title: 'HappyRobot',
    description:
      "Clerque is an end-to-end AI outbound sales platform my team built at the TUM.ai Makeathon, where we placed 4th in the HappyRobot challenge. Our agent, Lena, calls prospects automatically, opens with a personalized hook, runs discovery, pitches a landing-page service, and follows up with a tailored email proposal or mock-up depending on how the call goes. My favorite part is the memory loop: every call she makes is logged with cognee, so she gets a little smarter each conversation. We built it over a weekend on HappyRobot, Claude, cognee, and unipile with a great team of five.",
    techStack: [
      'HappyRobot',
      'Anthropic Claude',
      'cognee',
      'unipile',
      'Voice AI',
      'AI Agents',
    ],
    date: '2026',
    links: [],
    images: [
      { src: '/Projects/HappyRobot/HappyRobot.webp', alt: 'Clerque AI sales system on HappyRobot' },
    ],
  },
];

// Define interface for project prop
interface ProjectProps {
  title: string;
  description?: string;
  techStack?: string[];
  date?: string;
  links?: { name: string; url: string }[];
  images?: { src: string; alt: string }[];
}

const ProjectContent = ({ project }: { project: ProjectProps }) => {
  // Find the matching project data
  const projectData = PROJECT_CONTENT.find((p) => p.title === project.title);

  if (!projectData) {
    return <div>Project details not available</div>;
  }

  return (
    <div className="space-y-10">
      {/* Header section with description */}
      <div className="rounded-3xl bg-[#F5F5F7] p-8 dark:bg-[#1D1D1F]">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <span>{projectData.date}</span>
          </div>

          <p className="text-secondary-foreground font-sans text-base leading-relaxed md:text-lg">
            {projectData.description}
          </p>

          {/* Tech stack */}
          <div className="pt-4">
            <h3 className="mb-3 text-sm tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
              Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {projectData.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="rounded-full bg-neutral-200 px-3 py-1 text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Links section */}
      {projectData.links && projectData.links.length > 0 && (
        <div className="mb-24">
          <div className="px-6 mb-4 flex items-center gap-2">
            <h3 className="text-sm tracking-wide text-neutral-500 dark:text-neutral-400">
              Links
            </h3>
            <Link className="text-muted-foreground w-4" />
          </div>
          <Separator className="my-4" />
          <div className="space-y-3">
            {projectData.links.map((link, index) => (
                <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[#F5F5F7] flex items-center justify-between rounded-xl p-4 transition-colors hover:bg-[#E5E5E7] dark:bg-neutral-800 dark:hover:bg-neutral-700"
                >
                <span className="font-light capitalize">{link.name}</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
            ))}
          </div>
        </div>
      )}

      {/* Images gallery */}
      {projectData.images && projectData.images.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {projectData.images.map((image, index) => (
              <div
                key={index}
                className="flex items-center justify-center overflow-hidden rounded-2xl bg-[#F5F5F7] dark:bg-[#1D1D1F]"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  className="h-auto w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main data export with updated content
export const data = [
  {
    category: 'Community',
    title: 'GDG DevFest',
    src: '/Projects/GDG/gdg-1.jpg',
    content: <ProjectContent project={{ title: 'GDG DevFest' }} />,
  },
  {
    category: 'Machine Learning',
    title: 'CardioGuard',
    src: '/Projects/Cardioguard/Cardioguard Banner.jpg',
    content: <ProjectContent project={{ title: 'CardioGuard' }} />,
  },
  {
    category: 'Game Design',
    title: 'SubSpace',
    src: '/Projects/Subspace/Subspace.webp',
    content: <ProjectContent project={{ title: 'SubSpace' }} />,
  },
  {
    category: 'Product Design',
    title: 'Innovote',
    src: '/Projects/Innovote/Innovote 1.webp',
    content: <ProjectContent project={{ title: 'Innovote' }} />,
  },
  {
    category: 'AI Platform',
    title: 'Syz',
    src: '/Projects/Syz/Syz 1.png',
    content: <ProjectContent project={{ title: 'Syz' }} />,
  },
  {
    category: 'MCP Server',
    title: 'Swiftron',
    src: '/Projects/Swiftron/Swiftron.png',
    content: <ProjectContent project={{ title: 'Swiftron' }} />,
  },
  {
    category: 'AI Agents',
    title: 'HappyRobot',
    src: '/Projects/HappyRobot/HappyRobot.webp',
    content: <ProjectContent project={{ title: 'HappyRobot' }} />,
  },
];
