"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, MapPin, Clock, Zap, ArrowRight, X, ShoppingBag, Truck, Sparkles, Wrench, Monitor, Home, Circle, Users, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import {
  TASK_CATEGORIES,
  getStatusLabel,
  getStatusColor,
  type TaskCategory,
  type VerificationStatus,
  formatPKR,
} from "@/lib/data";
import { cn } from "@/lib/utils";

type TimingWindow = "morning" | "afternoon" | "evening" | "flexible" | "asap";

interface Task {
  id: string;
  title: string;
  category: string;
  description: string;
  city: string;
  area: string;
  budgetPkr: number;
  timing: TimingWindow;
  preferredDate?: string;
  status: string;
  bidCount: number;
  isUrgent: boolean;
  posterId: string;
  createdAt: string;
  assignedTaskerId?: string;
}

const CITIES: { slug: string; name: string; isLive: boolean }[] = [
  { slug: "karachi", name: "Karachi", isLive: true },
  { slug: "lahore", name: "Lahore", isLive: true },
  { slug: "islamabad", name: "Islamabad", isLive: true },
  { slug: "rawalpindi", name: "Rawalpindi", isLive: true },
];

const MOCK_TASKS: Task[] = [
  {
    id: "t1",
    title: "Grocery run from Imtiaz Karachi",
    category: "errands",
    description: "Need someone to pick up a list of 15–20 grocery items from Imtiaz Super Store, Gulshan-e-Iqbal.",
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
    description: "Shifting from a 2nd-floor apartment in DHA Phase 5 to a ground-floor flat in Phase 6.",
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
    description: "Full deep clean required — kitchen, bathrooms, all rooms, windows. Apartment is 1,400 sq ft.",
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
    description: "Kitchen tap has been dripping for a week. Bathroom flush handle is broken.",
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
    description: "Need someone to hold my place in the NADRA queue from 8 AM. Token collection only.",
    city: "islamabad",
    area: "F-8 NADRA Office",
    budgetPkr: 800,
    timing: "morning",
    status: "open",
    bidCount: 1,
    isUrgent: false,
    posterId: "u5",
    createdAt: "2025-02-08T07:30:00Z",
  },
  {
    id: "t6",
    title: "Laptop slow — needs cleanup and antivirus install",
    category: "digital_help",
    description: "My laptop has become very slow. Need someone to clean it up and install a good antivirus.",
    city: "rawalpindi",
    area: "Saddar",
    budgetPkr: 1200,
    timing: "flexible",
    status: "open",
    bidCount: 0,
    isUrgent: false,
    posterId: "u6",
    createdAt: "2025-02-08T11:00:00Z",
  },
  {
    id: "t7",
    title: "Deep kitchen cleaning — 3-bedroom flat",
    category: "cleaning",
    description: "Full kitchen deep clean including stove, cabinets, and tiles.",
    city: "lahore",
    area: "Gulberg III",
    budgetPkr: 2800,
    timing: "morning",
    status: "bid_received",
    bidCount: 3,
    isUrgent: false,
    posterId: "u7",
    createdAt: "2025-02-07T09:00:00Z",
  },
  {
    id: "t8",
    title: "Plumber needed — bathroom tap leaking badly",
    category: "small_repairs",
    description: "Bathroom tap is leaking and needs urgent repair. Parts cost separate.",
    city: "karachi",
    area: "North Nazimabad",
    budgetPkr: 1500,
    timing: "asap",
    status: "open",
    bidCount: 6,
    isUrgent: true,
    posterId: "u8",
    createdAt: "2025-02-08T06:00:00Z",
  },
  {
    id: "t9",
    title: "Parcel delivery — Blue Area to G-9",
    category: "moving_delivery",
    description: "Small parcel needs to be delivered from Blue Area office to G-9 residential address.",
    city: "islamabad",
    area: "Blue Area",
    budgetPkr: 500,
    timing: "asap",
    status: "assigned",
    bidCount: 4,
    isUrgent: true,
    posterId: "u9",
    createdAt: "2025-02-08T08:45:00Z",
  },
  {
    id: "t10",
    title: "AC servicing and gas refill — split unit",
    category: "small_repairs",
    description: "1.5 ton split AC needs full service and gas refill before summer.",
    city: "karachi",
    area: "DHA Phase 5",
    budgetPkr: 3500,
    timing: "afternoon",
    status: "open",
    bidCount: 4,
    isUrgent: true,
    posterId: "u10",
    createdAt: "2025-02-08T07:00:00Z",
  },
  {
    id: "t11",
    title: "Household helper needed for weekly chores",
    category: "household_assistance",
    description: "Need a reliable helper for weekly household chores — sweeping, mopping, dishes.",
    city: "lahore",
    area: "Model Town",
    budgetPkr: 1800,
    timing: "morning",
    status: "open",
    bidCount: 2,
    isUrgent: false,
    posterId: "u11",
    createdAt: "2025-02-07T16:00:00Z",
  },
  {
    id: "t12",
    title: "Set up new router and configure WiFi",
    category: "digital_help",
    description: "New TP-Link router needs setup. Need someone who knows networking.",
    city: "karachi",
    area: "Clifton",
    budgetPkr: 900,
    timing: "evening",
    status: "open",
    bidCount: 1,
    isUrgent: false,
    posterId: "u12",
    createdAt: "2025-02-08T12:00:00Z",
  },
];

const CATEGORY_META: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  errands:             { label: "Errands",       icon: ShoppingBag, color: "text-orange-600",  bg: "bg-orange-50" },
  moving_delivery:     { label: "Moving",        icon: Truck,       color: "text-blue-600",   bg: "bg-blue-50" },
  cleaning:            { label: "Cleaning",      icon: Sparkles,    color: "text-teal-600",   bg: "bg-teal-50" },
  small_repairs:       { label: "Repairs",       icon: Wrench,      color: "text-red-600",    bg: "bg-red-50" },
  queue_standing:      { label: "Queue",         icon: Users,       color: "text-purple-600", bg: "bg-purple-50" },
  digital_help:        { label: "Digital",       icon: Monitor,     color: "text-indigo-600", bg: "bg-indigo-50" },
  household_assistance:{ label: "Household",     icon: Home,        color: "text-green-600",  bg: "bg-green-50" },
  other:               { label: "Other",         icon: Circle,      color: "text-gray-600",   bg: "bg-gray-50" },
};

const TIMING_LABELS: Record<string, string> = {
  asap: "ASAP",
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  flexible: "Flexible",
};

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "open", label: "Open" },
  { value: "bid_received", label: "Bid Received" },
  { value: "assigned", label: "Assigned" },
];

const PAGE_SIZE = 6;

// ─── Task Card ────────────────────────────────────────────────────────────────

function TaskCard({ task }: { task: Task }) {
  const meta = CATEGORY_META[task.category] ?? CATEGORY_META["other"];
  const Icon = meta.icon;
  const statusLabel = getStatusLabel(task.status as Parameters<typeof getStatusLabel>[0]);
  const statusColor = getStatusColor(task.status as Parameters<typeof getStatusColor>[0]);
  const cityName = CITIES.find((c) => c.slug === task.city)?.name ?? task.city;

  return (
    <motion.div
      variants={fadeInUp}
      className={cn(
        "bg-white rounded-2xl overflow-hidden",
        "border border-[var(--border)]",
        "shadow-[0_2px_8px_rgba(26,26,46,0.06),0_0_0_0_transparent]",
        "hover:shadow-[0_8px_24px_rgba(27,108,168,0.12)] hover:-translate-y-0.5",
        "transition-all duration-300 flex flex-col",
        "border-l-4",
        task.isUrgent ? "border-l-[var(--accent)]" : "border-l-[var(--primary)]"
      )}
    >
      {/* Card header */}
      <div className="p-4 pb-3 flex items-start gap-3">
        {/* Category icon */}
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", meta.bg)}>
          <Icon className={cn("w-5 h-5", meta.color)} aria-hidden="true" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-[var(--foreground)] text-sm leading-snug line-clamp-2 flex-1">
              {task.title}
            </h3>
            {task.isUrgent && (
              <span className="flex-shrink-0 inline-flex items-center gap-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                <Zap className="w-2.5 h-2.5" aria-hidden="true" />
                Urgent
              </span>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-[var(--muted-foreground)] text-xs">
            <MapPin className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
            <span className="truncate">{task.area}, {cityName}</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-[var(--border)]" />

      {/* Card body */}
      <div className="p-4 pt-3 flex-1 flex flex-col gap-3">
        {/* Budget + bids row */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wide font-medium mb-0.5">Budget</p>
            <p className="text-lg font-bold text-[var(--accent)] leading-none">
              {formatPKR(task.budgetPkr)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wide font-medium mb-0.5">Bids</p>
            <span className={cn(
              "inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full",
              task.bidCount > 0
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--foreground)]/20 text-[var(--foreground)]"
            )}>
              <Users className="w-3 h-3" aria-hidden="true" />
              {task.bidCount} {task.bidCount === 1 ? "bid" : "bids"}
            </span>
          </div>
        </div>

        {/* Timing + status row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 bg-[var(--background)] text-[var(--muted-foreground)] text-xs px-2 py-1 rounded-lg border border-[var(--border)]">
            <Clock className="w-3 h-3" aria-hidden="true" />
            {TIMING_LABELS[task.timing] ?? task.timing}
          </span>
          <span className={cn("text-xs font-semibold px-2 py-1 rounded-lg", statusColor)}>
            {statusLabel}
          </span>
          <span className={cn(
            "text-xs px-2 py-1 rounded-lg border font-medium",
            meta.bg, meta.color, "border-current/20"
          )}>
            {meta.label}
          </span>
        </div>

        {/* CTA */}
        <Link
          href={`/task/${task.id}`}
          className={cn(
            "mt-auto flex items-center justify-center gap-1.5",
            "bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white",
            "text-sm font-semibold py-2.5 px-4 rounded-xl",
            "transition-all duration-200 group"
          )}
        >
          View Task
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HomeTaskFeedPage() {
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const activeCityName = CITIES.find((c) => c.slug === selectedCity)?.name;

  const filtered = MOCK_TASKS.filter((task) => {
    if (selectedCity !== "all" && task.city !== selectedCity) return false;
    if (selectedCategory !== "all" && task.category !== selectedCategory) return false;
    if (selectedStatus !== "all" && task.status !== selectedStatus) return false;
    if (urgentOnly && !task.isUrgent) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (
        !task.title.toLowerCase().includes(q) &&
        !task.area.toLowerCase().includes(q) &&
        !task.description.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleCityChange = useCallback((slug: string) => {
    setSelectedCity(slug);
    setPage(1);
  }, []);

  const handleCategoryChange = useCallback((cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((s: string) => {
    setSelectedStatus(s);
    setPage(1);
  }, []);

  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q);
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCity("all");
    setSelectedCategory("all");
    setSelectedStatus("all");
    setSearchQuery("");
    setUrgentOnly(false);
    setPage(1);
  }, []);

  const hasActiveFilters =
    selectedCity !== "all" ||
    selectedCategory !== "all" ||
    selectedStatus !== "all" ||
    urgentOnly ||
    searchQuery.trim() !== "";

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* ── HERO BANNER ── */}
      <section className="relative overflow-hidden" style={{background:'linear-gradient(135deg,#0D4F8C 0%,#1B6CA8 55%,#1a5f96 100%)'}}>
        {/* hero content */}
        <div className="hidden">PLACEHOLDER_REPLACED</div>
      </section>
      <section className="relative overflow-hidden_REMOVEDhiddenhidden bg-gradient-to-br from-[#1B6CA8] via-[#1560a0] to-[#0f3f63]">
        {/* Decorative pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
          aria-hidden="true"
        />
        {/* Glow orbs */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #F5A623 0%, transparent 70%)" }}
          aria-hidden="true"
        />

        <div className="container relative z-10 py-10 md:py-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              {/* Urdu + English heading */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🇵🇰</span>
                <span className="text-white/60 text-sm font-medium tracking-wide uppercase">Asan Kaam</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-1">
                Kaam Dhundein
              </h1>
              <p
                className="text-white/70 text-lg mb-4"
                style={{ fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif", direction: "rtl" }}
              >
                اپنے شہر میں کام تلاش کریں
              </p>

              {/* Active city pill */}
              {activeCityName && (
                <span className="inline-flex items-center gap-1.5 bg-[var(--accent)] text-white text-sm font-semibold px-3 py-1 rounded-full">
                  <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                  {activeCityName}
                </span>
              )}
            </div>

            {/* Search bar */}
            <div className="w-full md:max-w-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => handleSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* City chips */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => handleCityChange("all")}
              className={cn(
                "flex-shrink-0 flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border transition-all duration-200",
                selectedCity === "all"
                  ? "bg-white text-[var(--primary)] border-white"
                  : "bg-white/10 text-white/80 border-white/20 hover:bg-white/20"
              )}
            >
              🇵🇰 All Cities
            </button>
            {CITIES.map((city) => (
              <button
                key={city.slug}
                onClick={() => handleCityChange(city.slug)}
                className={cn(
                  "flex-shrink-0 text-sm font-medium px-3 py-1.5 rounded-full border transition-all duration-200",
                  selectedCity === city.slug
                    ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                    : "bg-white/10 text-white/80 border-white/20 hover:bg-white/20"
                )}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <section className="sticky top-14 md:top-16 z-30 bg-white border-b border-[var(--border)] shadow-sm">
        <div className="container">
          {/* Mobile: scrollable chips */}
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide lg:hidden">
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={cn(
                "flex-shrink-0 flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full border transition-all",
                showFilters
                  ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                  : "bg-[var(--background)] text-[var(--foreground)] border-[var(--border)]"
              )}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-[var(--accent)] flex-shrink-0" />
              )}
            </button>

            {/* Category chips */}
            <button
              onClick={() => handleCategoryChange("all")}
              className={cn(
                "flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all",
                selectedCategory === "all"
                  ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                  : "bg-[var(--background)] text-[var(--muted-foreground)] border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
              )}
            >
              All Categories
            </button>
            {Object.entries(CATEGORY_META).map(([key, meta]) => (
              <button
                key={key}
                onClick={() => handleCategoryChange(key)}
                className={cn(
                  "flex-shrink-0 flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all",
                  selectedCategory === key
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "bg-[var(--background)] text-[var(--muted-foreground)] border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                )}
              >
                {meta.label}
              </button>
            ))}

            {/* Urgent toggle */}
            <button
              onClick={() => { setUrgentOnly((v) => !v); setPage(1); }}
              className={cn(
                "flex-shrink-0 flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all",
                urgentOnly
                  ? "bg-amber-500 text-white border-amber-500"
                  : "bg-[var(--background)] text-[var(--muted-foreground)] border-[var(--border)] hover:border-amber-400 hover:text-amber-600"
              )}
            >
              <Zap className="w-3 h-3" aria-hidden="true" />
              Urgent
            </button>
          </div>

          {/* Desktop: inline filter row */}
          <div className="hidden lg:flex items-center gap-3 py-3">
            {/* Category */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="appearance-none bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-sm font-medium rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
              >
                <option value="all">All Categories</option>
                {Object.entries(CATEGORY_META).map(([key, meta]) => (
                  <option key={key} value={key}>{meta.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] pointer-events-none" aria-hidden="true" />
            </div>

            {/* Status */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="appearance-none bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-sm font-medium rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
              >
                {STATUS_FILTER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] pointer-events-none" aria-hidden="true" />
            </div>

            {/* Urgent toggle */}
            <button
              onClick={() => { setUrgentOnly((v) => !v); setPage(1); }}
              className={cn(
                "flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl border transition-all",
                urgentOnly
                  ? "bg-amber-500 text-white border-amber-500"
                  : "bg-[var(--background)] text-[var(--muted-foreground)] border-[var(--border)] hover:border-amber-400 hover:text-amber-600"
              )}
            >
              <Zap className="w-4 h-4" aria-hidden="true" />
              Urgent Only
            </button>

            {/* Clear */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-sm font-medium text-[var(--destructive)] hover:underline ml-auto"
              >
                <X className="w-4 h-4" aria-hidden="true" />
                Clear filters
              </button>
            )}

            {/* Results count */}
            <span className="ml-auto text-sm text-[var(--muted-foreground)]">
              {filtered.length} task{filtered.length !== 1 ? "s" : ""} found
            </span>
          </div>
        </div>

        {/* Mobile expanded filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-[var(--border)] lg:hidden"
            >
              <div className="container py-4 grid grid-cols-2 gap-3">
                {/* Status */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--muted-foreground)] mb-1.5 uppercase tracking-wide">Status</label>
                  <div className="relative">
                    <select
                      value={selectedStatus}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="w-full appearance-none bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-sm rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    >
                      {STATUS_FILTER_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] pointer-events-none" aria-hidden="true" />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--muted-foreground)] mb-1.5 uppercase tracking-wide">Category</label>
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full appearance-none bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-sm rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    >
                      <option value="all">All Categories</option>
                      {Object.entries(CATEGORY_META).map(([key, meta]) => (
                        <option key={key} value={key}>{meta.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] pointer-events-none" aria-hidden="true" />
                  </div>
                </div>

                {/* Clear */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="col-span-2 flex items-center justify-center gap-1.5 text-sm font-medium text-[var(--destructive)] border border-[var(--destructive)]/30 rounded-xl py-2 hover:bg-red-50 transition-colors"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                    Clear all filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── MAIN CONTENT ── */}
      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── DESKTOP SIDEBAR ── */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-36 space-y-6">
              {/* City filter */}
              <div className="bg-white rounded-2xl border border-[var(--border)] p-4 shadow-sm">
                <h3 className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">
                  🇵🇰 City
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => handleCityChange("all")}
                    className={cn(
                      "w-full text-left text-sm px-3 py-2 rounded-xl font-medium transition-all",
                      selectedCity === "all"
                        ? "bg-[var(--primary)] text-white"
                        : "text-[var(--foreground)] hover:bg-[var(--background)]"
                    )}
                  >
                    All Cities
                  </button>
                  {CITIES.map((city) => (
                    <button
                      key={city.slug}
                      onClick={() => handleCityChange(city.slug)}
                      className={cn(
                        "w-full text-left text-sm px-3 py-2 rounded-xl font-medium transition-all flex items-center justify-between",
                        selectedCity === city.slug
                          ? "bg-[var(--primary)] text-white"
                          : "text-[var(--foreground)] hover:bg-[var(--background)]"
                      )}
                    >
                      <span>{city.name}</span>
                      <span className={cn(
                        "text-xs px-1.5 py-0.5 rounded-full",
                        selectedCity === city.slug ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-700"
                      )}>
                        Live
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category filter */}
              <div className="bg-white rounded-2xl border border-[var(--border)] p-4 shadow-sm">
                <h3 className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">
                  Category
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => handleCategoryChange("all")}
                    className={cn(
                      "w-full text-left text-sm px-3 py-2 rounded-xl font-medium transition-all",
                      selectedCategory === "all"
                        ? "bg-[var(--primary)] text-white"
                        : "text-[var(--foreground)] hover:bg-[var(--background)]"
                    )}
                  >
                    All Categories
                  </button>
                  {Object.entries(CATEGORY_META).map(([key, meta]) => {
                    const Icon = meta.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => handleCategoryChange(key)}
                        className={cn(
                          "w-full text-left text-sm px-3 py-2 rounded-xl font-medium transition-all flex items-center gap-2",
                          selectedCategory === key
                            ? "bg-[var(--primary)] text-white"
                            : "text-[var(--foreground)] hover:bg-[var(--background)]"
                        )}
                      >
                        <Icon className={cn("w-4 h-4", selectedCategory === key ? "text-white" : meta.color)} aria-hidden="true" />
                        {meta.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick stats */}
              <div className="bg-gradient-to-br from-[var(--primary)] to-[#0f3f63] rounded-2xl p-4 text-white">
                <p className="text-xs font-bold uppercase tracking-wider text-white/60 mb-3">Live Stats</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Open tasks</span>
                    <span className="font-bold">{MOCK_TASKS.filter((t) => t.status === "open").length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Urgent</span>
                    <span className="font-bold text-[var(--accent)]">{MOCK_TASKS.filter((t) => t.isUrgent).length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Cities active</span>
                    <span className="font-bold">{CITIES.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* ── TASK GRID ── */}
          <div className="flex-1 min-w-0">
            {/* Results header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">
                  <span className="font-bold text-[var(--foreground)] text-base">{filtered.length}</span>
                  {" "}task{filtered.length !== 1 ? "s" : ""} found
                  {activeCityName && <span> in <span className="font-semibold text-[var(--primary)]">{activeCityName}</span></span>}
                </p>
              </div>
              <Link
                href="/post-task"
                className="hidden sm:flex items-center gap-1.5 bg-[var(--accent)] hover:bg-amber-500 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
              >
                + Post a Task
              </Link>
            </div>

            {paginated.length > 0 ? (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
              >
                <AnimatePresence mode="popLayout">
                  {paginated.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              /* ── EMPTY STATE ── */
              <Reveal>
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 rounded-full bg-[var(--border)] flex items-center justify-center mb-5">
                    <Search className="w-8 h-8 text-[var(--muted-foreground)]" aria-hidden="true" />
                  </div>
                  <p
                    className="text-2xl font-bold text-[var(--foreground)] mb-1"
                    style={{ fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif", direction: "rtl" }}
                  >
                    کوئی کام نہیں ملا
                  </p>
                  <p className="text-[var(--muted-foreground)] text-sm mb-6">
                    No tasks found matching your filters.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="btn-primary text-sm"
                  >
                    Clear Filters
                  </button>
                </div>
              </Reveal>
            )}

            {/* ── PAGINATION ── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--foreground)] disabled:opacity-40 hover:bg-[var(--background)] transition-all"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      "w-9 h-9 rounded-xl text-sm font-semibold transition-all",
                      p === page
                        ? "bg-[var(--primary)] text-white"
                        : "border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--background)]"
                    )}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--foreground)] disabled:opacity-40 hover:bg-[var(--background)] transition-all"
                >
                  Next
                </button>
              </div>
            )}

            {/* Mobile post task CTA */}
            <div className="sm:hidden mt-8">
              <Link
                href="/post-task"
                className="flex items-center justify-center gap-2 w-full bg-[var(--accent)] hover:bg-amber-500 text-white font-bold py-3 rounded-2xl transition-all shadow-md"
              >
                <span>+ Post a Task</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
