"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Search, MapPin, Clock, Filter, ChevronDown, Star, Zap, ArrowRight, SlidersHorizontal, X, CheckCircle, AlertCircle, Sparkles, ShoppingBag, Truck, Wrench, Monitor, Home, Circle } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/motion";
import { TASK_CATEGORIES, getStatusLabel, getStatusColor, TaskCategory, VerificationStatus } from "@/lib/data";
type CITIES = any;
const CITIES: any = [];
type formatPkr = any;
const formatPkr: any = [];
type getVerificationColor = any;
const getVerificationColor: any = [];
type Task = any;
const Task: any = [];
type TimingWindow = any;
const TimingWindow: any = [];
import { cn } from "@/lib/utils";

// ─── Inline mock data ────────────────────────────────────────────────────────

const MOCK_TASKS: Task[] = [
  {
    id: "t1",
    title: "Grocery run from Imtiaz Karachi",
    category: "errands",
    description:
      "Need someone to pick up a list of 15–20 grocery items from Imtiaz Super Store, Gulshan-e-Iqbal. List will be shared on WhatsApp. Please bring your own bag.",
    city: "karachi",
    area: "Gulshan-e-Iqbal",
    budgetPkr: 600,
    timing: "morning",
    preferredDate: "2025-02-10",
    status: "open",
    bidCount: 3,
    isUrgent: false,
    posterId: "u1",
    createdAt: "2025-02-08T08:00:00Z",
  },
  {
    id: "t2",
    title: "Move sofa + 2 beds to new flat in DHA",
    category: "moving_delivery",
    description:
      "Shifting from a 2nd-floor apartment in DHA Phase 5 to a ground-floor flat in Phase 6. Need 2–3 strong helpers and a pickup truck if possible.",
    city: "lahore",
    area: "DHA Phase 5",
    budgetPkr: 4500,
    timing: "flexible",
    status: "bid_received",
    bidCount: 7,
    isUrgent: true,
    posterId: "u2",
    createdAt: "2025-02-07T14:30:00Z",
  },
  {
    id: "t3",
    title: "Deep clean 3-bedroom apartment before handover",
    category: "cleaning",
    description:
      "Full deep clean required — kitchen, bathrooms, all rooms, windows. Apartment is 1,400 sq ft. Cleaning supplies can be provided or tasker can bring their own.",
    city: "islamabad",
    area: "F-10 Markaz",
    budgetPkr: 3200,
    timing: "morning",
    preferredDate: "2025-02-12",
    status: "open",
    bidCount: 5,
    isUrgent: false,
    posterId: "u3",
    createdAt: "2025-02-08T10:15:00Z",
  },
  {
    id: "t4",
    title: "Fix leaking kitchen tap and replace bathroom flush",
    category: "small_repairs",
    description:
      "Kitchen tap has been dripping for a week. Bathroom flush handle is broken. Need a plumber who can handle both in one visit. Parts cost separate.",
    city: "rawalpindi",
    area: "Satellite Town",
    budgetPkr: 1200,
    timing: "afternoon",
    status: "open",
    bidCount: 2,
    isUrgent: false,
    posterId: "u4",
    createdAt: "2025-02-08T09:00:00Z",
  },
  {
    id: "t5",
    title: "Stand in NADRA queue for CNIC renewal",
    category: "queue_standing",
    description:
      "Need someone to hold my place in the NADRA queue at the Saddar office from 7 AM. I will arrive by 9 AM. You must be there by 6:45 AM.",
    city: "karachi",
    area: "Saddar",
    budgetPkr: 500,
    timing: "morning",
    preferredDate: "2025-02-11",
    status: "open",
    bidCount: 4,
    isUrgent: true,
    posterId: "u5",
    createdAt: "2025-02-08T07:30:00Z",
  },
  {
    id: "t6",
    title: "Set up new laptop and install required software",
    category: "digital_help",
    description:
      "New Dell laptop needs Windows setup, MS Office, Adobe Reader, Chrome, and a few other tools. Also need help migrating files from old laptop via USB.",
    city: "lahore",
    area: "Johar Town",
    budgetPkr: 1500,
    timing: "evening",
    status: "assigned",
    bidCount: 6,
    isUrgent: false,
    posterId: "u6",
    assignedTaskerId: "tk1",
    createdAt: "2025-02-07T16:00:00Z",
  },
  {
    id: "t7",
    title: "Cook lunch for family of 6 — desi menu",
    category: "household_assistance",
    description:
      "Need a home cook to prepare daal, sabzi, chicken karahi, and raita for 6 people. Ingredients will be provided. Must be experienced with desi cooking.",
    city: "islamabad",
    area: "G-9",
    budgetPkr: 2000,
    timing: "morning",
    preferredDate: "2025-02-09",
    status: "open",
    bidCount: 8,
    isUrgent: false,
    posterId: "u7",
    createdAt: "2025-02-08T06:45:00Z",
  },
  {
    id: "t8",
    title: "Deliver documents to SECP office Islamabad",
    category: "errands",
    description:
      "Need someone to physically deliver a sealed envelope to the SECP office in G-8 and get a receipt stamp. Must be done before 3 PM today.",
    city: "islamabad",
    area: "G-8",
    budgetPkr: 800,
    timing: "asap",
    status: "open",
    bidCount: 1,
    isUrgent: true,
    posterId: "u8",
    createdAt: "2025-02-08T11:00:00Z",
  },
  {
    id: "t9",
    title: "Paint one room — walls and ceiling",
    category: "small_repairs",
    description:
      "12x14 ft bedroom needs two coats of white paint on walls and ceiling. Paint and rollers will be provided. Need someone with experience — no drips.",
    city: "karachi",
    area: "North Nazimabad",
    budgetPkr: 3500,
    timing: "flexible",
    status: "open",
    bidCount: 3,
    isUrgent: false,
    posterId: "u9",
    createdAt: "2025-02-07T12:00:00Z",
  },
];

const TIMING_LABELS: Record<TimingWindow, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  flexible: "Flexible",
  asap: "ASAP",
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  errands: <ShoppingBag className="h-4 w-4" />,
  moving_delivery: <Truck className="h-4 w-4" />,
  cleaning: <Sparkles className="h-4 w-4" />,
  small_repairs: <Wrench className="h-4 w-4" />,
  queue_standing: <Clock className="h-4 w-4" />,
  digital_help: <Monitor className="h-4 w-4" />,
  household_assistance: <Home className="h-4 w-4" />,
  other: <Circle className="h-4 w-4" />,
};

const VERIFICATION_BADGE: Record<VerificationStatus, { label: string; color: string }> = {
  unverified: { label: "Unverified", color: "text-gray-400" },
  submitted: { label: "Pending", color: "text-yellow-500" },
  verified: { label: "Verified", color: "text-emerald-500" },
  restricted: { label: "Restricted", color: "text-red-500" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusPill({ status }: { status: Task["status"] }) {
  const label = getStatusLabel(status);
  const color = getStatusColor(status);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        color
      )}
    >
      {label}
    </span>
  );
}

function UrgentBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--brand-accent)]/10 px-2.5 py-0.5 text-xs font-semibold text-[var(--brand-accent)]">
      <Zap className="h-3 w-3" aria-hidden="true" />
      Urgent
    </span>
  );
}

function TaskCard({ task, index }: { task: Task; index: number }) {
  const categoryMeta = TASK_CATEGORIES.find((c) => c.key === task.category);
  const cityMeta = CITIES.find((c) => c.slug === task.city);

  return (
    <Reveal delay={index * 0.06}>
      <Link href={`/task/${task.id}`} className="group block h-full">
        <motion.article
          whileHover={{ y: -3, boxShadow: "0 8px 32px -8px rgba(0,0,0,0.18)" }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="relative flex h-full flex-col rounded-2xl border border-white/10 bg-[var(--card)] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_16px_-4px_rgba(0,0,0,0.12)] transition-all duration-300"
        >
          {/* Top row */}
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">
                {CATEGORY_ICONS[task.category] ?? <Circle className="h-4 w-4" />}
              </span>
              <span className="text-xs font-medium text-[var(--muted-foreground)]">
                {categoryMeta?.label ?? task.category}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {task.isUrgent && <UrgentBadge />}
              <StatusPill status={task.status} />
            </div>
          </div>

          {/* Title */}
          <h3 className="mb-2 text-base font-semibold leading-snug text-[var(--foreground)] group-hover:text-[var(--brand-primary)] transition-colors duration-200 line-clamp-2">
            {task.title}
          </h3>

          {/* Description */}
          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
            {task.description}
          </p>

          {/* Meta row */}
          <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[var(--muted-foreground)]">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {task.area}, {cityMeta?.name ?? task.city}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {TIMING_LABELS[task.timing]}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" aria-hidden="true" />
              {task.bidCount} bid{task.bidCount !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-3">
            <span className="text-lg font-bold text-[var(--foreground)]">
              {formatPkr(task.budgetPkr)}
            </span>
            <span className="flex items-center gap-1 text-xs font-medium text-[var(--brand-primary)] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              View task <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </div>
        </motion.article>
      </Link>
    </Reveal>
  );
}

// ─── Filter Panel ─────────────────────────────────────────────────────────────

interface Filters {
  city: string;
  category: string;
  timing: string;
  minBudget: string;
  maxBudget: string;
  urgentOnly: boolean;
  status: string;
}

const DEFAULT_FILTERS: Filters = {
  city: "",
  category: "",
  timing: "",
  minBudget: "",
  maxBudget: "",
  urgentOnly: false,
  status: "",
};

function FilterPanel({
  filters,
  onChange,
  onReset,
  onClose,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  onReset: () => void;
  onClose: () => void;
}) {
  const liveCities = CITIES.filter((c) => c.isLive);

  return (
    <motion.aside
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="sticky top-24 rounded-2xl border border-white/10 bg-[var(--card)] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_-8px_rgba(0,0,0,0.14)]"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[var(--foreground)]">Filters</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            aria-label="Close filters"
            className="rounded-lg p-1 text-[var(--muted-foreground)] hover:bg-white/8 hover:text-[var(--foreground)] transition-colors lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-5">
        {/* City */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">
            City
          </label>
          <div className="relative">
            <select
              value={filters.city}
              onChange={(e) => onChange({ ...filters, city: e.target.value })}
              className="w-full appearance-none rounded-xl border border-white/10 bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40"
            >
              <option value="">All cities</option>
              {liveCities.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">
            Category
          </label>
          <div className="relative">
            <select
              value={filters.category}
              onChange={(e) => onChange({ ...filters, category: e.target.value })}
              className="w-full appearance-none rounded-xl border border-white/10 bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40"
            >
              <option value="">All categories</option>
              {TASK_CATEGORIES.map((cat) => (
                <option key={cat.key} value={cat.key}>
                  {cat.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
          </div>
        </div>

        {/* Timing */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">
            Timing
          </label>
          <div className="relative">
            <select
              value={filters.timing}
              onChange={(e) => onChange({ ...filters, timing: e.target.value })}
              className="w-full appearance-none rounded-xl border border-white/10 bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40"
            >
              <option value="">Any time</option>
              {Object.entries(TIMING_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">
            Status
          </label>
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => onChange({ ...filters, status: e.target.value })}
              className="w-full appearance-none rounded-xl border border-white/10 bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40"
            >
              <option value="">All statuses</option>
              <option value="open">Open</option>
              <option value="bid_received">Bid Received</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
          </div>
        </div>

        {/* Budget range */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">
            Budget (PKR)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minBudget}
              onChange={(e) => onChange({ ...filters, minBudget: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40"
            />
            <span className="text-xs text-[var(--muted-foreground)]">–</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxBudget}
              onChange={(e) => onChange({ ...filters, maxBudget: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40"
            />
          </div>
        </div>

        {/* Urgent only */}
        <label className="flex cursor-pointer items-center gap-3">
          <div
            role="checkbox"
            aria-checked={filters.urgentOnly}
            tabIndex={0}
            onClick={() => onChange({ ...filters, urgentOnly: !filters.urgentOnly })}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onChange({ ...filters, urgentOnly: !filters.urgentOnly });
              }
            }}
            className={cn(
              "relative h-5 w-9 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]/60",
              filters.urgentOnly ? "bg-[var(--brand-accent)]" : "bg-white/15"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200",
                filters.urgentOnly ? "translate-x-4" : "translate-x-0.5"
              )}
            />
          </div>
          <span className="text-sm text-[var(--foreground)]">Urgent tasks only</span>
        </label>
      </div>
    </motion.aside>
  );
}

// ─── Hero Banner ──────────────────────────────────────────────────────────────

function HeroBanner({ totalOpen }: { totalOpen: number }) {
  return (
    <Reveal>
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--brand-primary)] via-[var(--brand-primary-dark)] to-[var(--brand-primary-darker)] px-6 py-10 md:px-12 md:py-14">
        {/* Decorative blobs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-12 left-1/3 h-48 w-48 rounded-full bg-[var(--brand-accent)]/20 blur-2xl"
        />

        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90">
              <CheckCircle className="h-3.5 w-3.5" aria-hidden="true" />
              {totalOpen} open tasks right now
            </div>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white md:text-4xl">
              Find tasks near you.
              <br />
              <span className="text-[var(--brand-accent)]">Earn on your schedule.</span>
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/75">
              Browse verified tasks posted by locals across Karachi, Lahore, Islamabad and Rawalpindi. Bid, get hired, and get paid.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
            <Link
              href="/post-task"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--brand-accent)] px-5 py-3 text-sm font-semibold text-[var(--brand-accent-fg)] shadow-lg transition-all duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              Post a Task
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/verification-status"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              Become a Tasker
            </Link>
          </div>
        </div>
      </section>
    </Reveal>
  );
}

// ─── Category Quick-Filter Strip ──────────────────────────────────────────────

function CategoryStrip({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (key: string) => void;
}) {
  const all = [{ key: "", label: "All Tasks", icon: "all" }, ...TASK_CATEGORIES];

  return (
    <Reveal>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {all.map((cat) => (
          <motion.button
            key={cat.key}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(cat.key)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]/50",
              active === cat.key
                ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
                : "border-white/10 bg-[var(--card)] text-[var(--muted-foreground)] hover:border-[var(--brand-primary)]/40 hover:text-[var(--foreground)]"
            )}
          >
            {cat.key !== "" && (
              <span aria-hidden="true">
                {CATEGORY_ICONS[cat.key] ?? <Circle className="h-3.5 w-3.5" />}
              </span>
            )}
            {cat.label}
          </motion.button>
        ))}
      </div>
    </Reveal>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────

const STATS = [
  { value: "2,400+", label: "Tasks completed" },
  { value: "840+", label: "Active taskers" },
  { value: "4.8★", label: "Avg. tasker rating" },
  { value: "4 cities", label: "Live now" },
];

function StatsBar() {
  return (
    <Reveal>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-white/8 bg-[var(--card)] px-4 py-4 text-center shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
          >
            <p className="text-xl font-extrabold text-[var(--foreground)]">{s.value}</p>
            <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">{s.label}</p>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-[var(--card)] py-16 text-center">
      <AlertCircle className="mb-4 h-10 w-10 text-[var(--muted-foreground)]" aria-hidden="true" />
      <p className="text-base font-semibold text-[var(--foreground)]">No tasks match your filters</p>
      <p className="mt-1 text-sm text-[var(--muted-foreground)]">
        Try adjusting your search or clearing filters.
      </p>
      <button
        onClick={onReset}
        className="mt-5 rounded-xl bg-[var(--brand-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]/50"
      >
        Clear all filters
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HomeTaskFeedPage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "budget_high" | "budget_low" | "bids">("newest");

  const openCount = MOCK_TASKS.filter((t) => t.status === "open" || t.status === "bid_received").length;

  const filtered = useCallback(() => {
    let tasks = [...MOCK_TASKS];

    if (search.trim()) {
      const q = search.toLowerCase();
      tasks = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.area.toLowerCase().includes(q)
      );
    }
    if (filters.city) tasks = tasks.filter((t) => t.city === filters.city);
    if (filters.category) tasks = tasks.filter((t) => t.category === filters.category);
    if (filters.timing) tasks = tasks.filter((t) => t.timing === filters.timing);
    if (filters.status) tasks = tasks.filter((t) => t.status === filters.status);
    if (filters.urgentOnly) tasks = tasks.filter((t) => t.isUrgent);
    if (filters.minBudget) tasks = tasks.filter((t) => t.budgetPkr >= Number(filters.minBudget));
    if (filters.maxBudget) tasks = tasks.filter((t) => t.budgetPkr <= Number(filters.maxBudget));

    switch (sortBy) {
      case "budget_high":
        tasks.sort((a, b) => b.budgetPkr - a.budgetPkr);
        break;
      case "budget_low":
        tasks.sort((a, b) => a.budgetPkr - b.budgetPkr);
        break;
      case "bids":
        tasks.sort((a, b) => b.bidCount - a.bidCount);
        break;
      default:
        tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return tasks;
  }, [filters, search, sortBy]);

  const results = filtered();
  const activeFilterCount = [
    filters.city,
    filters.category,
    filters.timing,
    filters.status,
    filters.minBudget,
    filters.maxBudget,
    filters.urgentOnly ? "urgent" : "",
  ].filter(Boolean).length;

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-8">
          <HeroBanner totalOpen={openCount} />
        </div>

        {/* Stats */}
        <div className="mb-8">
          <StatsBar />
        </div>

        {/* Category strip */}
        <div className="mb-6">
          <CategoryStrip
            active={filters.category}
            onSelect={(key) => setFilters((f) => ({ ...f, category: key }))}
          />
        </div>

        {/* Search + sort bar */}
        <Reveal>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]"
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Search tasks by title, area, or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[var(--card)] py-2.5 pl-10 pr-4 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40"
              />
            </div>

            {/* Sort */}
            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="appearance-none rounded-xl border border-white/10 bg-[var(--card)] py-2.5 pl-4 pr-9 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40"
              >
                <option value="newest">Newest first</option>
                <option value="budget_high">Budget: High to Low</option>
                <option value="budget_low">Budget: Low to High</option>
                <option value="bids">Most bids</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
            </div>

            {/* Filter toggle (mobile) */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters((v) => !v)}
              className={cn(
                "relative flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]/50 lg:hidden",
                showFilters
                  ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
                  : "border-white/10 bg-[var(--card)] text-[var(--foreground)]"
              )}
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--brand-accent)] text-[10px] font-bold text-[var(--brand-accent-fg)]">
                  {activeFilterCount}
                </span>
              )}
            </motion.button>
          </div>
        </Reveal>

        {/* Results count */}
        <Reveal>
          <p className="mb-5 text-sm text-[var(--muted-foreground)]">
            Showing{" "}
            <span className="font-semibold text-[var(--foreground)]">{results.length}</span>{" "}
            task{results.length !== 1 ? "s" : ""}
            {activeFilterCount > 0 && (
              <>
                {" "}with{" "}
                <button
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                  className="text-[var(--brand-primary)] underline underline-offset-2 hover:no-underline"
                >
                  {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} active
                </button>
              </>
            )}
          </p>
        </Reveal>

        {/* Main layout: sidebar + grid */}
        <div className="flex gap-6">
          {/* Sidebar filter — desktop always visible */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              onReset={() => setFilters(DEFAULT_FILTERS)}
              onClose={() => setShowFilters(false)}
            />
          </aside>

          {/* Mobile filter drawer */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 lg:hidden"
              >
                <div
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                  onClick={() => setShowFilters(false)}
                />
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="absolute bottom-0 right-0 top-0 w-72 overflow-y-auto bg-[var(--card)] p-5 shadow-2xl"
                >
                  <FilterPanel
                    filters={filters}
                    onChange={setFilters}
                    onReset={() => setFilters(DEFAULT_FILTERS)}
                    onClose={() => setShowFilters(false)}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Task grid */}
          <div className="min-w-0 flex-1">
            {results.length === 0 ? (
              <EmptyState onReset={() => { setFilters(DEFAULT_FILTERS); setSearch(""); }} />
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
              >
                {results.map((task, i) => (
                  <TaskCard key={task.id} task={task} index={i} />
                ))}
              </motion.div>
            )}

            {/* Load more CTA */}
            {results.length > 0 && (
              <Reveal>
                <div className="mt-10 flex flex-col items-center gap-3 text-center">
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Showing all {results.length} matching tasks.
                  </p>
                  <Link
                    href="/post-task"
                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--brand-primary)]/30 bg-[var(--brand-primary)]/8 px-5 py-2.5 text-sm font-semibold text-[var(--brand-primary)] transition-all duration-200 hover:bg-[var(--brand-primary)]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]/50"
                  >
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    Don't see what you need? Post your own task
                  </Link>
                </div>
              </Reveal>
            )}
          </div>
        </div>

        {/* Trust strip */}
        <Reveal>
          <section
            aria-label="Trust and safety"
            className="mt-16 rounded-3xl border border-white/8 bg-gradient-to-r from-[var(--brand-primary)]/6 via-transparent to-[var(--brand-accent)]/6 px-6 py-8 md:px-10"
          >
            <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-primary)]/12 text-[var(--brand-primary)]">
                <CheckCircle className="h-7 w-7" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-[var(--foreground)]">
                  Safe, verified, and transparent
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
                  Every tasker goes through CNIC verification before taking paid work. Contact details are redacted from chat until a task is assigned. Disputes are handled by our trust team within 24 hours.
                </p>
              </div>
              <Link
                href="/verification-status"
                className="shrink-0 rounded-xl bg-[var(--brand-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]/50"
              >
                Learn more
              </Link>
            </div>
          </section>
        </Reveal>
      </div>
    </main>
  );
}