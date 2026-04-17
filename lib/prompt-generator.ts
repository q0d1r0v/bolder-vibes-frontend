interface IndustryProfile {
  domain: string;
  coreEntities: string[];
  mustHaveScreens: string[];
  keyFlows: string[];
  integrations: string[];
  metrics: string[];
}

const INDUSTRY_PROFILES: Record<string, IndustryProfile> = {
  ecommerce: {
    domain: "mobile e-commerce storefront",
    coreEntities: ["Product", "Category", "Cart", "Order", "Customer", "Address", "Payment", "Review"],
    mustHaveScreens: [
      "Home with featured products and categories",
      "Product listing with search, filters, sort",
      "Product detail with image gallery, variants, add-to-cart",
      "Cart with quantity controls and price breakdown",
      "Checkout (address, shipping, payment, review)",
      "Order confirmation and order history",
      "User profile with addresses and saved cards",
      "Wishlist",
    ],
    keyFlows: [
      "Browse → search → filter → product detail → add to cart → checkout → pay → confirmation",
      "Guest checkout and authenticated checkout",
      "Re-order from order history",
    ],
    integrations: ["Stripe payments", "address autocomplete", "push notifications for order status", "image CDN"],
    metrics: ["conversion rate", "cart abandonment", "average order value"],
  },
  social: {
    domain: "social network mobile app",
    coreEntities: ["User", "Profile", "Post", "Comment", "Like", "Follow", "Notification", "Message"],
    mustHaveScreens: [
      "Feed with infinite scroll and pull-to-refresh",
      "Create post (text, image, video)",
      "Post detail with threaded comments",
      "User profile with followers/following",
      "Search users and posts",
      "Direct messages list and chat",
      "Notifications",
      "Settings and privacy",
    ],
    keyFlows: [
      "Sign up → onboarding → suggested follows → first post",
      "Like, comment, share, save",
      "Follow/unfollow and block",
    ],
    integrations: ["image/video upload", "realtime (WebSocket) for chat and notifications", "push notifications"],
    metrics: ["DAU/MAU", "retention", "engagement (likes+comments/session)"],
  },
  health: {
    domain: "health and fitness tracking app",
    coreEntities: ["User", "Workout", "Exercise", "Meal", "Food", "Metric", "Goal", "Progress"],
    mustHaveScreens: [
      "Dashboard with today's stats, streak, and goals",
      "Workout library and active workout tracker with timer",
      "Meal log and calorie tracker with barcode/search",
      "Progress charts (weight, reps, calories, steps)",
      "Goals and reminders",
      "Profile with body metrics and history",
    ],
    keyFlows: [
      "Set goal → daily check-in → log workout/meal → see progress trend",
      "Start a guided workout and record sets/reps",
    ],
    integrations: ["HealthKit/Google Fit", "local notifications for reminders", "charts library"],
    metrics: ["daily active streak", "goals completed", "workout completion rate"],
  },
  education: {
    domain: "mobile learning app",
    coreEntities: ["Course", "Lesson", "Quiz", "Question", "Enrollment", "Progress", "Certificate", "Instructor"],
    mustHaveScreens: [
      "Course catalog with categories and search",
      "Course detail with syllabus and reviews",
      "Lesson player (video/text) with progress tracking",
      "Quiz with instant feedback and scoring",
      "My learning with continue-where-you-left-off",
      "Profile with earned certificates",
    ],
    keyFlows: [
      "Discover → enroll → complete lessons → take quiz → earn certificate",
      "Resume last lesson from home",
    ],
    integrations: ["video playback", "offline download", "progress persistence", "push reminders"],
    metrics: ["course completion rate", "quiz accuracy", "time spent learning"],
  },
  food: {
    domain: "food delivery mobile app",
    coreEntities: ["Restaurant", "MenuItem", "Cart", "Order", "Address", "Driver", "Payment", "Review"],
    mustHaveScreens: [
      "Home with nearby restaurants, cuisines, promotions",
      "Restaurant detail with menu, hours, rating",
      "Menu item with modifiers and add-to-cart",
      "Cart with delivery fee and tip",
      "Checkout and live order tracking on map",
      "Order history and reorder",
      "Profile with saved addresses",
    ],
    keyFlows: [
      "Browse → select restaurant → build cart → checkout → track delivery → rate",
      "Reorder a past order in 2 taps",
    ],
    integrations: ["maps and geolocation", "Stripe payments", "realtime order status", "push notifications"],
    metrics: ["time-to-order", "on-time delivery", "reorder rate"],
  },
  productivity: {
    domain: "productivity and task management app",
    coreEntities: ["Task", "Project", "Tag", "Subtask", "Reminder", "Note", "User"],
    mustHaveScreens: [
      "Today view with due tasks and quick add",
      "Project list and project detail",
      "Task detail with subtasks, notes, attachments, reminders",
      "Calendar view (day/week)",
      "Notes list and editor",
      "Search and filters by tag/priority/date",
      "Settings and themes",
    ],
    keyFlows: [
      "Quick capture from anywhere → triage into project → complete with one tap",
      "Set reminder and receive local notification",
    ],
    integrations: ["local notifications", "optional cloud sync", "drag-and-drop reordering"],
    metrics: ["tasks completed per day", "overdue tasks", "streak"],
  },
  finance: {
    domain: "personal finance and budgeting app",
    coreEntities: ["Account", "Transaction", "Category", "Budget", "Goal", "Recurring", "Report"],
    mustHaveScreens: [
      "Dashboard with balances, spending vs budget, trends",
      "Transactions list with search and filters",
      "Add/edit transaction with category and notes",
      "Budgets per category with progress bars",
      "Goals (saving targets) with progress",
      "Reports with charts (income/expense/category)",
      "Accounts and settings",
    ],
    keyFlows: [
      "Log expense → auto-categorize → see budget impact",
      "Set monthly budget → receive alert at 80% and 100%",
    ],
    integrations: ["charts library", "local secure storage", "optional bank sync placeholder"],
    metrics: ["budget adherence", "savings rate", "categorization accuracy"],
  },
  custom: {
    domain: "custom mobile application",
    coreEntities: ["User", "Item", "Category", "Activity", "Setting"],
    mustHaveScreens: [
      "Home/dashboard",
      "Main list with search and filter",
      "Detail view with actions",
      "Create/edit form",
      "Profile and settings",
    ],
    keyFlows: [
      "Onboarding → primary action → result → share/save",
      "Authenticated CRUD on core entity",
    ],
    integrations: ["authentication", "persistent storage", "push notifications"],
    metrics: ["activation", "retention", "core action completion"],
  },
};

const INDUSTRY_LABELS: Record<string, string> = {
  ecommerce: "E-Commerce",
  social: "Social Network",
  health: "Health & Fitness",
  education: "Education",
  food: "Food & Delivery",
  productivity: "Productivity",
  finance: "Finance",
  custom: "Custom",
};

export function generateInitialPrompt(params: {
  industryId: string;
  appName: string;
  description?: string;
}): string {
  const { industryId, appName, description } = params;
  const profile = INDUSTRY_PROFILES[industryId] ?? INDUSTRY_PROFILES.custom;
  const label = INDUSTRY_LABELS[industryId] ?? "Custom";
  const trimmedDesc = (description || "").trim();

  const userVision = trimmedDesc
    ? trimmedDesc
    : `A polished ${profile.domain} called "${appName}".`;

  return [
    `Build a production-ready ${profile.domain} called **${appName}** in the ${label} space.`,
    "",
    "## Product vision",
    userVision,
    "",
    "## Target platform",
    "- React Native (Expo) mobile app, iOS + Android, responsive across phone sizes.",
    "- TypeScript strict, file-based routing, dark and light theme.",
    "",
    "## Core entities / data model",
    ...profile.coreEntities.map((e) => `- ${e}`),
    "",
    "## Must-have screens",
    ...profile.mustHaveScreens.map((s) => `- ${s}`),
    "",
    "## Key user flows",
    ...profile.keyFlows.map((f) => `- ${f}`),
    "",
    "## Non-negotiable quality bar",
    "- Clean, modern UI with consistent spacing, typography scale, and a cohesive color palette.",
    "- Loading, empty, and error states for every screen.",
    "- Form validation with inline errors and accessible labels.",
    "- Smooth navigation with proper back-stack handling and deep links.",
    "- Optimistic UI where it makes sense; no spinners where a skeleton would feel better.",
    "- Persistent state across app restarts for the core entities.",
    "- Seed the app with realistic mock data so every screen looks alive on first launch.",
    "- Accessibility: readable contrast, tappable hit areas ≥44pt, screen-reader labels.",
    "",
    "## Integrations to scaffold",
    ...profile.integrations.map((i) => `- ${i}`),
    "",
    "## Success metrics to instrument",
    ...profile.metrics.map((m) => `- ${m}`),
    "",
    "## Delivery plan",
    "1. Propose the information architecture and navigation map.",
    "2. Define the data model, state management, and folder structure.",
    "3. Build the design system primitives (colors, typography, buttons, inputs, cards).",
    "4. Implement each must-have screen end-to-end with mock data and working interactions.",
    "5. Wire the key user flows so a reviewer can tap through the product with zero dead ends.",
    "6. Polish: animations, haptics, empty states, and a friendly onboarding.",
    "",
    "## Build order (strict — otherwise the preview will fail to compile)",
    "- Create files bottom-up: types → theme → stores → components → screens → navigation → App.tsx LAST.",
    "- Never import a file you have not already created earlier in this same response.",
    "- If budget is tight, ship a SMALLER app where every import resolves rather than a larger app with missing screens. A placeholder screen is better than a broken import.",
    "",
    "Start by producing a concrete plan for my approval before writing code.",
  ].join("\n");
}

export const PENDING_PROMPT_KEY = (projectId: string) => `bv-pending-prompt:${projectId}`;
export const PENDING_PLAN_MODE_KEY = (projectId: string) => `bv-pending-plan-mode:${projectId}`;
