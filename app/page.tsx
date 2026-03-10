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

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
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
    <section className="relative pt-36 pb-20 px-6 overflow-hidden">
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-[#7C3AED]/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-[#7C3AED]/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-4xl text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-soft border border-accent/10 text-accent text-sm font-medium mb-8">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered App Builder
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-text-primary leading-[1.08] mb-6"
        >
          Build apps with
          <br />
          <span className="bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] bg-clip-text text-transparent">
            the power of AI
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Transform your ideas into production-ready applications. Just describe
          what you want, and watch your app come to life in real time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/register">
            <Button size="lg" className="group shadow-lg shadow-[#7C3AED]/20">
              Start Building Free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
          <a href="#chat-demo">
            <Button variant="secondary" size="lg">
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
      title: "Chat with AI",
      description:
        "Describe your app idea in natural language and let AI generate the code for you.",
    },
    {
      icon: Code2,
      title: "Live Code Editor",
      description:
        "Edit generated code in a powerful Monaco editor with syntax highlighting and IntelliSense.",
    },
    {
      icon: Layers,
      title: "Full-Stack Generation",
      description:
        "Generate both frontend and backend code with proper project structure and dependencies.",
    },
    {
      icon: Monitor,
      title: "Instant Preview",
      description:
        "See your app running in a live preview that updates as your code changes.",
    },
    {
      icon: Zap,
      title: "One-Click Deploy",
      description:
        "Start, stop, and restart your app runtime with a single click from the workspace.",
    },
    {
      icon: Sparkles,
      title: "Iterate with AI",
      description:
        "Keep chatting to refine, add features, fix bugs, and improve your app continuously.",
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary mb-4">
            Everything you need to build
          </h2>
          <p className="text-lg text-text-secondary max-w-xl mx-auto">
            A complete development environment powered by AI, right in your
            browser.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl border border-border-subtle p-7 hover:shadow-lg hover:shadow-black/[0.04] hover:border-gray-200 transition-all duration-300"
            >
              <div className="h-11 w-11 rounded-full bg-accent-soft flex items-center justify-center mb-5">
                <feature.icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-base font-semibold text-text-primary mb-2">
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

function ChatDemoSection() {
  const router = useRouter();
  const [messages, setMessages] = useState(DEMO_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsTyping(true);

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

  return (
    <section id="chat-demo" className="py-24 px-6">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary mb-4">
            Try it right now
          </h2>
          <p className="text-lg text-text-secondary max-w-lg mx-auto">
            Tell the AI what you want to build. Go ahead, describe your dream
            app.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl border border-border-subtle shadow-xl shadow-black/[0.06] overflow-hidden"
        >
          {/* Chat header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border-subtle">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">
                Bolder AI
              </p>
              <p className="text-xs text-success flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-success inline-block" />
                Online
              </p>
            </div>
          </div>

          {/* Chat messages */}
          <div className="h-[360px] overflow-y-auto px-6 py-5 space-y-5">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`h-7 w-7 rounded-full flex-shrink-0 flex items-center justify-center ${
                    msg.role === "user"
                      ? "bg-[#7C3AED]"
                      : "bg-gradient-to-br from-[#7C3AED] to-[#A78BFA]"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="h-3.5 w-3.5 text-white" />
                  ) : (
                    <Bot className="h-3.5 w-3.5 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] rounded-full px-5 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#7C3AED] text-white"
                      : "bg-[#f5f5f7] text-text-primary"
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="h-7 w-7 rounded-full flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-[#7C3AED] to-[#A78BFA]">
                  <Bot className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="bg-[#f5f5f7] rounded-full px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-text-muted animate-bounce [animation-delay:0ms]" />
                    <span className="h-2 w-2 rounded-full bg-text-muted animate-bounce [animation-delay:150ms]" />
                    <span className="h-2 w-2 rounded-full bg-text-muted animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat input */}
          <div className="border-t border-border-subtle p-4">
            <div className="flex items-end gap-3 bg-[#f5f5f7] rounded-full px-5 py-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe the app you want to build..."
                rows={1}
                className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted resize-none outline-none min-h-[24px] max-h-[120px]"
                style={{ fontFamily: "inherit" }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="h-8 w-8 rounded-full bg-accent hover:bg-[#6D28D9] disabled:bg-text-muted disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
              >
                <Send className="h-3.5 w-3.5 text-white" />
              </button>
            </div>
            <p className="text-xs text-text-muted text-center mt-3">
              Press Enter to send. Sign up to start building your app.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-4xl text-center bg-gradient-to-br from-white to-accent-soft/40 rounded-3xl border border-border-subtle p-14 shadow-lg shadow-black/[0.03]"
      >
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary mb-4">
          Ready to build something amazing?
        </h2>
        <p className="text-lg text-text-secondary max-w-lg mx-auto mb-8">
          Join thousands of developers using AI to build apps faster. Start your
          first project in minutes.
        </p>
        <Link href="/register">
          <Button size="lg" className="group shadow-lg shadow-[#7C3AED]/20">
            Create Free Account
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border-subtle py-10 px-6">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <Logo size="sm" />
        <p className="text-sm text-text-muted">
          &copy; {new Date().getFullYear()} Bolder Vibes. All rights reserved.
        </p>
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
      <ChatDemoSection />
      <CTASection />
      <Footer />
    </div>
  );
}
