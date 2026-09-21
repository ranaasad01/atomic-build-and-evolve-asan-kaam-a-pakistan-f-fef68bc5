"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Plus, Filter, ChevronDown, MoreVertical, Eye, X, Zap, MapPin, Clock, Tag, Users, CheckCircle, AlertCircle, FileText, Loader, Star, TrendingUp, ClipboardList } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import { getStatusLabel, getStatusColor, TaskStatus, TaskCategory } from "@/lib/data";
type formatPkr = any;
const formatPkr: any = [];
type TimingWindow = any;
const TimingWindow: any = [];
import { staggerContainer, fadeInUp } from "@/lib/motion";

// ─── Mock Data ────────────────────────────────────────────────────────────────

interface MockTask {
  id: string;
  title: string;
  category: TaskCategory;
  area: string;
  city: string;
  budgetPkr: number;
  timing: TimingWindow;
  status: TaskStatus;
  bidCount: number;
  isUrgent: boolean;
  createdAt: string;
  preferredDate?: string;
}

const MOCK_TASKS: MockTask[] = [
  {
    id: "t1",
    title: "Grocery shopping from Imtiaz Store, Gulshan",
    category: "errands",
    area: "Gulshan-e-Iqbal",
    city: "Karachi",
    budgetPkr: 800,
    timing: "morning",
    status: "bid_received",
    bidCount: 4,
    isUrgent: true,
    createdAt: "2024-06-10T08:30:00Z",
    preferredDate: "2024-06-12",
  },
  {
    id: "t2",
    title: "Move 3 boxes from DHA Phase 5 to Clifton",
    category: "moving_delivery",
    area: "DHA Phase 5",
    city: "Karachi",
    budgetPkr: 2500,
    timing: "afternoon",
    status: "assigned",
    bidCount: 7,
    isUrgent: false,
    createdAt: "2024-06-09T14:00:00Z",
    preferredDate: "2024-06-13",
  },
  {
    id: "t3",
    title: "Deep clean 2-bedroom apartment before move-in",
    category: "cleaning",
    area: "Bahria Town",
    city: "Lahore",
    budgetPkr: 3500,
    timing: "flexible",
    status: "in_progress",
    bidCount: 3,
    isUrgent: false,
    createdAt: "2024-06-08T10:15:00Z",
  },
  {
    id: "t4",
    title: "Fix leaking kitchen tap and replace washers",
    category: "small_repairs",
    area: "F-7",
    city: "Islamabad",
    budgetPkr: 1200,
    timing: "asap",
    status: "completed",
    bidCount: 5,
    isUrgent: true,
    createdAt: "2024-06-05T09:00:00Z",
    preferredDate: "2024-06-06",
  },
  {
    id: "t5",
    title: "Stand in queue at NADRA office for token",
    category: "queue_standing",
    area: "Saddar",
    city: "Rawalpindi",
    budgetPkr: 600,
    timing: "morning",
    status: "completed",
    bidCount: 2,
    isUrgent: false,
    createdAt: "2024-06-04T07:45:00Z",
    preferredDate: "2024-06-05",
  },
  {
    id: "t6",
    title: "Help set up new laptop and install software",
    category: "digital_help",
    area: "Johar Town",
    city: "Lahore",
    budgetPkr: 1500,
    timing: "evening",
    status: "open",
    bidCount: 0,
    isUrgent: false,
    createdAt: "2024-06-11T16:00:00Z",
  },
  {
    id: "t7",
    title: "Ironing and folding laundry — 2 bags",
    category: "household_assistance",
    area: "Gulberg III",
    city: "Lahore",
    budgetPkr: 700,
    timing: "afternoon",
    status: "disputed",
    bidCount: 1,
    isUrgent: false,
    createdAt: "2024-06-03T11:30:00Z",
  },
  {
    id: "t8",
    title: "Pick up prescription from pharmacy and deliver home",
    category: "errands",
    area: "G-11",
    city: "Islamabad",
    budgetPkr: 400,
    timing: "asap",
    status: "cancelled",
    bidCount: 2,
    isUrgent: true,
    createdAt: "2024-06-02T13:00:00Z",
  },
  {
    id: "t9",
    title: "Assemble IKEA-style bookshelf (6 shelves)",
    category: "small_repairs",
    area: "DHA Phase 2",
    city: "Islamabad",
    budgetPkr: 1800,
    timing: "flexible",
    status: "open",
    bidCount: 1,
    isUrgent: false,
    createdAt: "2024-06-11T09:00:00Z",
  },
  {
    id: "t10",
    title: "Deliver birthday cake from bakery to venue",
    category: "moving_delivery",
    area: "Clifton",
    city: "Karachi",
    budgetPkr: 500,
    timing: "evening",
    status: "completion_requested",
    bidCount: 3,
    isUrgent: true,
    createdAt: "2024-06-10T17:00:00Z",
    preferredDate: "2024-06-11",
  },
];

// ─── Filter Tabs ──────────────────────────────────────────────────────────────

type FilterKey = "all" | TaskStatus;

const FILTER_TABS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All Tasks" },
  { key: "open", label: "Open" },
  { key: "bid_received", label: "Bids Received" },
  { key: "assigned", label: "Assigned" },
  { key: "in_progress", label: "In Progress" },
  { key: "completion_requested", label: "Completion Req." },
  { key: "completed", label: "Completed" },
  { key: "disputed", label: "Disputed" },
  { key: "cancelled", label: "Cancelled" },
];

// ─── Category Labels ──────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<TaskCategory, string> = {
  errands: "Errands & Shopping",
  moving_delivery: "Moving & Delivery",
  cleaning: "Cleaning",
  small_repairs: "Small Repairs",
  queue_standing: "Queue Standing",
  digital_help: "Digital Help",
  household_assistance: "Household Help",
  other: "Other",
};

const TIMING_LABELS: Record<TimingWindow, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  flexible: "Flexible",
  asap: "ASAP",
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  value,
  label,
  accent,
}: {
  icon: React.ElementType;
  value: number | string;
  label: string;
  accent?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "rounded-2xl border p-5 flex items-center gap-4",
        "border-[hsl(var(--border))] bg-[hsl(var(--card))]",
        "shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)]"
      )}
    >
      <div
        className={cn(
          "h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0",
          accent
            ? "bg-[var(--accent)]/15"
            : "bg-[hsl(var(--muted))]/60"
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5",
            accent ? "text-[var(--accent)]" : "text-[hsl(var(--muted-foreground))]"
          )}
          aria-hidden="true"
        />
      </div>
      <div>
        <div className="text-2xl font-bold text-[hsl(var(--foreground))] leading-none">
          {value}
        </div>
        <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{label}</div>
      </div>
    </motion.div>
  );
}

// ─── Status Chip ──────────────────────────────────────────────────────────────

function StatusChip({ status }: { status: TaskStatus }) {
  const color = getStatusColor(status);
  const label = getStatusLabel(status);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border",
        color
      )}
    >
      {label}
    </span>
  );
}

// ─── Quick Action Menu ────────────────────────────────────────────────────────

function QuickActionMenu({
  task,
  onClose,
}: {
  task: MockTask;
  onClose: () => void;
}) {
  const canCancel =
    task.status === "open" ||
    task.status === "bid_received" ||
    task.status === "draft";
  const canBoost = task.status === "open" || task.status === "bid_received";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -8 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-8 z-30 w-48 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.18)] overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <Link
        href={`/task/${task.id}`}
        onClick={onClose}
        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50 transition-colors"
      >
        <Eye className="h-4 w-4 text-[hsl(var(--muted-foreground))]" aria-hidden="true" />
        View Bids
      </Link>
      {canBoost && (
        <button
          onClick={onClose}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50 transition-colors"
        >
          <Zap className="h-4 w-4 text-amber-500" aria-hidden="true" />
          Boost Task
        </button>
      )}
      {canCancel && (
        <button
          onClick={onClose}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        >
          <X className="h-4 w-4" aria-hidden="true" />
          Cancel Task
        </button>
      )}
    </motion.div>
  );
}

// ─── Task Summary Card ────────────────────────────────────────────────────────

function TaskSummaryCard({ task }: { task: MockTask }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const formattedDate = new Date(task.createdAt).toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <motion.div
      whileHover={{ y: -1 }}
      transition={{ duration: 0.18 }}
      className="relative rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.07)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_8px_24px_-8px_rgba(0,0,0,0.12)] transition-shadow"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {task.isUrgent && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 px-2 py-0.5 text-xs font-semibold">
                <Zap className="h-3 w-3" aria-hidden="true" />
                Urgent
              </span>
            )}
            <StatusChip status={task.status} />
          </div>
          <Link href={`/task/${task.id}`}>
            <h3 className="mt-2 text-base font-semibold text-[hsl(var(--foreground))] leading-snug hover:text-[var(--accent)] transition-colors line-clamp-2">
              {task.title}
            </h3>
          </Link>
        </div>

        {/* Action menu */}
        <div className="relative flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
            aria-label="Task actions"
            className="h-8 w-8 rounded-lg flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]/60 hover:text-[hsl(var(--foreground))] transition-colors"
          >
            <MoreVertical className="h-4 w-4" aria-hidden="true" />
          </button>
          {menuOpen && (
            <QuickActionMenu task={task} onClose={() => setMenuOpen(false)} />
          )}
        </div>
      </div>

      {/* Meta row */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[hsl(var(--muted-foreground))]">
        <span className="flex items-center gap-1">
          <Tag className="h-3.5 w-3.5" aria-hidden="true" />
          {CATEGORY_LABELS[task.category]}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {task.area}, {task.city}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {TIMING_LABELS[task.timing]}
        </span>
      </div>

      {/* Bottom row */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-[var(--accent)]">
            {formatPkr(task.budgetPkr)}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-[hsl(var(--muted))]/60 px-2.5 py-0.5 text-xs font-medium text-[hsl(var(--muted-foreground))]">
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            {task.bidCount} {task.bidCount === 1 ? "bid" : "bids"}
          </span>
        </div>
        <span className="text-xs text-[hsl(var(--muted-foreground))]">
          Posted {formattedDate}
        </span>
      </div>

      {/* View bids CTA for bid_received */}
      {task.status === "bid_received" && task.bidCount > 0 && (
        <Link
          href={`/task/${task.id}`}
          className="mt-3 flex items-center justify-center gap-1.5 w-full rounded-xl bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20 text-[var(--accent)] text-sm font-semibold py-2 transition-colors"
        >
          <Eye className="h-4 w-4" aria-hidden="true" />
          Review {task.bidCount} Bids
        </Link>
      )}

      {/* Completion requested banner */}
      {task.status === "completion_requested" && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 px-3 py-2 text-xs text-blue-700 dark:text-blue-300 font-medium">
          <CheckCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          Tasker has marked this complete. Please confirm or raise a dispute.
        </div>
      )}

      {/* Disputed banner */}
      {task.status === "disputed" && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 px-3 py-2 text-xs text-red-700 dark:text-red-300 font-medium">
          <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          Dispute under review by Asan Kaam support.
        </div>
      )}
    </motion.div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ filter }: { filter: FilterKey }) {
  const isAll = filter === "all";
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="h-20 w-20 rounded-2xl bg-[hsl(var(--muted))]/50 flex items-center justify-center mb-5">
        <ClipboardList
          className="h-10 w-10 text-[hsl(var(--muted-foreground))]/50"
          aria-hidden="true"
        />
      </div>
      <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">
        {isAll ? "No tasks yet" : `No ${filter.replace("_", " ")} tasks`}
      </h3>
      <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))] max-w-xs">
        {isAll
          ? "Post your first task and get competitive bids from verified taskers near you."
          : "You have no tasks in this status right now."}
      </p>
      {isAll && (
        <Link
          href="/post-task"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-black hover:opacity-90 transition-opacity shadow-[0_2px_12px_rgba(0,0,0,0.12)]"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Post Your First Task
        </Link>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MyTasksPage() {
  const t = useTranslations();
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [sortBy, setSortBy] = useState<"newest" | "budget" | "bids">("newest");
  const [sortOpen, setSortOpen] = useState(false);

  // Derived stats
  const stats = useMemo(() => {
    const total = MOCK_TASKS.length;
    const activeBids = MOCK_TASKS.reduce((sum, t) => sum + t.bidCount, 0);
    const completed = MOCK_TASKS.filter((t) => t.status === "completed").length;
    const disputed = MOCK_TASKS.filter((t) => t.status === "disputed").length;
    return { total, activeBids, completed, disputed };
  }, []);

  // Filtered + sorted tasks
  const filteredTasks = useMemo(() => {
    let tasks =
      activeFilter === "all"
        ? MOCK_TASKS
        : MOCK_TASKS.filter((t) => t.status === activeFilter);

    if (sortBy === "newest") {
      tasks = [...tasks].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortBy === "budget") {
      tasks = [...tasks].sort((a, b) => b.budgetPkr - a.budgetPkr);
    } else if (sortBy === "bids") {
      tasks = [...tasks].sort((a, b) => b.bidCount - a.bidCount);
    }

    return tasks;
  }, [activeFilter, sortBy]);

  const sortLabels: Record<string, string> = {
    newest: "Newest First",
    budget: "Highest Budget",
    bids: "Most Bids",
  };

  return (
    <main className="min-h-screen bg-[hsl(var(--background))]">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

        {/* ── Page Header ── */}
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[hsl(var(--foreground))]">
                {t("myTasks.heading")}
              </h1>
              <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                {t("myTasks.subheading")}
              </p>
            </div>
            <Link
              href="/post-task"
              className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-black hover:opacity-90 transition-opacity shadow-[0_2px_12px_rgba(0,0,0,0.12)]"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              {t("myTasks.postNewTask")}
            </Link>
          </div>
        </Reveal>

        {/* ── Stats Row ── */}
        <Reveal delay={0.05}>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            <motion.div variants={fadeInUp}>
              <StatCard
                icon={FileText}
                value={stats.total}
                label={t("myTasks.stats.total")}
                accent
              />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <StatCard
                icon={TrendingUp}
                value={stats.activeBids}
                label={t("myTasks.stats.activeBids")}
              />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <StatCard
                icon={CheckCircle}
                value={stats.completed}
                label={t("myTasks.stats.completed")}
              />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <StatCard
                icon={AlertCircle}
                value={stats.disputed}
                label={t("myTasks.stats.disputed")}
              />
            </motion.div>
          </motion.div>
        </Reveal>

        {/* ── Filter Bar ── */}
        <Reveal delay={0.08}>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Status chips */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {FILTER_TABS.map((tab) => {
                const count =
                  tab.key === "all"
                    ? MOCK_TASKS.length
                    : MOCK_TASKS.filter((t) => t.status === tab.key).length;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveFilter(tab.key)}
                    className={cn(
                      "flex-shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all duration-200",
                      activeFilter === tab.key
                        ? "bg-[var(--accent)] text-black border-[var(--accent)] shadow-sm"
                        : "bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))] hover:border-[var(--accent)]/50 hover:text-[hsl(var(--foreground))]"
                    )}
                  >
                    {tab.label}
                    {count > 0 && (
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none",
                          activeFilter === tab.key
                            ? "bg-black/15 text-black"
                            : "bg-[hsl(var(--muted))]/70 text-[hsl(var(--muted-foreground))]"
                        )}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Sort dropdown */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setSortOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3.5 py-2 text-xs font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50 transition-colors"
              >
                <Filter className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" aria-hidden="true" />
                {sortLabels[sortBy]}
                <ChevronDown className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" aria-hidden="true" />
              </button>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-10 z-20 w-44 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.18)] overflow-hidden"
                >
                  {(["newest", "budget", "bids"] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setSortBy(opt);
                        setSortOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2.5 text-sm transition-colors",
                        sortBy === opt
                          ? "text-[var(--accent)] font-semibold bg-[var(--accent)]/8"
                          : "text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50"
                      )}
                    >
                      {sortLabels[opt]}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </Reveal>

        {/* ── Task List ── */}
        <Reveal delay={0.1}>
          {filteredTasks.length === 0 ? (
            <EmptyState filter={activeFilter} />
          ) : (
            <motion.div
              key={activeFilter + sortBy}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {filteredTasks.map((task, i) => (
                <motion.div key={task.id} variants={fadeInUp} custom={i}>
                  <TaskSummaryCard task={task} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </Reveal>

        {/* ── Bottom CTA ── */}
        {filteredTasks.length > 0 && (
          <Reveal delay={0.12}>
            <div className="mt-10 rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card))]/50 p-8 text-center">
              <Star
                className="mx-auto h-8 w-8 text-[var(--accent)] mb-3"
                aria-hidden="true"
              />
              <h3 className="text-base font-semibold text-[hsl(var(--foreground))]">
                {t("myTasks.cta.heading")}
              </h3>
              <p className="mt-1.5 text-sm text-[hsl(var(--muted-foreground))] max-w-sm mx-auto">
                {t("myTasks.cta.body")}
              </p>
              <Link
                href="/post-task"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-black hover:opacity-90 transition-opacity"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                {t("myTasks.cta.button")}
              </Link>
            </div>
          </Reveal>
        )}
      </div>
    </main>
  );
}