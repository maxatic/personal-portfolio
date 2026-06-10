import Image from 'next/image';
import { Image as Img } from 'lucide-react';
import { ChevronRight, Link } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { url } from 'inspector';

// Enhanced project content array with all projects
// NOTE: image paths below are placeholders — drop your own screenshots into /public
// using these filenames, or update the paths to match your assets.
const PROJECT_CONTENT = [
  {
    title: 'Amazon AI Assistant',
    description:
      'A RAG-based internal AI assistant I built during my Product Manager internship at Amazon Supply Chain. It indexed a knowledge base of 1,500+ files and automated the drafting of MBR/QBR reports, cutting metric retrieval time by 80%. This work was part of why I received the Continuous Learning & Development Award within an 80+ person team. (Internal Amazon project — details are anonymised.)',
    techStack: [
      'RAG',
      'LLM',
      'Python',
      'Prompt Engineering',
      'Data Pipelines',
      'Internal Tooling',
    ],
    date: '2025',
    links: [],
    images: [
      {
        src: '/project-amazon-ai.png',
        alt: 'Amazon AI assistant concept',
      },
    ],
  },
  {
    title: 'AI Portfolio',
    description:
      "This very portfolio — an interactive, AI-powered experience where visitors chat with an avatar of me instead of scrolling a static page. It adapts to whatever you're curious about: my background, projects, skills, or how to reach me. Built on TanStack Start with the Vercel AI SDK.",
    techStack: [
      'React',
      'TanStack Start',
      'TypeScript',
      'Tailwind CSS',
      'Vercel AI SDK',
      'Framer Motion',
    ],
    date: '2026',
    links: [],
    images: [
      {
        src: '/project-portfolio.png',
        alt: 'AI Portfolio landing page',
      },
    ],
  },
  {
    title: 'CardioGuard',
    description:
      'A machine-learning web app that predicts heart-disease risk from patient data using a Random Forest classifier, with SHAP explainability so the predictions are interpretable. It ships role-based dashboards (different views per user type) and JWT-secured REST APIs — a full ML product end-to-end, not just a notebook.',
    techStack: [
      'Python',
      'Django',
      'scikit-learn',
      'SHAP',
      'REST API',
      'JWT Auth',
    ],
    date: '2024',
    links: [],
    images: [
      {
        src: '/project-cardioguard.png',
        alt: 'CardioGuard dashboard',
      },
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
      {
        src: '/project-innovote.png',
        alt: 'Innovote app design',
      },
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
      {
        src: '/project-subspace.png',
        alt: 'SubSpace game UI',
      },
    ],
  },
  {
    title: 'GDG DevFest',
    description:
      'As Co-Lead of Google Developer Groups Astana, I organised DevFest 2023 for 500+ participants (55% YoY growth), including TensorFlow workshops for 134 developers. I grew GDG membership 325% in four months through coding workshops and university partnerships, adding 200+ developers.',
    techStack: [
      'Community Building',
      'Event Management',
      'Public Speaking',
      'Workshops',
    ],
    date: '2023',
    links: [],
    images: [
      {
        src: '/project-gdg.png',
        alt: 'GDG DevFest event',
      },
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
    category: 'AI Tooling',
    title: 'Amazon AI Assistant',
    src: '/project-amazon-ai.png',
    content: <ProjectContent project={{ title: 'Amazon AI Assistant' }} />,
  },
  {
    category: 'AI Project',
    title: 'AI Portfolio',
    src: '/project-portfolio.png',
    content: <ProjectContent project={{ title: 'AI Portfolio' }} />,
  },
  {
    category: 'Machine Learning',
    title: 'CardioGuard',
    src: '/project-cardioguard.png',
    content: <ProjectContent project={{ title: 'CardioGuard' }} />,
  },
  {
    category: 'Product Design',
    title: 'Innovote',
    src: '/project-innovote.png',
    content: <ProjectContent project={{ title: 'Innovote' }} />,
  },
  {
    category: 'Game Design',
    title: 'SubSpace',
    src: '/project-subspace.png',
    content: <ProjectContent project={{ title: 'SubSpace' }} />,
  },
  {
    category: 'Community',
    title: 'GDG DevFest',
    src: '/project-gdg.png',
    content: <ProjectContent project={{ title: 'GDG DevFest' }} />,
  },
];
