"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Plus, Eye, X, Zap, MapPin, Users, CheckCircle, AlertCircle, FileText, Loader, ClipboardList, TrendingUp, Star, ChevronRight } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import { getStatusLabel, getStatusColor, formatPKR, TaskStatus, TaskCategory } from "@/lib/data";
import { staggerContainer, fadeInUp } from "@/lib/motion";

const formatPkr = (amount: number) => formatPKR(amount ?? 0);

type TimingWindow = string;

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
    category: "Errands & Shopping",
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
    category: "Moving & Delivery",
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
    category: "Cleaning",
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
    category: "Small Repairs & Maintenance",
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
    category: "Queue & Appointment Standing",
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
    category: "Digital Help",
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
    category: "Household Assistance",
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
    category: "Errands & Shopping",
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
    category: "Small Repairs & Maintenance",
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
    category: "Moving & Delivery",
    area: "Clifton",
    city: "Karachi",
    budgetPkr: 500,
    timing: "afternoon",
    status: "completion_requested",
    bidCount: 3,
    isUrgent: true,
    createdAt: "2024-06-11T11:00:00Z",
    preferredDate: "2024-06-12",
  },
];

// ─── Status filter tabs ───────────────────────────────────────────────────────

const STATUS_FILTERS: Array<{ key: TaskStatus | "all" }> = [
  { key: "all" },
  { key: "open" },
  { key: "bid_received" },
  { key: "assigned" },
  { key: "in_progress" },
  { key: "completion_requested" },
  { key: "completed" },
  { key: "cancelled" },
  { key: "disputed" },
];

// ─── Left border color by status ─────────────────────────────────────────────

function getStatusBorderColor(status: TaskStatus): string {
  switch (status) {
    case "open": return "border-l-[var(--primary)]";
    case "bid_received": return "border-l-[var(--accent)]";
    case "assigned": return "border-l-blue-500";
    case "in_progress": return "border-l-indigo-500";
    case "completion_requested": return "border-l-purple-500";
    case "completed": return "border-l-emerald-500";
    case "cancelled": return "border-l-[var(--destructive)]";
    case "disputed": return "border-l-red-700";
    case "draft": return "border-l-gray-400";
    default: return "border-l-gray-300";
  }
}

// ─── Status icon ─────────────────────────────────────────────────────────────

function StatusIcon({ status }: { status: TaskStatus }) {
  switch (status) {
    case "completed": return <CheckCircle className="w-3.5 h-3.5" />;
    case "cancelled": return <X className="w-3.5 h-3.5" />;
    case "disputed": return <AlertCircle className="w-3.5 h-3.5" />;
    case "in_progress": return <Loader className="w-3.5 h-3.5 animate-spin" />;
    case "bid_received": return <Users className="w-3.5 h-3.5" />;
    case "assigned": return <CheckCircle className="w-3.5 h-3.5" />;
    case "completion_requested": return <Star className="w-3.5 h-3.5" />;
    default: return <FileText className="w-3.5 h-3.5" />;
  }
}

// ─── Stat pill ────────────────────────────────────────────────────────────────

function StatPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={cn("flex flex-col items-center px-4 py-2 rounded-xl border", color)}>
      <span className="text-xl font-bold leading-none">{value}</span>
      <span className="text-xs mt-0.5 font-medium opacity-80">{label}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MyTasksPage() {
  const [activeFilter, setActiveFilter] = useState<TaskStatus | "all">("all");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelledIds, setCancelledIds] = useState<Set<string>>(new Set());

  // Merge cancelled state into tasks
  const tasks = useMemo(
    () =>
      MOCK_TASKS.map((t) =>
        cancelledIds.has(t.id) ? { ...t, status: "cancelled" as TaskStatus } : t
      ),
    [cancelledIds]
  );

  const filteredTasks = useMemo(
    () =>
      activeFilter === "all"
        ? tasks
        : tasks.filter((t) => t.status === activeFilter),
    [tasks, activeFilter]
  );

  // Stats
  const stats = useMemo(() => ({
    total: tasks.length,
    active: tasks.filter((t) =>
      ["open", "bid_received", "assigned", "in_progress", "completion_requested"].includes(t.status)
    ).length,
    completed: tasks.filter((t) => t.status === "completed").length,
    cancelled: tasks.filter((t) => t.status === "cancelled").length,
  }), [tasks]);

  function handleCancel(id: string) {
    setCancellingId(id);
  }

  function confirmCancel(id: string) {
    setCancelledIds((prev) => new Set([...prev, id]));
    setCancellingId(null);
  }

  function dismissCancel() {
    setCancellingId(null);
  }

  const canCancel = (status: TaskStatus) =>
    ["open", "bid_received"].includes(status);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* ── Page Header ── */}
      <div className="bg-[var(--card)] border-b border-[var(--border)] shadow-[0_1px_4px_rgba(26,26,46,0.06)]">
        <div className="container py-5 md:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Title block */}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 rounded-xl bg-[var(--primary)] flex items-center justify-center flex-shrink-0">
                  <ClipboardList className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[var(--foreground)] leading-tight">
                    Mere Kaam
                  </h1>
                  <p className="text-sm text-[var(--muted-foreground)] font-medium" dir="rtl" lang="ur">
                    میرے کام
                  </p>
                </div>
              </div>
            </div>

            {/* Post new task CTA */}
            <Link
              href="/post-task"
              className="btn-primary self-start sm:self-auto flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              Naya Kaam Post Karo
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex gap-3 mt-4 overflow-x-auto pb-1 scrollbar-hide">
            <StatPill
              label="Kul Kaam"
              value={stats.total}
              color="border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
            />
            <StatPill
              label="Chal Rahe"
              value={stats.active}
              color="border-blue-200 bg-blue-50 text-blue-700"
            />
            <StatPill
              label="Mukammal"
              value={stats.completed}
              color="border-emerald-200 bg-emerald-50 text-emerald-700"
            />
            <StatPill
              label="Mansookh"
              value={stats.cancelled}
              color="border-red-200 bg-red-50 text-red-700"
            />
          </div>
        </div>
      </div>

      <div className="container py-5 md:py-7">
        {/* ── Status Filter Tabs ── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
          {STATUS_FILTERS.map(({ key }) => {
            const isActive = activeFilter === key;
            const label = key === "all" ? "Sab Kaam" : getStatusLabel(key as TaskStatus);
            return (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={cn(
                  "flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 whitespace-nowrap",
                  isActive
                    ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm"
                    : "bg-[var(--card)] text-[var(--muted-foreground)] border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                )}
              >
                {label}
                {key !== "all" && (
                  <span className={cn(
                    "ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold",
                    isActive ? "bg-white/20 text-white" : "bg-[var(--background)] text-[var(--muted-foreground)]"
                  )}>
                    {tasks.filter((t) => t.status === key).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Task List ── */}
        <AnimatePresence mode="wait">
          {filteredTasks.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-[var(--border)] flex items-center justify-center mb-4">
                <ClipboardList className="w-8 h-8 text-[var(--muted-foreground)]" />
              </div>
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-1">
                Abhi Koi Kaam Nahi
              </h2>
              <p className="text-sm text-[var(--muted-foreground)] mb-1" dir="rtl" lang="ur">
                ابھی کوئی کام نہیں
              </p>
              <p className="text-sm text-[var(--muted-foreground)] mb-6 max-w-xs">
                Is filter mein koi kaam nahi mila. Naya kaam post karo aur qareeb ke taskers se bids hasil karo.
              </p>
              <Link href="/post-task" className="btn-primary text-sm">
                <Plus className="w-4 h-4" />
                Pehla Kaam Post Karo
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key={activeFilter}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-3"
            >
              {filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  variants={fadeInUp}
                  layout
                  className={cn(
                    "bg-[var(--card)] rounded-xl border border-[var(--border)] border-l-4 shadow-[0_1px_4px_rgba(26,26,46,0.06)] overflow-hidden",
                    getStatusBorderColor(task.status)
                  )}
                >
                  <div className="p-4">
                    {/* Top row: title + badges */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          {task.isUrgent && (
                            <span className="badge-urgent flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              Urgent
                            </span>
                          )}
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[var(--background)] border border-[var(--border)] text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">
                            {task.category}
                          </span>
                        </div>
                        <h3 className="font-bold text-[var(--foreground)] text-sm leading-snug line-clamp-2">
                          {task.title}
                        </h3>
                      </div>

                      {/* Status badge */}
                      <span
                        className={cn(
                          "flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold border",
                          getStatusColor(task.status)
                        )}
                      >
                        <StatusIcon status={task.status} />
                        {getStatusLabel(task.status)}
                      </span>
                    </div>

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--muted-foreground)] mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[var(--primary)]" />
                        {task.area}, {task.city}
                      </span>
                      {task.bidCount > 0 && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-[var(--accent)]" />
                          <span className="font-semibold text-[var(--accent)]">{task.bidCount}</span> bid{task.bidCount !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    {/* Budget + Actions */}
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <span className="text-xs text-[var(--muted-foreground)] block leading-none mb-0.5">Budget</span>
                        <span className="pkr-amount text-base">{formatPkr(task.budgetPkr)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Cancel */}
                        {canCancel(task.status) && !cancelledIds.has(task.id) && (
                          <button
                            onClick={() => handleCancel(task.id)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[var(--destructive)] text-[var(--destructive)] text-xs font-semibold hover:bg-red-50 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                            Cancel
                          </button>
                        )}

                        {/* View Bids */}
                        {task.status === "bid_received" && (
                          <Link
                            href={`/task/${task.id}`}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[var(--accent)] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                          >
                            <Users className="w-3.5 h-3.5" />
                            Bids Dekho
                          </Link>
                        )}

                        {/* View Details */}
                        <Link
                          href={`/task/${task.id}`}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:bg-[var(--primary-hover)] transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Dekho
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Dispute / Completion banner */}
                  {task.status === "disputed" && (
                    <div className="px-4 py-2 bg-red-50 border-t border-red-100 flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-[var(--destructive)] flex-shrink-0" />
                      <span className="text-xs text-[var(--destructive)] font-medium">
                        Yeh kaam dispute mein hai. Support se rabta karo.
                      </span>
                      <Link href="/dispute" className="ml-auto text-xs font-semibold text-[var(--destructive)] underline whitespace-nowrap">
                        Dispute Dekho
                      </Link>
                    </div>
                  )}
                  {task.status === "completion_requested" && (
                    <div className="px-4 py-2 bg-purple-50 border-t border-purple-100 flex items-center gap-2">
                      <Star className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                      <span className="text-xs text-purple-700 font-medium">
                        Tasker ne kaam mukammal karne ki darkhwast di hai.
                      </span>
                      <Link href={`/task/${task.id}`} className="ml-auto text-xs font-semibold text-purple-700 underline whitespace-nowrap">
                        Confirm Karo
                      </Link>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Quick links ── */}
        {filteredTasks.length > 0 && (
          <Reveal className="mt-8">
            <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">Aur kaam chahiye?</p>
                  <p className="text-xs text-[var(--muted-foreground)]">Naya task post karo aur qareeb ke taskers se bids hasil karo.</p>
                </div>
              </div>
              <Link href="/post-task" className="btn-primary text-sm flex-shrink-0">
                <Plus className="w-4 h-4" />
                Post Karo
              </Link>
            </div>
          </Reveal>
        )}
      </div>

      {/* ── Cancel Confirmation Modal ── */}
      <AnimatePresence>
        {cancellingId && (
          <motion.div
            key="cancel-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={dismissCancel}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-2xl w-full max-w-sm p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-[var(--destructive)]" />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--foreground)] text-base">Kaam Cancel Karo?</h3>
                  <p className="text-xs text-[var(--muted-foreground)]" dir="rtl" lang="ur">کام منسوخ کریں؟</p>
                </div>
              </div>
              <p className="text-sm text-[var(--muted-foreground)] mb-5 leading-relaxed">
                Kya aap waqai yeh kaam cancel karna chahte hain? Yeh action wapis nahi ho sakta.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={dismissCancel}
                  className="flex-1 btn-secondary text-sm py-2"
                >
                  Nahi, Wapis Jao
                </button>
                <button
                  onClick={() => confirmCancel(cancellingId)}
                  className="flex-1 px-4 py-2 rounded-[var(--radius)] bg-[var(--destructive)] text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  Haan, Cancel Karo
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
