export const APP_NAME = "Asan Kaam";
export const APP_TAGLINE = "Kaam Dhundo. Kaam Karo. Asan Hai.";
export const APP_DESCRIPTION =
  "Pakistan's local task marketplace connecting posters with verified nearby taskers.";

export const COMMISSION_RATE = 0.12; // 12% — runtime-configurable
export const URGENCY_BOOST_PRICE_PKR = 99;
export const MIN_BALANCE_PKR = 500;
export const MAX_BUDGET_PKR = 50000;
export const MIN_BUDGET_PKR = 200;

export const ACTIVE_CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
] as const;

export const COMING_SOON_CITIES = [
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
] as const;

export const TASK_CATEGORIES = [
  "Errands & Shopping",
  "Moving & Delivery",
  "Cleaning",
  "Small Repairs & Maintenance",
  "Queue & Appointment Standing",
  "Digital Help",
  "Household Assistance",
  "Other",
] as const;

export type TaskCategory = (typeof TASK_CATEGORIES)[number];
export type ActiveCity = (typeof ACTIVE_CITIES)[number];

export type TaskStatus =
  | "draft"
  | "open"
  | "bid_received"
  | "assigned"
  | "in_progress"
  | "completion_requested"
  | "completed"
  | "cancelled"
  | "disputed";

export type VerificationStatus =
  | "unverified"
  | "submitted"
  | "verified"
  | "restricted";

export type UserRole = "poster" | "tasker";

export interface NavLink {
  label: string;
  href: string;
  key: string;
  mobileOnly?: boolean;
}

export const navLinks: NavLink[] = [
  { label: "Browse Tasks", href: "/", key: "browse" },
  { label: "Post a Task", href: "/post-task", key: "post" },
  { label: "My Tasks", href: "/my-tasks", key: "myTasks" },
  { label: "My Bids", href: "/my-bids-tasker", key: "myBids" },
  { label: "Messages", href: "/in-app-messaging-chat", key: "messages" },
  { label: "Balance", href: "/tasker-balance-transaction-history", key: "balance" },
  { label: "Profile", href: "/tasker-profile", key: "profile" },
  { label: "Sign In", href: "/auth", key: "signIn" },
];

export const footerLinks = {
  platform: [
    { label: "Browse Tasks", href: "/", key: "browse" },
    { label: "Post a Task", href: "/post-task", key: "post" },
    { label: "My Tasks", href: "/my-tasks", key: "myTasks" },
    { label: "My Bids", href: "/my-bids-tasker", key: "myBids" },
  ],
  tasker: [
    { label: "Verification", href: "/verification-status", key: "verification" },
    { label: "Balance & Ledger", href: "/tasker-balance-transaction-history", key: "balance" },
    { label: "Tasker Profile", href: "/tasker-profile", key: "profile" },
    { label: "Ratings & Reviews", href: "/ratings", key: "ratings" },
  ],
  support: [
    { label: "Dispute & Cancellation", href: "/dispute/1", key: "dispute" },
    { label: "Notifications", href: "/notifications", key: "notifications" },
    { label: "Settings", href: "/settings", key: "settings" },
    { label: "Sign In", href: "/auth", key: "signIn" },
  ],
};

export function formatPKR(amount: number): string {
  return `Rs ${amount.toLocaleString("en-PK")}`;
}

export function getStatusLabel(status: TaskStatus): string {
  const labels: Record<TaskStatus, string> = {
    draft: "Draft",
    open: "Open",
    bid_received: "Bid Received",
    assigned: "Assigned",
    in_progress: "In Progress",
    completion_requested: "Completion Requested",
    completed: "Completed",
    cancelled: "Cancelled",
    disputed: "Disputed",
  };
  return labels[status] ?? status;
}

export function getStatusColor(status: TaskStatus): string {
  const colors: Record<TaskStatus, string> = {
    draft: "bg-[var(--border)] text-[var(--muted-foreground)]",
    open: "bg-green-100 text-green-700",
    bid_received: "bg-blue-100 text-blue-700",
    assigned: "bg-purple-100 text-purple-700",
    in_progress: "bg-yellow-100 text-yellow-700",
    completion_requested: "bg-orange-100 text-orange-700",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-gray-100 text-gray-600",
    disputed: "bg-red-100 text-[var(--destructive)]",
  };
  return colors[status] ?? "bg-gray-100 text-gray-600";
}

export function getVerificationBadge(status: VerificationStatus): {
  label: string;
  className: string;
} {
  const badges: Record<
    VerificationStatus,
    { label: string; className: string }
  > = {
    unverified: {
      label: "Unverified",
      className: "badge-unverified",
    },
    submitted: {
      label: "Verification Pending",
      className:
        "inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-0.5 rounded-full",
    },
    verified: {
      label: "Verified",
      className: "badge-verified",
    },
    restricted: {
      label: "Restricted",
      className: "badge-disputed",
    },
  };
  return badges[status] ?? badges.unverified;
}