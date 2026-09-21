"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Briefcase, MapPin, Clock, ChevronRight, CheckCircle, XCircle, AlertCircle, Star, Zap, Filter, TrendingUp, Wallet, Eye, RotateCcw } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { formatPKR, COMMISSION_RATE, VerificationStatus } from "@/lib/data";
import { cn } from "@/lib/utils";

type BidStatus = "pending" | "accepted" | "rejected" | "withdrawn" | "completed";

interface MyBid {
  id: string;
  taskId: string;
  taskTitle: string;
  category: string;
  city: string;
  area: string;
  budgetPkr: number;
  myBidPkr: number;
  commissionPkr: number;
  netEarningPkr: number;
  status: BidStatus;
  taskStatus: string;
  submittedAt: string;
  isUrgent: boolean;
  posterName: string;
  note: string;
  taskerVerification: VerificationStatus;
}

const MOCK_BIDS: MyBid[] = [
  {
    id: "b1",
    taskId: "t1",
    taskTitle: "Grocery run from Imtiaz Store, Gulshan-e-Iqbal",
    category: "Errands & Shopping",
    city: "Karachi",
    area: "Gulshan-e-Iqbal",
    budgetPkr: 800,
    myBidPkr: 700,
    commissionPkr: Math.round(700 * COMMISSION_RATE),
    netEarningPkr: Math.round(700 * (1 - COMMISSION_RATE)),
    status: "accepted",
    taskStatus: "in_progress",
    submittedAt: "2024-06-10T09:15:00Z",
    isUrgent: true,
    posterName: "Ayesha Siddiqui",
    note: "I can do this quickly. I live nearby in Gulshan Block 7.",
    taskerVerification: "verified",
  },
  {
    id: "b2",
    taskId: "t2",
    taskTitle: "Move sofa and 2 beds to new flat in DHA Phase 6",
    category: "Moving & Delivery",
    city: "Lahore",
    area: "DHA Phase 5",
    budgetPkr: 4500,
    myBidPkr: 4000,
    commissionPkr: Math.round(4000 * COMMISSION_RATE),
    netEarningPkr: Math.round(4000 * (1 - COMMISSION_RATE)),
    status: "pending",
    taskStatus: "bid_received",
    submittedAt: "2024-06-11T11:30:00Z",
    isUrgent: false,
    posterName: "Tariq Mehmood",
    note: "Experienced mover. I have a helper and can bring a pickup.",
    taskerVerification: "verified",
  },
  {
    id: "b3",
    taskId: "t3",
    taskTitle: "Deep clean 3-bedroom apartment before handover",
    category: "Cleaning",
    city: "Islamabad",
    area: "F-10 Markaz",
    budgetPkr: 3200,
    myBidPkr: 3000,
    commissionPkr: Math.round(3000 * COMMISSION_RATE),
    netEarningPkr: Math.round(3000 * (1 - COMMISSION_RATE)),
    status: "rejected",
    taskStatus: "assigned",
    submittedAt: "2024-06-09T14:00:00Z",
    isUrgent: false,
    posterName: "Sana Mirza",
    note: "Professional cleaner with own supplies. Can finish in 5 hours.",
    taskerVerification: "verified",
  },
  {
    id: "b4",
    taskId: "t4",
    taskTitle: "Fix leaking kitchen tap and replace bathroom flush",
    category: "Small Repairs & Maintenance",
    city: "Rawalpindi",
    area: "Satellite Town",
    budgetPkr: 1200,
    myBidPkr: 1100,
    commissionPkr: Math.round(1100 * COMMISSION_RATE),
    netEarningPkr: Math.round(1100 * (1 - COMMISSION_RATE)),
    status: "completed",
    taskStatus: "completed",
    submittedAt: "2024-06-08T08:00:00Z",
    isUrgent: true,
    posterName: "Bilal Raza",
    note: "Certified plumber. Parts cost separate as agreed.",
    taskerVerification: "verified",
  },
  {
    id: "b5",
    taskId: "t5",
    taskTitle: "Stand in NADRA queue for CNIC renewal token",
    category: "Queue & Appointment Standing",
    city: "Karachi",
    area: "Saddar",
    budgetPkr: 600,
    myBidPkr: 550,
    commissionPkr: Math.round(550 * COMMISSION_RATE),
    netEarningPkr: Math.round(550 * (1 - COMMISSION_RATE)),
    status: "withdrawn",
    taskStatus: "open",
    submittedAt: "2024-06-07T07:30:00Z",
    isUrgent: false,
    posterName: "Kamran Shah",
    note: "I am available early morning and know the NADRA process well.",
    taskerVerification: "submitted",
  },
  {
    id: "b6",
    taskId: "t6",
    taskTitle: "Laptop cleanup and antivirus installation",
    category: "Digital Help",
    city: "Lahore",
    area: "Johar Town",
    budgetPkr: 1500,
    myBidPkr: 1200,
    commissionPkr: Math.round(1200 * COMMISSION_RATE),
    netEarningPkr: Math.round(1200 * (1 - COMMISSION_RATE)),
    status: "pending",
    taskStatus: "open",
    submittedAt: "2024-06-11T17:00:00Z",
    isUrgent: false,
    posterName: "Nadia Farooq",
    note: "IT professional. Can visit your home or work remotely via TeamViewer.",
    taskerVerification: "verified",
  },
];

const STATUS_CONFIG: Record<
  BidStatus,
  { label: string; urdu: string; color: string; bg: string; icon: React.ElementType }
> = {
  pending: {
    label: "Pending",
    urdu: "زیر غور",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    icon: Clock,
  },
  accepted: {
    label: "Accepted",
    urdu: "منظور",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    icon: CheckCircle,
  },
  rejected: {
    label: "Not Selected",
    urdu: "منتخب نہیں",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    icon: XCircle,
  },
  withdrawn: {
    label: "Withdrawn",
    urdu: "واپس لی",
    color: "text-gray-600",
    bg: "bg-gray-50 border-gray-200",
    icon: RotateCcw,
  },
  completed: {
    label: "Completed",
    urdu: "مکمل",
    color: "text-[#1B6CA8]",
    bg: "bg-blue-50 border-blue-200",
    icon: Star,
  },
};

const FILTER_OPTIONS: { key: BidStatus | "all"; label: string; urdu: string }[] = [
  { key: "all", label: "All Bids", urdu: "تمام" },
  { key: "pending", label: "Pending", urdu: "زیر غور" },
  { key: "accepted", label: "Accepted", urdu: "منظور" },
  { key: "completed", label: "Completed", urdu: "مکمل" },
  { key: "rejected", label: "Not Selected", urdu: "منتخب نہیں" },
  { key: "withdrawn", label: "Withdrawn", urdu: "واپس لی" },
];

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" });
}

function BidStatusBadge({ status }: { status: BidStatus }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        cfg.bg,
        cfg.color
      )}
    >
      <Icon className="w-3 h-3" aria-hidden="true" />
      {cfg.label}
      <span className="opacity-60 font-normal">· {cfg.urdu}</span>
    </span>
  );
}

function StatCard({
  icon: Icon,
  label,
  urdu,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  urdu: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl p-4 border flex flex-col gap-2",
        accent
          ? "bg-[#1B6CA8] border-[#155a8a] text-white"
          : "bg-white border-[var(--border)] text-[var(--foreground)]"
      )}
    >
      <div
        className={cn(
          "w-9 h-9 rounded-xl flex items-center justify-center",
          accent ? "bg-white/20" : "bg-[#EBF4FB]"
        )}
      >
        <Icon
          className={cn("w-4.5 h-4.5", accent ? "text-white" : "text-[#1B6CA8]")} 
          style={{ width: 18, height: 18 }}
          aria-hidden="true"
        />
      </div>
              <p className={cn("text-xl font-bold leading-none", accent ? "text-white" : "text-[var(--foreground)]")}>
          {value}
        </p>
        <div>
          <p className={cn("text-xs font-semibold", accent ? "text-white" : "text-[var(--foreground)]")}>
            {label}
          </p>
          <p className={cn("text-xs", accent ? "text-white/80" : "text-[var(--muted-foreground)]")}>
            {urdu}
          </p>
      </div>
    </div>
  );
}

export default function MyBidsPage() {
  const [activeFilter, setActiveFilter] = useState<BidStatus | "all">("all");
  const [expandedBid, setExpandedBid] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return MOCK_BIDS;
    return MOCK_BIDS.filter((b) => b.status === activeFilter);
  }, [activeFilter]);

  const stats = useMemo(() => {
    const accepted = MOCK_BIDS.filter((b) => b.status === "accepted" || b.status === "completed");
    const completed = MOCK_BIDS.filter((b) => b.status === "completed");
    const totalEarned = completed.reduce((s, b) => s + b.netEarningPkr, 0);
    const pending = MOCK_BIDS.filter((b) => b.status === "pending");
    return { total: MOCK_BIDS.length, accepted: accepted.length, completed: completed.length, totalEarned, pending: pending.length };
  }, []);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* ── HERO HEADER ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1A1A2E 0%, #1B6CA8 60%, #155a8a 100%)",
        }}
      >
        {/* Decorative pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #F5A623 0px, #F5A623 1px, transparent 1px, transparent 12px), repeating-linear-gradient(-45deg, #F5A623 0px, #F5A623 1px, transparent 1px, transparent 12px)",
          }}
          aria-hidden="true"
        />
        {/* Glow orb */}
        <div
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #F5A623 0%, transparent 70%)" }}
          aria-hidden="true"
        />

        <div className="container relative z-10 py-10 md:py-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              {/* Crescent + star motif */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[#F5A623] text-lg" aria-hidden="true">☽</span>
                <span className="text-white/50 text-xs font-medium uppercase tracking-widest">
                  Asan Kaam · Tasker Dashboard
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight">
                Meri Bids
              </h1>
              <p className="text-[#F5A623] text-xl font-semibold mt-0.5" dir="rtl" lang="ur">
                میری بولیاں
              </p>
              <p className="text-white/70 text-sm mt-2 max-w-md">
                Track every bid you have submitted — pending decisions, accepted work, and completed earnings.
              </p>
            </div>

            {/* Quick action */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#1A1A2E] hover:bg-[#2d2d4e] text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg self-start md:self-auto"
            >
              <Briefcase className="w-4 h-4" aria-hidden="true" />
              Browse New Tasks
            </Link>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            <StatCard
              icon={Briefcase}
              label="Total Bids"
              urdu="کل بولیاں"
              value={String(stats.total)}
            />
            <StatCard
              icon={CheckCircle}
              label="Accepted"
              urdu="منظور شدہ"
              value={String(stats.accepted)}
            />
            <StatCard
              icon={Star}
              label="Completed"
              urdu="مکمل"
              value={String(stats.completed)}
            />
            <StatCard
              icon={Wallet}
              label="Net Earned"
              urdu="خالص آمدنی"
              value={formatPKR(stats.totalEarned)}
              accent
            />
          </div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <div className="container py-8">
        {/* Filter tabs */}
        <Reveal>
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
            <Filter className="w-4 h-4 text-[var(--muted-foreground)] flex-shrink-0" aria-hidden="true" />
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setActiveFilter(opt.key)}
                className={cn(
                  "flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200",
                  activeFilter === opt.key
                    ? "bg-[#1B6CA8] text-white border-[#1B6CA8] shadow-md shadow-blue-900/20"
                    : "bg-[var(--foreground)]/5 text-[var(--foreground)] border-[var(--border)] hover:border-[#1B6CA8] hover:text-[#1B6CA8]"
                )}
              >
                {opt.label}
                {opt.key !== "all" && (
                  <span className="ml-1 opacity-60 font-normal">· {opt.urdu}</span>
                )}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Bid count */}
        <Reveal delay={0.05}>
          <p className="text-sm text-[var(--muted-foreground)] mb-4">
            Showing{" "}
            <span className="font-semibold text-[var(--foreground)]">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "bid" : "bids"}
            {activeFilter !== "all" && (
              <span>
                {" "}with status{" "}
                <span className="font-semibold text-[#1B6CA8]">
                  {STATUS_CONFIG[activeFilter as BidStatus]?.label}
                </span>
              </span>
            )}
          </p>
        </Reveal>

        {/* Bid list */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#EBF4FB] flex items-center justify-center mb-4">
                <Briefcase className="w-8 h-8 text-[#1B6CA8]" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-[var(--foreground)] text-lg mb-1">No bids found</h3>
              <p className="text-[var(--muted-foreground)] text-sm max-w-xs">
                You have no bids with this status yet. Browse the task feed to find work.
              </p>
              <Link
                href="/"
                className="mt-5 inline-flex items-center gap-2 bg-[#1B6CA8] hover:bg-[#155a8a] text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-200"
              >
                Browse Tasks <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key={activeFilter}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-4"
            >
              {filtered.map((bid) => {
                const cfg = STATUS_CONFIG[bid.status];
                const StatusIcon = cfg.icon;
                const isExpanded = expandedBid === bid.id;

                return (
                  <motion.div
                    key={bid.id}
                    variants={fadeInUp}
                    className="bg-white rounded-2xl border border-[var(--border)] shadow-[0_1px_3px_rgba(26,26,46,0.06),0_4px_16px_-4px_rgba(26,26,46,0.08)] overflow-hidden"
                  >
                    {/* Top accent bar based on status */}
                    <div
                      className={cn(
                        "h-1 w-full",
                        bid.status === "accepted" && "bg-emerald-400",
                        bid.status === "completed" && "bg-[#1B6CA8]",
                        bid.status === "pending" && "bg-amber-400",
                        bid.status === "rejected" && "bg-red-400",
                        bid.status === "withdrawn" && "bg-gray-300"
                      )}
                    />

                    <div className="p-4 md:p-5">
                      {/* Header row */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            {bid.isUrgent && (
                              <span className="inline-flex items-center gap-1 bg-[#F5A623] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                <Zap className="w-3 h-3" aria-hidden="true" />
                                Urgent
                              </span>
                            )}
                            <span className="text-xs text-[var(--muted-foreground)] bg-[var(--background)] px-2 py-0.5 rounded-full border border-[var(--border)]">
                              {bid.category}
                            </span>
                          </div>
                          <h3 className="font-bold text-[var(--foreground)] text-base leading-snug line-clamp-2">
                            {bid.taskTitle}
                          </h3>
                        </div>
                        <BidStatusBadge status={bid.status} />
                      </div>

                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[var(--muted-foreground)] mb-4">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                          {bid.area}, {bid.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                          {formatDate(bid.submittedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
                          Task budget: <span className="font-semibold text-[var(--foreground)]">{formatPKR(bid.budgetPkr)}</span>
                        </span>
                      </div>

                      {/* PKR breakdown card */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="bg-[#EBF4FB] rounded-xl p-3 text-center">
                          <p className="text-[10px] text-[#1B6CA8] font-semibold uppercase tracking-wide mb-0.5">My Bid</p>
                          <p className="text-sm font-bold text-[#1B6CA8]">{formatPKR(bid.myBidPkr)}</p>
                          <p className="text-[10px] text-[#1B6CA8]/60" dir="rtl" lang="ur">میری بولی</p>
                        </div>
                        <div className="bg-amber-50 rounded-xl p-3 text-center">
                          <p className="text-[10px] text-amber-700 font-semibold uppercase tracking-wide mb-0.5">Commission</p>
                          <p className="text-sm font-bold text-amber-700">{formatPKR(bid.commissionPkr)}</p>
                          <p className="text-[10px] text-amber-600/60" dir="rtl" lang="ur">کمیشن</p>
                        </div>
                        <div className="bg-emerald-50 rounded-xl p-3 text-center">
                          <p className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wide mb-0.5">You Earn</p>
                          <p className="text-sm font-bold text-emerald-700">{formatPKR(bid.netEarningPkr)}</p>
                          <p className="text-[10px] text-emerald-600/60" dir="rtl" lang="ur">آپ کمائیں</p>
                        </div>
                      </div>

                      {/* Expand toggle */}
                      <button
                        onClick={() => setExpandedBid(isExpanded ? null : bid.id)}
                        className="flex items-center gap-1.5 text-xs text-[#1B6CA8] font-semibold hover:underline mb-3"
                        aria-expanded={isExpanded}
                      >
                        <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                        {isExpanded ? "Hide details" : "Show bid note & details"}
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            key="details"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-[var(--border)] pt-3 mb-3">
                              <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide mb-1">
                                Your bid note
                              </p>
                              <p className="text-sm text-[var(--foreground)] leading-relaxed bg-[var(--background)] rounded-xl p-3 border border-[var(--border)]">
                                &ldquo;{bid.note}&rdquo;
                              </p>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                              <span>Posted by:</span>
                              <span className="font-semibold text-[var(--foreground)]">{bid.posterName}</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[var(--border)]">
                        <Link
                          href={`/task/${bid.taskId}`}
                          className="inline-flex items-center gap-1.5 bg-[#1B6CA8] hover:bg-[#155a8a] text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all duration-200"
                        >
                          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                          View Task
                        </Link>

                        {bid.status === "accepted" && (
                          <Link
                            href={`/in-app-messaging-chat`}
                            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all duration-200"
                          >
                            <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
                            Open Chat
                          </Link>
                        )}

                        {bid.status === "completed" && (
                          <Link
                            href="/ratings-reviews"
                            className="inline-flex items-center gap-1.5 bg-[#F5A623] hover:bg-[#e09510] text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all duration-200"
                          >
                            <Star className="w-3.5 h-3.5" aria-hidden="true" />
                            View Rating
                          </Link>
                        )}

                        {bid.status === "pending" && (
                          <button
                            className="inline-flex items-center gap-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all duration-200"
                            onClick={() => alert("Withdraw bid — connect to backend")}
                          >
                            <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
                            Withdraw
                          </button>
                        )}

                        {bid.status === "rejected" && (
                          <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 bg-white border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[#1B6CA8] hover:border-[#1B6CA8] text-xs font-semibold px-3.5 py-2 rounded-xl transition-all duration-200"
                          >
                            <Briefcase className="w-3.5 h-3.5" aria-hidden="true" />
                            Find Similar Tasks
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

        {/* Bottom CTA */}
        {filtered.length > 0 && (
          <Reveal delay={0.1}>
            <div
              className="mt-10 rounded-2xl p-6 text-center"
              style={{
                background: "linear-gradient(135deg, #1A1A2E 0%, #1B6CA8 100%)",
              }}
            >
              <p className="text-white font-bold text-lg mb-0.5">Zyada Kaam, Zyada Kamai</p>
              <p className="text-[#F5A623] text-base font-semibold mb-3" dir="rtl" lang="ur">
                زیادہ کام، زیادہ کمائی
              </p>
              <p className="text-white/70 text-sm mb-5 max-w-sm mx-auto">
                New tasks are posted every hour. Keep bidding to grow your earnings and reputation.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-[#F5A623] hover:bg-[#e09510] text-white font-bold text-sm px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-amber-900/30"
              >
                <Briefcase className="w-4 h-4" aria-hidden="true" />
                Browse Open Tasks
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        )}
      </div>
    </main>
  );
}
