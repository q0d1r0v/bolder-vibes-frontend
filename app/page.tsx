"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Code2,
  Layers,
  Zap,
  Send,
  Bot,
  User,
  Play,
  Monitor,
  MessageSquare,
  Rocket,
  Shield,
  ListChecks,
  ChevronDown,
  Brain,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

type ChatMessage = { role: "user" | "assistant"; content: string };

const DEMO_MESSAGES: ChatMessage[] = [
  {
    role: "assistant",
    content:
      "Hi! I'm your AI development assistant. Tell me what app you'd like to build, and I'll help you create it from scratch.",
  },
];

function AnimatedGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(124,58,237,0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(124,58,237,0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <motion.div
        animate={{
          x: [0, 100, 50, 0],
          y: [0, -50, 80, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 left-1/6 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-accent/8 to-accent-light/5 blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -80, 40, 0],
          y: [0, 60, -40, 0],
          scale: [1, 0.8, 1.1, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/3 right-1/6 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-purple-400/6 to-blue-400/4 blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, 60, -30, 0],
          y: [0, -80, 30, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-indigo-400/5 to-accent/3 blur-3xl"
      />
    </div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-black/[0.06] shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
        <Logo />
        <div className="hidden md:flex items-center gap-8 text-sm text-text-secondary">
          <a href="#features" className="hover:text-text-primary transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-text-primary transition-colors">How it Works</a>
          <a href="#chat-demo" className="hover:text-text-primary transition-colors">Try AI</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

function HeroSection() {
  return (
    <section className="relative pt-32 pb-24 px-6 overflow-hidden min-h-[90vh] flex items-center">
      <AnimatedGrid />

      <div className="mx-auto max-w-5xl text-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/5 border border-accent/15 text-accent text-sm font-medium mb-8 backdrop-blur-sm">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Rocket className="h-3.5 w-3.5" />
            </motion.div>
            The Future of App Development is Here
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-[5rem] font-bold tracking-tight text-text-primary leading-[1.05] mb-6"
        >
          Describe your idea.
          <br />
          <span className="relative">
            <span className="bg-gradient-to-r from-accent via-purple-500 to-accent-light bg-clip-text text-transparent">
              We build it live.
            </span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-accent to-accent-light rounded-full origin-left"
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Bolder Vibes turns natural language into production-ready applications.
          Chat with AI, watch code generate in real-time, and deploy instantly.
          {" "}
          <span className="text-text-primary font-medium">No coding required.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/register">
            <Button size="lg" className="group shadow-lg shadow-accent/25 text-base px-10 h-14">
              Start Building Free
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <a href="#chat-demo">
            <Button variant="secondary" size="lg" className="text-base h-14 px-8">
              <Play className="h-4 w-4" />
              Try the AI Chat
            </Button>
          </a>
        </motion.div>

      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: MessageSquare,
      title: "Chat-Driven Development",
      description:
        "Describe your app in natural language. Our AI understands complex requirements and generates production-quality code.",
      color: "from-violet-500 to-purple-600",
    },
    {
      icon: Code2,
      title: "Live Code Editor",
      description:
        "Watch code appear in real-time in a professional Monaco editor with syntax highlighting, autocomplete, and debugging.",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: Layers,
      title: "Full-Stack in Seconds",
      description:
        "Frontend, backend, database — complete application architecture generated with proper project structure.",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: Monitor,
      title: "Instant Live Preview",
      description:
        "See your app running immediately. Every change updates the preview in real-time — no waiting, no refreshing.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Zap,
      title: "One-Click Deploy",
      description:
        "Go from idea to production in minutes. Deploy to the cloud with a single click, no DevOps knowledge needed.",
      color: "from-yellow-500 to-amber-600",
    },
    {
      icon: Shield,
      title: "Enterprise-Grade Security",
      description:
        "SOC 2 compliant infrastructure, encrypted data, role-based access control. Built for teams that take security seriously.",
      color: "from-rose-500 to-pink-600",
    },
  ];

  return (
    <section id="features" className="py-28 px-6 relative">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-accent text-sm font-semibold tracking-wide uppercase mb-4">
            Platform
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary mb-5">
            Everything you need.
            <br />
            <span className="text-text-secondary">Nothing you don't.</span>
          </h2>
          <p className="text-lg text-text-secondary max-w-xl mx-auto">
            A complete AI-powered development environment that replaces your
            entire toolchain.
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
              className="group relative bg-white/70 backdrop-blur-sm rounded-2xl border border-border-subtle p-8 hover:shadow-xl hover:shadow-black/[0.06] hover:border-gray-200 hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg shadow-black/10 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
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
      title: "Describe Your Vision",
      description:
        "Tell our AI what you want to build. Use natural language — no technical jargon needed. The AI understands context, requirements, and edge cases.",
      icon: MessageSquare,
    },
    {
      step: "02",
      title: "Watch It Build",
      description:
        "See your application take shape in real-time. Frontend components, API endpoints, database schemas — all generated and wired together automatically.",
      icon: Code2,
    },
    {
      step: "03",
      title: "Refine & Iterate",
      description:
        "Keep chatting to add features, fix issues, or change the design. Each iteration builds on the last — your AI remembers everything.",
      icon: Sparkles,
    },
    {
      step: "04",
      title: "Deploy & Scale",
      description:
        "One click to go live. Your app runs on enterprise-grade infrastructure with automatic scaling, SSL, and monitoring included.",
      icon: Rocket,
    },
  ];

  return (
    <section id="how-it-works" className="py-28 px-6 bg-gradient-to-b from-background to-white/50">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block text-accent text-sm font-semibold tracking-wide uppercase mb-4">
            How it works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary mb-5">
            From idea to production
            <br />
            <span className="text-text-secondary">in four simple steps</span>
          </h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-accent/20 via-accent/40 to-accent/10 hidden md:block" />

          <div className="space-y-16">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex gap-8 items-start"
              >
                <div className="relative flex-shrink-0">
                  <motion.div
                    whileInView={{ scale: [0.5, 1.1, 1] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                    className="h-16 w-16 rounded-2xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center shadow-lg shadow-accent/25"
                  >
                    <step.icon className="h-7 w-7 text-white" />
                  </motion.div>
                </div>

                <div className="pt-1">
                  <div className="text-xs font-bold text-accent uppercase tracking-widest mb-2">
                    Step {step.step}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-3">
                    {step.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed max-w-lg">
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

const DEMO_MODELS = [
  { id: "claude-sonnet-4", name: "Claude Sonnet 4", description: "Fast and capable — best for most coding tasks", costTier: "medium" as const },
  { id: "claude-opus-4", name: "Claude Opus 4", description: "Most powerful — deep reasoning and complex architecture", costTier: "high" as const },
  { id: "claude-haiku-4.5", name: "Claude Haiku 4.5", description: "Fastest and cheapest — quick edits and simple tasks", costTier: "low" as const },
];

const demoModelIcons = { low: Zap, medium: Sparkles, high: Brain } as const;
const demoModelColors = { low: "text-green-600", medium: "text-blue-600", high: "text-purple-600" } as const;

function DemoPlanToggle({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors ${
        active
          ? "bg-amber-100 text-amber-700 border border-amber-300"
          : "text-text-muted hover:bg-gray-100"
      }`}
    >
      <ListChecks className="h-3 w-3" />
      <span className="font-medium">Plan</span>
    </button>
  );
}

function DemoModelSelector({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = DEMO_MODELS.find((m) => m.id === selected) || DEMO_MODELS[0];
  const Icon = demoModelIcons[current.costTier];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs hover:bg-gray-100 transition-colors"
      >
        <Icon className={`h-3 w-3 ${demoModelColors[current.costTier]}`} />
        <span className="text-text-secondary font-medium">{current.name}</span>
        <ChevronDown className="h-3 w-3 text-text-muted" />
      </button>

      {open && (
        <div className="absolute bottom-full right-0 mb-1 w-72 bg-white rounded-lg shadow-lg border border-border-subtle z-50 py-1">
          {DEMO_MODELS.map((model) => {
            const ModelIcon = demoModelIcons[model.costTier];
            const isActive = model.id === selected;
            return (
              <button
                key={model.id}
                onClick={() => { onSelect(model.id); setOpen(false); }}
                className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors ${isActive ? "bg-accent-soft/30" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <ModelIcon className={`h-3.5 w-3.5 ${demoModelColors[model.costTier]}`} />
                  <span className="text-sm font-medium text-text-primary">{model.name}</span>
                  {isActive && <span className="ml-auto text-xs text-accent font-medium">Active</span>}
                </div>
                <p className="text-xs text-text-muted mt-0.5 ml-5.5">{model.description}</p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ChatDemoSection() {
  const router = useRouter();
  const [messages, setMessages] = useState(DEMO_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [planMode, setPlanMode] = useState(false);
  const [selectedModel, setSelectedModel] = useState("claude-sonnet-4");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsTyping(true);
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Great idea! To start building your app, you'll need to create a free account first. Let me take you to the registration page...",
        },
      ]);
      setIsTyping(false);

      setTimeout(() => {
        router.push("/register");
      }, 2000);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  };

  return (
    <section id="chat-demo" className="py-28 px-6 bg-gradient-to-b from-white/50 to-background">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-accent text-sm font-semibold tracking-wide uppercase mb-4">
            See it in action
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary mb-4">
            Your AI workspace
          </h2>
          <p className="text-lg text-text-secondary max-w-lg mx-auto">
            This is exactly how you'll build apps — describe your idea, and the AI creates it.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-xl border border-border-subtle shadow-2xl shadow-black/8"
        >
          <div className="flex items-center justify-between px-4 py-2 border-b border-border-subtle bg-gray-50 rounded-t-xl">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-accent" />
              <span className="text-sm font-semibold text-text-primary">New Chat</span>
            </div>
          </div>

          <div className="h-80 sm:h-96 overflow-y-auto px-4 py-4 space-y-4">
            {messages.length === 0 && !isTyping ? (
              <div className="flex-1 flex items-center justify-center text-text-muted h-full">
                <div className="text-center">
                  <Bot className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">Start a conversation</p>
                  <p className="text-xs mt-1">
                    Describe what you want to build — AI can create and edit files
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-2.5 ${
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.role === "user" ? "bg-accent" : "bg-gray-100"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <User className="h-3.5 w-3.5 text-white" />
                      ) : (
                        <Bot className="h-3.5 w-3.5 text-text-secondary" />
                      )}
                    </div>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                        msg.role === "user"
                          ? "bg-accent text-white rounded-br-md"
                          : "bg-gray-100 text-text-primary rounded-bl-md"
                      }`}
                    >
                      <div className="whitespace-pre-wrap break-words leading-relaxed">
                        {msg.content}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-2.5 flex-row"
                  >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100">
                      <Bot className="h-3.5 w-3.5 text-text-secondary" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" />
                        <span className="text-xs text-accent animate-pulse">AI is thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-border-subtle p-4">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-1 mb-2 px-1">
                <DemoPlanToggle active={planMode} onToggle={() => setPlanMode(!planMode)} />
                <DemoModelSelector selected={selectedModel} onSelect={setSelectedModel} />
              </div>
              <div className="flex items-end gap-2 bg-white rounded-2xl border border-border-subtle px-4 py-3 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10 transition-all shadow-sm">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  aria-label="Describe your app idea"
                  placeholder="Describe what you want to build..."
                  rows={3}
                  className="flex-1 resize-none border-none outline-none text-sm text-text-primary placeholder:text-text-muted bg-transparent py-1"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  aria-label="Send message"
                  className={`p-2 rounded-full transition-colors flex-shrink-0 ${
                    input.trim()
                      ? "bg-accent text-white hover:bg-accent/90"
                      : "text-text-muted"
                  }`}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-text-muted mt-1.5 text-center">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-28 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-4xl text-center relative overflow-hidden rounded-[2rem] border border-border-subtle"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-white to-purple-500/5" />
        <motion.div
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(45deg, rgba(124,58,237,0.1) 0%, transparent 50%, rgba(167,139,250,0.1) 100%)",
            backgroundSize: "200% 200%",
          }}
        />

        <div className="relative p-12 sm:p-16">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-8 right-12 opacity-10"
          >
            <Sparkles className="h-20 w-20 text-accent" />
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary mb-5">
            Ready to build
            <br />
            something bold?
          </h2>
          <p className="text-lg text-text-secondary max-w-lg mx-auto mb-10">
            Join the next generation of builders. Start creating
            production-ready apps with the power of AI — no code required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button
                size="lg"
                className="group shadow-xl shadow-accent/25 text-base px-10 h-14"
              >
                Get Started — It's Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          <p className="text-sm text-text-muted mt-6">
            No credit card required. Build your first app in under 2 minutes.
          </p>
        </div>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border-subtle py-14 px-6 bg-white/30">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-10">
          <div>
            <Logo />
            <p className="text-sm text-text-muted mt-3 max-w-xs">
              AI-powered app development platform. From idea to production in
              minutes.
            </p>
          </div>
          <div className="flex gap-16 text-sm">
            <div>
              <h4 className="font-semibold text-text-primary mb-4">Product</h4>
              <ul className="space-y-2.5 text-text-muted">
                <li>
                  <a href="#features" className="hover:text-text-primary transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-text-primary transition-colors">
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="#chat-demo" className="hover:text-text-primary transition-colors">
                    Live Demo
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-text-primary mb-4">Company</h4>
              <ul className="space-y-2.5 text-text-muted">
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
        <div className="border-t border-border-subtle pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} Bolder Vibes. All rights
            reserved.
          </p>
          <div className="flex gap-6 text-xs text-text-muted">
            <span className="cursor-default">Privacy</span>
            <span className="cursor-default">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ChatDemoSection />
      <CTASection />
      <Footer />
    </div>
  );
}
