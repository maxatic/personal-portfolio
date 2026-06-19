import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { motion } from "framer-motion";
import {
  Award,
  BriefcaseBusiness,
  BriefcaseIcon,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleEllipsis,
  CodeIcon,
  FileText,
  GraduationCapIcon,
  Laugh,
  Layers,
  MailIcon,
  Sparkles,
  UserRoundSearch,
  UserSearch,
} from "lucide-react";
import { useState } from "react";
import { Drawer } from "vaul";

interface HelperBoostProps {
  submitQuery?: (query: string) => void;
  submitPredefined?: (query: string, tool: string) => void;
  setInput?: (value: string) => void;
  hasReachedLimit?: boolean;
}

// Each subcategory chip maps to the card it should always render instantly.
const questionTools: Record<string, string> = {
  Me: "getPresentation",
  Experience: "getExperience",
  Education: "getEducation",
  Resume: "getResume",
  Projects: "getProjects",
  Skills: "getSkills",
  Certifications: "getCertifications",
  Contact: "getContact",
};

const questions = {
  Me: "Who are you? I want to know more about you.",
  Experience: "Where have you worked? Walk me through your work experience.",
  Education: "What's your educational background? Where did you study?",
  Resume: "Can I see your resume?",
  Projects: "What are your projects? What are you working on right now?",
  Skills: "What are your skills? Give me a list of your soft and hard skills.",
  Certifications: "What certifications do you have? Show me your credentials.",
  Contact: "How can I reach you? What kind of role are you looking for?",
};

const questionConfig = [
  { key: "Me", color: "#329696", icon: Laugh },
  { key: "Experience", color: "#C26A2D", icon: BriefcaseIcon },
  { key: "Education", color: "#2F77B5", icon: GraduationCapIcon },
  { key: "Resume", color: "#2563EB", icon: FileText },
  { key: "Projects", color: "#3E9858", icon: BriefcaseBusiness },
  { key: "Skills", color: "#856ED9", icon: Layers },
  { key: "Certifications", color: "#10A37F", icon: Award },
  { key: "Contact", color: "#C19433", icon: UserRoundSearch },
];

// Helper drawer data
const specialQuestions = [
  "Gaming you said?? Tell me more!",
  "Walk me through your work experience.",
  "Who are you?",
  "Can I see your resume?",
  "What projects are you most proud of?",
  "What are your skills?",
  "How can I reach you?",
  "What's the craziest thing you've ever done?",
];

const questionsByCategory = [
  {
    id: "ai",
    name: "Ask AI",
    icon: Sparkles,
    ai: true,
    questions: aiQuestions,
  },
  {
    id: "me",
    name: "Me",
    icon: UserSearch,
    questions: [
      "Who are you?",
      "What are your passions?",
      "How did you get started in tech?",
      "Where do you see yourself in 5 years?",
    ],
  },
  {
    id: "experience",
    name: "Work Experience",
    icon: BriefcaseBusiness,
    questions: [
      "Walk me through your work experience.",
      "How was your experience at Amazon?",
      "What did you build at VEON Beeline?",
      "Tell me about your startup experience.",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    icon: BriefcaseIcon,
    questions: [
      "Can I see your resume?",
      "What makes you a valuable team member?",
      "Why should I hire you?",
      "What's your educational background?",
    ],
  },
  {
    id: "projects",
    name: "Projects",
    icon: CodeIcon,
    questions: ["What projects are you most proud of?"],
  },
  {
    id: "skills",
    name: "Skills",
    icon: GraduationCapIcon,
    questions: ["What are your skills?", "How was your experience at Amazon?"],
  },
  {
    id: "certifications",
    name: "Certifications",
    icon: Award,
    questions: [
      "What certifications do you have?",
      "Are you Scrum certified?",
      "Show me your credentials.",
    ],
  },
  {
    id: "contact",
    name: "Contact & Future",
    icon: MailIcon,
    questions: [
      "How can I reach you?",
      "What kind of role are you looking for?",
      "Where are you located?",
    ],
  },
];

// Animated Chevron component
const AnimatedChevron = () => {
  return (
    <motion.div
      animate={{
        y: [0, -4, 0], // Subtle up and down motion
      }}
      transition={{
        duration: 1.5,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop",
      }}
      className="text-primary mb-1.5"
    >
      <ChevronUp size={16} />
    </motion.div>
  );
};

export default function HelperBoost({
  submitQuery,
  submitPredefined,
  setInput,
  hasReachedLimit = false,
}: HelperBoostProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [open, setOpen] = useState(false);

  // Subcategory chips always render their predefined card (no AI call).
  const handleQuestionClick = (questionKey: string) => {
    const question = questions[questionKey as keyof typeof questions];
    const tool = questionTools[questionKey];
    if (submitPredefined && tool) {
      submitPredefined(question, tool);
    } else {
      submitQuery?.(question);
    }
  };

  const handleDrawerQuestionClick = (question: string) => {
    if (submitQuery) {
      submitQuery(question);
    }
    setOpen(false);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <Drawer.Root open={open} onOpenChange={setOpen}>
        <div className="w-full">
          {/* Toggle Button */}
          <div className={isVisible ? "mb-2 flex justify-center" : "mb-0 flex justify-center"}>
            <button
              onClick={toggleVisibility}
              className="flex items-center gap-1 px-3 py-1 text-xs text-gray-500 transition-colors hover:text-gray-700"
            >
              {isVisible ? (
                <>
                  <ChevronDown size={14} />
                  Hide quick questions
                </>
              ) : (
                <>
                  <ChevronUp size={14} />
                  Show quick questions
                </>
              )}
            </button>
          </div>

          {/* HelperBoost Content */}
          {isVisible && (
            <div className="w-full">
              <div
                className="flex w-full flex-wrap gap-1 md:gap-3"
                style={{ justifyContent: "safe center" }}
              >
                {questionConfig.map(({ key, color, icon: Icon }) => (
                  <Button
                    key={key}
                    onClick={() => !hasReachedLimit && handleQuestionClick(key)}
                    variant="outline"
                    className={`h-auto min-w-[100px] flex-shrink-0 rounded-xl border px-4 py-3 shadow-none backdrop-blur-sm transition-colors ${
                      hasReachedLimit
                        ? "cursor-not-allowed border-gray-200 bg-gray-100 opacity-50"
                        : "border-border hover:bg-accent/80 hover:border-foreground/20 hover:shadow-sm cursor-pointer bg-white/80 active:scale-95"
                    }`}
                    disabled={hasReachedLimit}
                  >
                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
                      <Icon size={18} strokeWidth={2} color={color} />
                      <span className="text-sm font-medium">{key}</span>
                    </div>
                  </Button>
                ))}

                {/* Need Inspiration Button */}
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Drawer.Trigger
                        className="group relative flex flex-shrink-0 items-center justify-center"
                        disabled={hasReachedLimit}
                      >
                        <motion.div
                          className={`flex h-auto items-center space-x-1 rounded-xl border px-4 py-3 text-sm backdrop-blur-sm transition-colors duration-200 ${
                            hasReachedLimit
                              ? "cursor-not-allowed border-gray-200 bg-gray-100 opacity-50"
                              : "hover:bg-accent/80 hover:border-foreground/20 hover:shadow-sm cursor-pointer border-neutral-200 bg-white/80 dark:border-neutral-800 dark:bg-neutral-900"
                          }`}
                          whileHover={!hasReachedLimit ? { scale: 1 } : {}}
                          whileTap={!hasReachedLimit ? { scale: 0.98 } : {}}
                        >
                          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
                            <CircleEllipsis
                              className="h-[20px] w-[18px]"
                              //style={{ color: '#3B82F6' }}
                              strokeWidth={2}
                            />
                            {/*<span className="text-sm font-medium">More</span>*/}
                          </div>
                        </motion.div>
                      </Drawer.Trigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <AnimatedChevron />
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Content */}
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-100 bg-black/60 backdrop-blur-xs" />
          <Drawer.Content className="fixed right-0 bottom-0 left-0 z-100 mt-24 flex h-[80%] flex-col rounded-t-[10px] bg-gray-100 outline-none lg:h-[60%]">
            <div className="flex-1 overflow-y-auto rounded-t-[10px] bg-white p-4">
              <div className="mx-auto max-w-md space-y-4">
                <div
                  aria-hidden
                  className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-300"
                />
                <div className="mx-auto w-full max-w-md">
                  <div className="space-y-8 pb-16">
                    {questionsByCategory.map((category) => (
                      <CategorySection
                        key={category.id}
                        name={category.name}
                        Icon={category.icon}
                        questions={category.questions}
                        onQuestionClick={handleDrawerQuestionClick}
                        isAI={category.ai}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}

// Component for each category section
interface CategorySectionProps {
  name: string;
  Icon: React.ElementType;
  questions: string[];
  onQuestionClick: (question: string) => void;
}

function CategorySection({ name, Icon, questions, onQuestionClick }: CategorySectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2.5 px-1">
        <Icon className="h-5 w-5" />
        <Drawer.Title className="text-[22px] font-medium text-gray-900">{name}</Drawer.Title>
      </div>

      <Separator className="my-4" />

      <div className="space-y-3">
        {questions.map((question, index) => (
          <QuestionItem
            key={index}
            question={question}
            onClick={() => onQuestionClick(question)}
            isSpecial={specialQuestions.includes(question)}
          />
        ))}
      </div>
    </div>
  );
}

// Component for each question item with animated chevron
interface QuestionItemProps {
  question: string;
  onClick: () => void;
  isSpecial: boolean;
}

function QuestionItem({ question, onClick, isSpecial }: QuestionItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className={cn(
        "flex w-full items-center justify-between rounded-[10px]",
        "text-md px-6 py-4 text-left font-normal",
        "transition-all",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        isSpecial ? "bg-black" : "bg-[#F7F8F9]",
      )}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{
        backgroundColor: isSpecial ? undefined : "#F0F0F2",
      }}
      whileTap={{
        scale: 0.98,
        backgroundColor: isSpecial ? undefined : "#E8E8EA",
      }}
    >
      <div className="flex items-center">
        {isSpecial && <Sparkles className="mr-2 h-4 w-4 text-white" />}
        <span className={isSpecial ? "font-medium text-white" : ""}>{question}</span>
      </div>
      <motion.div
        animate={{ x: isHovered ? 4 : 0 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
        }}
      >
        <ChevronRight
          className={cn("h-5 w-5 shrink-0", isSpecial ? "text-white" : "text-primary")}
        />
      </motion.div>
    </motion.button>
  );
}
