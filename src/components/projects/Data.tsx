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
      "Co-leading Google Developer Groups in Astana is where I discovered how much I love building communities around technology. I took on DevFest, our flagship developer conference, and grew it into one of the city's biggest tech gatherings — but what I'm proudest of isn't the headcount. It's the people: students who showed up curious and left running their own workshops, volunteers I got to mentor, and a club that became a genuine home for developers in Astana. I learned to lead by creating momentum — partnering with universities, supporting the team, and giving people the space and reason to grow.",
    techStack: [
      'Community Building',
      'Event Management',
      'Public Speaking',
      'Mentoring',
    ],
    date: '2023',
    links: [],
    images: [
      { src: '/GDG 2.jpg', alt: 'GDG DevFest in Astana' },
      { src: '/GDG 3.jpg', alt: 'GDG community at DevFest' },
    ],
  },
  {
    title: 'CardioGuard',
    description:
      "CardioGuard tackles something real: most people don't know their heart attack risk until they're already in a clinic. I built this with a team of four as a university capstone — a full-stack web app where patients fill out a short health questionnaire and get back an AI-powered risk score, broken down by contributing factor using SHAP explainability. We shipped role-based dashboards for both patients and doctors, JWT-secured APIs with token refresh flows, and a Random Forest classifier trained on real Kaggle medical data. The part I'm proudest of is the explainability layer — it's not just a percentage, it shows exactly which metrics are pulling the number up or down, so a doctor can actually act on it.",
    techStack: [
      'Python',
      'Django',
      'scikit-learn',
      'SHAP',
      'Chart.js',
      'REST API',
      'JWT Auth',
    ],
    date: '2024',
    links: [],
    images: [
      { src: '/project-cardioguard-1.svg', alt: 'CardioGuard patient assessment form' },
      { src: '/project-cardioguard-2.svg', alt: 'CardioGuard risk score with SHAP breakdown' },
      { src: '/project-cardioguard-3.svg', alt: 'CardioGuard doctor dashboard' },
    ],
  },
  {
    title: 'SubSpace',
    description:
      'An Android puzzle game with portal mechanics, where I led UI/UX design. I created the full design system (HUD elements, game icons, user flows) and built 3D assets in Blender — a portal gun, the main character robot, and environmental props.',
    techStack: ['Figma', 'Blender', 'Game UI', 'Design Systems', '3D Modelling'],
    date: '2023',
    links: [],
    images: [
      { src: '/project-subspace-1.png', alt: 'SubSpace game UI' },
      { src: '/project-subspace-2.png', alt: 'SubSpace 3D assets' },
      { src: '/project-subspace-3.png', alt: 'SubSpace level design' },
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
      { src: '/project-innovote-1.png', alt: 'Innovote app design' },
      { src: '/project-innovote-2.png', alt: 'Innovote user flows' },
      { src: '/project-innovote-3.png', alt: 'Innovote research findings' },
    ],
  },
  {
    title: 'Syz',
    description:
      'PLACEHOLDER — replace with the real Syz story. A product I worked on focused on [domain/problem], where I [your role and contribution]. Built with a lean, iterative approach: scoping a tight MVP, designing the core flows, and shipping an early version to real users to learn fast.',
    techStack: ['Product', 'Figma', 'MVP', 'UX Research'],
    date: '2025',
    links: [],
    images: [
      { src: '/project-syz-1.png', alt: 'Syz overview' },
      { src: '/project-syz-2.png', alt: 'Syz screen two' },
      { src: '/project-syz-3.png', alt: 'Syz screen three' },
    ],
  },
  {
    title: 'Swiftron',
    description:
      'PLACEHOLDER — replace with the real Swiftron scope. Swiftron is a Model Context Protocol (MCP) server I built to give AI agents structured, tool-based access to [your system / data source]. It exposes a clean set of MCP tools so assistants like Claude can query and act on real data directly — instead of guessing — turning a manual workflow into something an agent can drive.',
    techStack: ['TypeScript', 'MCP', 'Node.js', 'Anthropic API', 'Tool Use'],
    date: '2026',
    links: [],
    images: [
      { src: '/project-swiftron-1.png', alt: 'Swiftron MCP server architecture' },
      { src: '/project-swiftron-2.png', alt: 'Swiftron tools in action' },
      { src: '/project-swiftron-3.png', alt: 'Swiftron agent demo' },
    ],
  },
  {
    title: 'HappyRobot',
    description:
      'PLACEHOLDER — replace with the real use case. An agent-orchestration project built on HappyRobot, wiring up AI agents to handle [workflow] end-to-end: routing tasks between agents, calling tools, and handing off to a human when needed. Focused on making a multi-step process reliable enough to run with minimal supervision.',
    techStack: [
      'AI Agents',
      'Agent Orchestration',
      'HappyRobot',
      'Automation',
      'LLM',
    ],
    date: '2026',
    links: [],
    images: [
      { src: '/project-happyrobot-1.png', alt: 'HappyRobot agent flow' },
      { src: '/project-happyrobot-2.png', alt: 'HappyRobot orchestration dashboard' },
      { src: '/project-happyrobot-3.png', alt: 'HappyRobot run logs' },
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
                className="relative aspect-video overflow-hidden rounded-2xl"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform"
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
    src: '/gdg-1.jpg',
    content: <ProjectContent project={{ title: 'GDG DevFest' }} />,
  },
  {
    category: 'Machine Learning',
    title: 'CardioGuard',
    src: '/project-cardioguard-1.png',
    content: <ProjectContent project={{ title: 'CardioGuard' }} />,
  },
  {
    category: 'Game Design',
    title: 'SubSpace',
    src: '/project-subspace-1.png',
    content: <ProjectContent project={{ title: 'SubSpace' }} />,
  },
  {
    category: 'Product Design',
    title: 'Innovote',
    src: '/project-innovote-1.png',
    content: <ProjectContent project={{ title: 'Innovote' }} />,
  },
  {
    category: 'Product',
    title: 'Syz',
    src: '/project-syz-1.png',
    content: <ProjectContent project={{ title: 'Syz' }} />,
  },
  {
    category: 'MCP Server',
    title: 'Swiftron',
    src: '/project-swiftron-1.png',
    content: <ProjectContent project={{ title: 'Swiftron' }} />,
  },
  {
    category: 'AI Agents',
    title: 'HappyRobot',
    src: '/project-happyrobot-1.png',
    content: <ProjectContent project={{ title: 'HappyRobot' }} />,
  },
];
