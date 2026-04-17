"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Code2,
  Layers,
  Zap,
  Monitor,
  MessageSquare,
  Rocket,
  ListChecks,
  Brain,
} from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";

const HeroWave = dynamic(
  () => import("@/components/ui/ai-input-hero").then((m) => ({ default: m.HeroWave })),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen bg-[#0a0a0f]" />
    ),
  }
);


function FeaturesSection() {
  const features = [
    {
      icon: MessageSquare,
      title: "Chat-to-Code Workspace",
      description:
        "Describe what you want in plain language. The AI generates frontend, backend, and database code in a real-time chat workspace.",
      color: "from-violet-500 to-purple-600",
    },
    {
      icon: Brain,
      title: "Multi-Model AI",
      description:
        "Choose between Claude Opus for complex architecture, Sonnet for balanced tasks, or Haiku for quick edits — switch models anytime.",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: Monitor,
      title: "Live Mobile Preview",
      description:
        "See your app running on real device frames instantly. iPhone, Android, tablet — preview updates live as the AI writes code.",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: ListChecks,
      title: "Smart Plan Mode",
      description:
        "Toggle Plan Mode for the AI to analyze and plan first, then build. Review the approach before a single line of code is written.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Layers,
      title: "Industry Templates",
      description:
        "Start with E-Commerce, Social Network, Health, Education, Food, Finance, Productivity, or go fully custom — AI adapts to your domain.",
      color: "from-yellow-500 to-amber-600",
    },
    {
      icon: Zap,
      title: "3-Step AI Agent",
      description:
        "Planner analyzes your request, Developer writes the code, Refactor optimizes it — watch each step progress in real-time.",
      color: "from-rose-500 to-pink-600",
    },
  ];

  return (
    <section id="features" className="py-28 px-6 relative z-[1]">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[#60a5fa] text-sm font-semibold tracking-wide uppercase mb-4">
            Platform
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-5">
            Your AI dev team.
            <br />
            <span className="text-gray-500">One chat window.</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            A full-stack AI workspace that plans, codes, and previews your
            app — all from a single conversation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group relative bg-[#14141c]/85 backdrop-blur-sm rounded-2xl border border-white/10 p-8 hover:bg-[#1a1a24]/90 hover:border-white/15 hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Create a Project",
      description:
        "Pick an industry template — E-Commerce, Social Network, Health, Education, or go fully custom. Name your project and jump into the workspace.",
      icon: Rocket,
    },
    {
      step: "02",
      title: "Chat with AI",
      description:
        "Describe features in plain language. Choose your AI model — Opus for complex tasks, Sonnet for balanced work, Haiku for quick edits. Toggle Plan Mode for reviewed development.",
      icon: MessageSquare,
    },
    {
      step: "03",
      title: "Watch It Build Live",
      description:
        "The AI agent plans, writes code, and refactors — watch each step in real-time. See file operations as they happen and track progress through the 3-step pipeline.",
      icon: Code2,
    },
    {
      step: "04",
      title: "Preview on Device",
      description:
        "Your app runs instantly on real device frames — iPhone, Android, or tablet. Iterate by chatting more, and the preview refreshes automatically.",
      icon: Monitor,
    },
  ];

  return (
    <section id="how-it-works" className="py-28 px-6 relative z-[1]">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block text-[#60a5fa] text-sm font-semibold tracking-wide uppercase mb-4">
            How it works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-5">
            From idea to production
            <br />
            <span className="text-gray-500">in four simple steps</span>
          </h2>
        </motion.div>

        <div className="relative">
          <div className="space-y-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex gap-6 items-start bg-[#14141c]/85 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-[#1a1a24]/90 hover:border-white/15 transition-all duration-300"
              >
                <div className="relative flex-shrink-0">
                  <motion.div
                    whileInView={{ scale: [0.5, 1.1, 1] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                    className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#1f3dbc] to-[#1a2f8a] flex items-center justify-center shadow-lg shadow-[#1f3dbc]/25"
                  >
                    <step.icon className="h-6 w-6 text-white" />
                  </motion.div>
                </div>

                <div className="pt-0.5">
                  <div className="text-xs font-bold text-[#60a5fa] uppercase tracking-widest mb-1.5">
                    Step {step.step}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


function CTASection() {
  return (
    <section className="py-28 px-6 relative z-[1]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-4xl text-center relative overflow-hidden rounded-[2rem] border border-white/8"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#1f3dbc]/10 via-[#0a0a0f] to-[#60a5fa]/5" />
        <motion.div
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(45deg, rgba(31,61,188,0.15) 0%, transparent 50%, rgba(167,139,250,0.1) 100%)",
            backgroundSize: "200% 200%",
          }}
        />

        <div className="relative p-12 sm:p-16">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-8 right-12 opacity-10"
          >
            <Sparkles className="h-20 w-20 text-[#1f3dbc]" />
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-5">
            Ready to build
            <br />
            something bold?
          </h2>
          <p className="text-lg text-gray-400 max-w-lg mx-auto mb-10">
            Join the next generation of builders. Start creating
            production-ready apps with the power of AI — no code required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <button className="group inline-flex items-center gap-2 px-10 h-14 text-base font-semibold text-white bg-[#1f3dbc] rounded-full hover:bg-[#2548d4] transition-colors shadow-xl shadow-[#1f3dbc]/25">
                Get Started — It&apos;s Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            No credit card required. Build your first app in under 2 minutes.
          </p>
        </div>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-14 px-6 relative z-[1]">
      <div className="mx-auto max-w-6xl bg-[#14141c]/85 backdrop-blur-sm rounded-2xl border border-white/10 p-8 sm:p-10">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-10">
          <div>
            <Logo variant="dark" />
            <p className="text-sm text-gray-500 mt-3 max-w-xs">
              AI-powered app development platform. From idea to production in
              minutes.
            </p>
          </div>
          <div className="flex gap-16 text-sm">
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2.5 text-gray-500">
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-white transition-colors">
                    How it Works
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2.5 text-gray-500">
                <li>
                  <span className="cursor-default">About</span>
                </li>
                <li>
                  <span className="cursor-default">Careers</span>
                </li>
                <li>
                  <span className="cursor-default">Contact</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Bolder Vibes. All rights
            reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <span className="cursor-default">Privacy</span>
            <span className="cursor-default">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  const router = useRouter();

  const handlePromptSubmit = (prompt: string) => {
    if (typeof window !== "undefined" && prompt.trim()) {
      sessionStorage.setItem("pendingPrompt", prompt);
    }
    router.push("/register");
  };

  return (
    <div className="min-h-screen">
      <HeroWave onPromptSubmit={handlePromptSubmit} />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </div>
  );
}
