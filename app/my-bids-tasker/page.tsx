"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MapPin, Clock, ChevronRight, X, TrendingUp, CheckCircle, AlertCircle, Loader, Eye, ArrowRight, Briefcase } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import { formatPKR, COMMISSION_RATE, TaskCategory } from "@/lib/data";
import { staggerContainer, fadeInUp } from "@/lib/motion";

const COMMISSION_RATE_DEFAULT = COMMISSION_RATE;
const formatPkr = formatPKR;

type BidStatus = "pending" | "accepted" | "rejected" | "withdrawn";

interface MyBid {
  id: string;
  taskId: string;
  taskTitle: string;
  taskArea: string;
  taskCity: string;
  taskCategory: TaskCategory;
  taskBudgetPkr: number;
  myBidPkr: number;
  commissionEstimatePkr: number;
  status: BidStatus;
  submittedAt: string;
  taskStatus: string;
  isUrgent: boolean;
}

const MOCK_BIDS: MyBid[] = [
  {
    id: "b1",
    taskId: "t1",
    taskTitle: "Grocery run from Imtiaz Store, Gulshan",
    taskArea: "Gulshan-e-Iqbal",
    taskCity: "Karachi",
    taskCategory: "Errands & Shopping",
    taskBudgetPkr: 800,
    myBidPkr: 700,
    commissionEstimatePkr: Math.round(700 * COMMISSION_RATE_DEFAULT),
    status: "pending",
    submittedAt: "2024-06-10T09:15:00Z",
    taskStatus: "bid_received",
    isUrgent: true,
  },
  {
    id: "b2",
    taskId: "t2",
    taskTitle: "Move 3 boxes from DHA Phase 5 to Clifton",
    taskArea: "DHA Phase 5",
    taskCity: "Karachi",
    taskCategory: "Moving & Delivery",
    taskBudgetPkr: 2500,
    myBidPkr: 2200,
    commissionEstimatePkr: Math.round(2200 * COMMISSION_RATE_DEFAULT),
    status: "accepted",
    submittedAt: "2024-06-09T14:45:00Z",
    taskStatus: "assigned",
    isUrgent: false,
  },
  {
    id: "b3",
    taskId: "t3",
    taskTitle: "Deep clean 2-bedroom apartment before move-in",
    taskArea: "Bahria Town",
    taskCity: "Lahore",
    taskCategory: "Cleaning",
    taskBudgetPkr: 3500,
    myBidPkr: 3000,
    commissionEstimatePkr: Math.round(3000 * COMMISSION_RATE_DEFAULT),
    status: "rejected",
    submittedAt: "2024-06-08T11:00:00Z",
    taskStatus: "assigned",
    isUrgent: false,
  },
  {
    id: "b4",
    taskId: "t4",
    taskTitle: "Fix leaking kitchen tap and replace washers",
    taskArea: "F-7",
    taskCity: "Islamabad",
    taskCategory: "Small Repairs & Maintenance",
    taskBudgetPkr: 1200,
    myBidPkr: 1100,
    commissionEstimatePkr: Math.round(1100 * COMMISSION_RATE_DEFAULT),
    status: "withdrawn",
    submittedAt: "2024-06-07T08:30:00Z",
    taskStatus: "open",
    isUrgent: true,
  },
  {
    id: "b5",
    taskId: "t5",
    taskTitle: "Stand in queue at NADRA office for token",
    taskArea: "Saddar",
    taskCity: "Rawalpindi",
    taskCategory: "Queue & Appointment Standing",
    taskBudgetPkr: 600,
    myBidPkr: 550,
    commissionEstimatePkr: Math.round(550 * COMMISSION_RATE_DEFAULT),
    status: "accepted",
    submittedAt: "2024-06-06T07:00:00Z",
    taskStatus: "completed",
    isUrgent: false,
  },
  {
    id: "b6",
    taskId: "t6",
    taskTitle: "Help set up new laptop and install software",
    taskArea: "Johar Town",
    taskCity: "Lahore",
    taskCategory: "Digital Help",
    taskBudgetPkr: 1500,
    myBidPkr: 1400,
    commissionEstimatePkr: Math.round(1400 * COMMISSION_RATE_DEFAULT),
    status: "pending",
    submittedAt: "2024-06-11T17:00:00Z",
    taskStatus: "open",
    isUrgent: false,
  },
];

const STATUS_TABS: { key: BidStatus | "all"; label: string; urdu: string }[] = [
  { key: "all", label: "All", urdu: "سب" },
  { key: "pending", label: "Pending", urdu: "زیر غور" },
  { key: "accepted", label: "Accepted", urdu: "منظور" },
  { key: "rejected", label: "Rejected", urdu: "مسترد" },
  { key: "withdrawn", label: "Withdrawn", urdu: "واپس" },
];

function getBidStatusConfig(status: BidStatus): {
  label: string;
  urdu: string;
  className: string;
  icon: React.ElementType;
} {
  switch (status) {
    case "pending":
      return { label: "Pending", urdu: "زیر غور", className: "bg-amber-50 text-amber-700 border border-amber-200", icon: Loader };
    case "accepted":
      return { label: "Accepted", urdu: "منظور", className: "bg-emerald-50 text-emerald-700 border border-emerald-200", icon: CheckCircle };
    case "rejected":
      return { label: "Rejected", urdu: "مسترد", className: "bg-red-50 text-red-700 border border-red-200", icon: AlertCircle };
    case "withdrawn":
      return { label: "Withdrawn", urdu: "واپس", className: "bg-gray-100 text-gray-500 border border-gray-200", icon: X };
  }
}

function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return "Just now";
}

export default function MyBidsTaskerPage() {
  const [activeTab, setActiveTab] = useState<BidStatus | "all">("all");
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);
  const [bids, setBids] = useState<MyBid[]>(MOCK_BIDS);

  const filtered = useMemo(() => {
    if (activeTab === "all") return bids;
    return bids.filter((b) => b.status === activeTab);
  }, [bids, activeTab]);

  const stats = useMemo(() => ({
    total: bids.length,
    pending: bids.filter((b) => b.status === "pending").length,
    accepted: bids.filter((b) => b.status === "accepted").length,
    rejected: bids.filter((b) => b.status === "rejected").length,
  }), [bids]);

  function handleWithdraw(bidId: string) {
    setWithdrawingId(bidId);
    setTimeout(() => {
      setBids((prev) =>
        prev.map((b) => (b.id === bidId ? { ...b, status: "withdrawn" } : b))
      );
      setWithdrawingId(null);
    }, 900);
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* ── HERO BANNER ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1A1A2E 0%, #1B6CA8 55%, #155a8a 100%)",
        }}
      >
        {/* Geometric pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #F5A623 0px, #F5A623 1px, transparent 1px, transparent 12px), repeating-linear-gradient(-45deg, #ffffff 0px, #ffffff 1px, transparent 1px, transparent 12px)",
          }}
          aria-hidden="true"
        />
        {/* Crescent-inspired radial glow */}
        <div
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #F5A623 0%, transparent 70%)" }}
          aria-hidden="true"
        />

        <div className="container relative z-10 py-10 md:py-14">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              {/* Title block */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-4 h-4 text-white" aria-hidden="true" />
                  </div>
                  <span className="text-[var(--accent)] text-sm font-semibold tracking-wide uppercase">
                    Tasker Dashboard
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  Meri Bids
                </h1>
                <p
                  className="text-white/70 text-lg mt-1"
                  style={{ fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif" }}
                  dir="rtl"
                >
                  میری بولیاں
                </p>
                <p className="text-white/60 text-sm mt-2">
                  Track all your submitted bids and their current status.
                </p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Total Bids", urdu: "کل بولیاں", value: stats.total, color: "text-white" },
                  { label: "Pending", urdu: "زیر غور", value: stats.pending, color: "text-amber-300" },
                  { label: "Accepted", urdu: "منظور", value: stats.accepted, color: "text-emerald-300" },
                  { label: "Rejected", urdu: "مسترد", value: stats.rejected, color: "text-red-300" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-4 py-3 text-center"
                  >
                    <div className={cn("text-2xl font-bold", stat.color)}>{stat.value}</div>
                    <div className="text-white/70 text-xs font-medium mt-0.5">{stat.label}</div>
                    <div
                      className="text-white/40 text-xs"
                      style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}
                      dir="rtl"
                    >
                      {stat.urdu}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FILTER TABS ── */}
      <div className="sticky top-14 md:top-16 z-30 bg-[var(--card)] border-b border-[var(--border)] shadow-sm">
        <div className="container">
          <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0",
                  activeTab === tab.key
                    ? "bg-[var(--primary)] text-white shadow-sm"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--background)]"
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    "text-xs",
                    activeTab === tab.key ? "text-white/70" : "text-[var(--muted-foreground)]"
                  )}
                  style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}
                >
                  {tab.urdu}
                </span>
                {tab.key !== "all" && (
                  <span
                    className={cn(
                      "ml-1 min-w-[18px] h-[18px] rounded-full text-xs flex items-center justify-center font-bold",
                      activeTab === tab.key
                        ? "bg-white/20 text-white"
                        : "bg-[var(--background)] text-[var(--muted-foreground)]"
                    )}
                  >
                    {bids.filter((b) => b.status === tab.key).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── BID LIST ── */}
      <div className="container py-6 md:py-8">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mb-5">
                <Briefcase className="w-9 h-9 text-[var(--primary)]" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-bold text-[var(--foreground)] mb-1">
                Koi bid nahi mili
              </h2>
              <p
                className="text-[var(--muted-foreground)] text-base mb-1"
                style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}
                dir="rtl"
              >
                ابھی تک کوئی بولی نہیں
              </p>
              <p className="text-[var(--muted-foreground)] text-sm mb-6 max-w-xs">
                You haven't submitted any bids in this category yet. Browse open tasks and place your first bid.
              </p>
              <Link
                href="/home-task-feed"
                className="btn-primary inline-flex items-center gap-2"
              >
                Kaam Dhundo <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-4"
            >
              {filtered.map((bid) => {
                const statusConfig = getBidStatusConfig(bid.status);
                const StatusIcon = statusConfig.icon;
                const isWithdrawing = withdrawingId === bid.id;
                const canWithdraw = bid.status === "pending";
                const diff = bid.taskBudgetPkr - bid.myBidPkr;
                const isUnder = diff > 0;

                return (
                  <motion.div
                    key={bid.id}
                    variants={fadeInUp}
                    layout
                    className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(26,26,46,0.06),0_4px_16px_-4px_rgba(26,26,46,0.08)] hover:shadow-[0_2px_8px_rgba(26,26,46,0.1),0_8px_24px_-8px_rgba(27,108,168,0.15)] transition-shadow duration-300"
                  >
                    {/* Card top accent bar */}
                    <div
                      className={cn(
                        "h-1 w-full",
                        bid.status === "accepted" && "bg-emerald-500",
                        bid.status === "pending" && "bg-[var(--accent)]",
                        bid.status === "rejected" && "bg-red-500",
                        bid.status === "withdrawn" && "bg-gray-300"
                      )}
                    />

                    <div className="p-4 md:p-5">
                      {/* Row 1: Title + Status badge */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          {bid.isUrgent && (
                            <span className="badge-urgent text-xs mb-1.5 inline-flex">
                              Zaruri — ضروری
                            </span>
                          )}
                          <Link
                            href={`/task/${bid.taskId}`}
                            className="text-[var(--foreground)] font-semibold text-base leading-snug hover:text-[var(--primary)] transition-colors line-clamp-2"
                          >
                            {bid.taskTitle}
                          </Link>
                        </div>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0",
                            statusConfig.className
                          )}
                        >
                          <StatusIcon className="w-3 h-3" aria-hidden="true" />
                          {statusConfig.label}
                        </span>
                      </div>

                      {/* Row 2: Location */}
                      <div className="flex items-center gap-1.5 text-[var(--muted-foreground)] text-sm mb-3">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-[var(--primary)]" aria-hidden="true" />
                        <span>{bid.taskArea}, {bid.taskCity}</span>
                        <span className="mx-1 text-[var(--border)]">·</span>
                        <span className="text-xs bg-[var(--background)] text-[var(--muted-foreground)] px-2 py-0.5 rounded-full border border-[var(--border)]">
                          {bid.taskCategory}
                        </span>
                      </div>

                      {/* Row 3: Budget comparison + My bid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                        {/* Task budget */}
                        <div className="bg-[var(--background)] rounded-lg px-3 py-2.5 border border-[var(--border)]">
                          <div className="text-[var(--muted-foreground)] text-xs mb-0.5">Task Budget</div>
                          <div className="text-[var(--foreground)] font-semibold text-sm">
                            {formatPkr(bid.taskBudgetPkr)}
                          </div>
                        </div>

                        {/* My bid */}
                        <div className="bg-[var(--primary)]/5 rounded-lg px-3 py-2.5 border border-[var(--primary)]/20">
                          <div className="text-[var(--primary)] text-xs mb-0.5 font-medium">Meri Bid</div>
                          <div className="text-[var(--accent)] font-bold text-lg leading-none">
                            {formatPkr(bid.myBidPkr)}
                          </div>
                        </div>

                        {/* Difference */}
                        <div className="bg-[var(--background)] rounded-lg px-3 py-2.5 border border-[var(--border)] col-span-2 sm:col-span-1">
                          <div className="text-[var(--muted-foreground)] text-xs mb-0.5">vs Budget</div>
                          <div
                            className={cn(
                              "font-semibold text-sm",
                              isUnder ? "text-emerald-600" : diff < 0 ? "text-red-500" : "text-[var(--muted-foreground)]"
                            )}
                          >
                            {isUnder
                              ? `Rs ${diff.toLocaleString("en-PK")} under`
                              : diff < 0
                              ? `Rs ${Math.abs(diff).toLocaleString("en-PK")} over`
                              : "Exact match"}
                          </div>
                        </div>
                      </div>

                      {/* Row 4: Commission estimate + time */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-4">
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-[var(--muted-foreground)]" aria-hidden="true" />
                          <span className="text-[var(--muted-foreground)] text-xs">
                            Fee if selected:{" "}
                            <span className="font-semibold text-[var(--foreground)]">
                              {formatPkr(bid.commissionEstimatePkr)}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[var(--muted-foreground)]" aria-hidden="true" />
                          <span className="text-[var(--muted-foreground)] text-xs">
                            {formatRelativeTime(bid.submittedAt)}
                          </span>
                        </div>
                      </div>

                      {/* Row 5: Action buttons */}
                      <div className="flex items-center gap-2 pt-3 border-t border-[var(--border)]">
                        <Link
                          href={`/task/${bid.taskId}`}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--primary)] text-[var(--primary)] text-sm font-semibold hover:bg-[var(--primary)]/5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                          View Task
                        </Link>

                        {canWithdraw && (
                          <button
                            onClick={() => handleWithdraw(bid.id)}
                            disabled={isWithdrawing}
                            className={cn(
                              "flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-semibold transition-all duration-200",
                              isWithdrawing
                                ? "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed"
                                : "border-red-200 text-red-600 hover:bg-red-50"
                            )}
                          >
                            {isWithdrawing ? (
                              <>
                                <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
                                Withdrawing...
                              </>
                            ) : (
                              <>
                                <X className="w-3.5 h-3.5" aria-hidden="true" />
                                Withdraw Bid
                              </>
                            )}
                          </button>
                        )}

                        {bid.status === "accepted" && (
                          <Link
                            href={`/in-app-messaging-chat`}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
                          >
                            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                            Open Chat
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── CTA FOOTER ── */}
        {filtered.length > 0 && (
          <Reveal delay={0.2}>
            <div className="mt-8 rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--card)] shadow-sm">
              <div
                className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
                style={{
                  background: "linear-gradient(135deg, #1B6CA8 0%, #155a8a 100%)",
                }}
              >
                <div className="text-white text-center sm:text-left">
                  <p className="font-semibold text-base">Aur tasks dhundein</p>
                  <p
                    className="text-white/70 text-sm"
                    style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}
                    dir="rtl"
                  >
                    مزید کام تلاش کریں
                  </p>
                </div>
                <Link
                  href="/home-task-feed"
                  className="inline-flex items-center gap-2 bg-[var(--accent)] text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-amber-500 transition-colors text-sm flex-shrink-0"
                >
                  Browse Tasks <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </main>
  );
}
