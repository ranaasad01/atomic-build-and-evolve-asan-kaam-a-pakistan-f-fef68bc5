"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Star, CheckCircle, AlertCircle, Shield, Zap, MessageSquare, XCircle, Flag, Calendar, ChevronRight, Quote, Award, Briefcase, Home } from 'lucide-react';
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import {
  getStatusLabel, getStatusColor, TaskStatus, VerificationStatus,
  TaskCategory, formatPKR, getVerificationLabel, COMMISSION_RATE
} from "@/lib/data";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const formatPkr = formatPKR;
const COMMISSION_RATE_DEFAULT = COMMISSION_RATE;
type TimingWindow = "asap" | "morning" | "afternoon" | "evening" | "flexible";

function getVerificationColor(status: VerificationStatus): string {
  switch (status) {
    case "verified": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "submitted": return "bg-amber-50 text-amber-700 border-amber-200";
    case "restricted": return "bg-red-50 text-red-700 border-red-200";
    default: return "bg-gray-50 text-gray-500 border-gray-200";
  }
}

function getVerificationIcon(status: VerificationStatus) {
  switch (status) {
    case "verified": return <CheckCircle className="w-3 h-3" />;
    case "submitted": return <Clock className="w-3 h-3" />;
    case "restricted": return <XCircle className="w-3 h-3" />;
    default: return <AlertCircle className="w-3 h-3" />;
  }
}

function getCategoryIcon(category: string) {
  const map: Record<string, React.ReactNode> = {
    moving_delivery: <Briefcase className="w-5 h-5" />,
    cleaning: <Home className="w-5 h-5" />,
    small_repairs: <Shield className="w-5 h-5" />,
    errands: <Zap className="w-5 h-5" />,
    queue_standing: <Clock className="w-5 h-5" />,
    digital_help: <MessageSquare className="w-5 h-5" />,
    household_assistance: <Home className="w-5 h-5" />,
  };
  return map[category] ?? <Briefcase className="w-5 h-5" />;
}

function getCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    moving_delivery: "Moving & Delivery",
    cleaning: "Cleaning",
    small_repairs: "Small Repairs",
    errands: "Errands & Shopping",
    queue_standing: "Queue Standing",
    digital_help: "Digital Help",
    household_assistance: "Household Assistance",
  };
  return map[category] ?? category;
}

function getTimingLabel(timing: TimingWindow): string {
  const map: Record<TimingWindow, string> = {
    asap: "ASAP",
    morning: "Morning (6 AM – 12 PM)",
    afternoon: "Afternoon (12 PM – 5 PM)",
    evening: "Evening (5 PM – 9 PM)",
    flexible: "Flexible",
  };
  return map[timing] ?? timing;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

// ─── Inline mock data ────────────────────────────────────────────────────────

const MOCK_TASK = {
  id: "task-001",
  title: "Help me move furniture from DHA Phase 5 to Gulshan",
  category: "moving_delivery" as TaskCategory,
  description:
    "I need 2 strong helpers to move a 3-seater sofa, a queen bed frame, a wardrobe, and about 15 boxes from my current apartment in DHA Phase 5 to my new place in Gulshan-e-Iqbal Block 13. Ground floor to 2nd floor (no elevator). Estimated 4–5 hours of work. I will provide a truck — just need the manpower. Please bring your own gloves if possible.",
  city: "Karachi",
  area: "DHA Phase 5",
  destinationArea: "Gulshan-e-Iqbal Block 13",
  budgetPkr: 3500,
  timing: "morning" as TimingWindow,
  preferredDate: "2025-02-15",
  status: "bid_received" as TaskStatus,
  bidCount: 4,
  isUrgent: true,
  posterId: "poster-001",
  posterName: "Ayesha Siddiqui",
  assignedTaskerId: undefined as string | undefined,
  createdAt: "2025-02-10T09:30:00Z",
};

const MOCK_BIDS = [
  {
    id: "bid-001",
    taskId: "task-001",
    taskerId: "tasker-001",
    taskerName: "Muhammad Bilal",
    taskerRating: 4.8,
    taskerVerified: "verified" as VerificationStatus,
    amountPkr: 3200,
    note: "I have experience moving heavy furniture. I'll bring a helper. We can finish in 3–4 hours easily.",
    commissionEstimatePkr: Math.round(3200 * COMMISSION_RATE_DEFAULT),
    submittedAt: "2025-02-10T10:15:00Z",
    status: "pending" as const,
    completedTasks: 47,
  },
  {
    id: "bid-002",
    taskId: "task-001",
    taskerId: "tasker-002",
    taskerName: "Ali Hassan",
    taskerRating: 4.5,
    taskerVerified: "verified" as VerificationStatus,
    amountPkr: 3500,
    note: "Professional mover with 3 years experience. I'll handle everything carefully.",
    commissionEstimatePkr: Math.round(3500 * COMMISSION_RATE_DEFAULT),
    submittedAt: "2025-02-10T11:00:00Z",
    status: "pending" as const,
    completedTasks: 31,
  },
  {
    id: "bid-003",
    taskId: "task-001",
    taskerId: "tasker-003",
    taskerName: "Usman Farooq",
    taskerRating: 4.2,
    taskerVerified: "submitted" as VerificationStatus,
    amountPkr: 2800,
    note: "I can do this job. Available on the date mentioned.",
    commissionEstimatePkr: Math.round(2800 * COMMISSION_RATE_DEFAULT),
    submittedAt: "2025-02-10T12:30:00Z",
    status: "pending" as const,
    completedTasks: 12,
  },
  {
    id: "bid-004",
    taskId: "task-001",
    taskerId: "tasker-004",
    taskerName: "Kamran Iqbal",
    taskerRating: 3.9,
    taskerVerified: "unverified" as VerificationStatus,
    amountPkr: 2500,
    note: "Cheapest rate. I am strong and hardworking.",
    commissionEstimatePkr: Math.round(2500 * COMMISSION_RATE_DEFAULT),
    submittedAt: "2025-02-10T14:00:00Z",
    status: "pending" as const,
    completedTasks: 3,
  },
];

const MOCK_MESSAGES = [
  {
    id: "msg-001",
    senderId: "tasker-001",
    senderName: "Muhammad Bilal",
    text: "Assalam o Alaikum! I am available on the 15th. Should I bring extra packing tape?",
    sentAt: "2025-02-10T10:20:00Z",
    isOwn: false,
  },
  {
    id: "msg-002",
    senderId: "poster-001",
    senderName: "Ayesha Siddiqui",
    text: "Walaikum Assalam! Yes please, and bring some bubble wrap if you have it.",
    sentAt: "2025-02-10T10:35:00Z",
    isOwn: true,
  },
];

// ─── Status badge color map ───────────────────────────────────────────────────

const STATUS_COLORS: Record<TaskStatus, string> = {
  draft: "bg-gray-100 text-gray-600 border-gray-200",
  open: "bg-blue-50 text-blue-700 border-blue-200",
  bid_received: "bg-amber-50 text-amber-700 border-amber-200",
  assigned: "bg-indigo-50 text-indigo-700 border-indigo-200",
  in_progress: "bg-purple-50 text-purple-700 border-purple-200",
  completion_requested: "bg-teal-50 text-teal-700 border-teal-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
  disputed: "bg-rose-50 text-rose-700 border-rose-200",
};

// ─── Star renderer ────────────────────────────────────────────────────────────

function StarRating({ rating, count }: { rating: number; count?: number }) {
  return (
    <span className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={cn(
            "w-3.5 h-3.5",
            s <= Math.round(rating)
              ? "fill-[var(--accent)] text-[var(--accent)]"
              : "fill-gray-200 text-gray-200"
          )}
        />
      ))}
      <span className="text-xs font-semibold text-[var(--foreground)] ml-0.5">{rating.toFixed(1)}</span>
      {count !== undefined && (
        <span className="text-xs text-[var(--muted-foreground)]">({count})</span>
      )}
    </span>
  );
}

// ─── Page component ───────────────────────────────────────────────────────────

export default function TaskDetailPage() {
  const [task, setTask] = useState(MOCK_TASK);
  const [bids, setBids] = useState(MOCK_BIDS);
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  function handleSelectBid(bidId: string) {
    setSelectedBidId(bidId);
    setTask((prev) => ({ ...prev, status: "assigned", assignedTaskerId: bidId }));
  }

  function handleStatusAction(action: "request_completion" | "cancel" | "dispute") {
    setActionLoading(action);
    setTimeout(() => {
      setTask((prev) => ({
        ...prev,
        status:
          action === "request_completion"
            ? "completion_requested"
            : action === "cancel"
            ? "cancelled"
            : "disputed",
      }));
      setActionLoading(null);
    }, 900);
  }

  function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = newMessage.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        senderId: "poster-001",
        senderName: "Ayesha Siddiqui",
        text,
        sentAt: new Date().toISOString(),
        isOwn: true,
      },
    ]);
    setNewMessage("");
  }

  const canSelectBid = task.status === "open" || task.status === "bid_received";
  const canRequestCompletion = task.status === "in_progress";
  const canCancel = ["open", "bid_received", "assigned"].includes(task.status);
  const canDispute = ["in_progress", "completion_requested"].includes(task.status);
  const showMessages = task.status !== "open" && task.status !== "bid_received" && task.status !== "draft";

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* ── Breadcrumb ── */}
      <div className="bg-[var(--card)] border-b border-[var(--border)]">
        <div className="container py-3">
          <nav className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[var(--primary)] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/my-tasks" className="hover:text-[var(--primary)] transition-colors">My Tasks</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[var(--foreground)] font-medium truncate max-w-[200px]">{task.title}</span>
          </nav>
        </div>
      </div>

      <div className="container py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* ── Task Header Card ── */}
            <Reveal>
              <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-[0_2px_12px_rgba(26,26,46,0.07)] overflow-hidden">
                {/* Accent top bar */}
                <div className="h-1.5 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]" />
                <div className="p-5 md:p-6">
                  {/* Status + Urgency row */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border",
                        STATUS_COLORS[task.status]
                      )}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                      {getStatusLabel(task.status)}
                    </span>
                    {task.isUrgent && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-[var(--accent)] text-white">
                        <Zap className="w-3 h-3" />
                        Urgent
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-xl md:text-2xl font-bold text-[var(--foreground)] leading-tight mb-4" style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}>
                    {task.title}
                  </h1>

                  {/* Info grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Category */}
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                      <div className="w-9 h-9 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] flex-shrink-0">
                        {getCategoryIcon(task.category as string)}
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)] font-semibold">Category</p>
                        <p className="text-sm font-semibold text-[var(--foreground)]">{getCategoryLabel(task.category as string)}</p>
                      </div>
                    </div>

                    {/* Budget */}
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                      <div className="w-9 h-9 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] flex-shrink-0">
                        <span className="text-base font-bold">₨</span>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)] font-semibold">Budget</p>
                        <p className="text-lg font-bold text-[var(--accent)]">{formatPkr(task.budgetPkr)}</p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                      <div className="w-9 h-9 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] flex-shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)] font-semibold">Location</p>
                        <p className="text-sm font-semibold text-[var(--foreground)]">{task.area}, {task.city}</p>
                        {task.destinationArea && (
                          <p className="text-xs text-[var(--muted-foreground)]">To: {task.destinationArea}</p>
                        )}
                      </div>
                    </div>

                    {/* Timing */}
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                      <div className="w-9 h-9 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] flex-shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)] font-semibold">Timing</p>
                        <p className="text-sm font-semibold text-[var(--foreground)]">{getTimingLabel(task.timing)}</p>
                        {task.preferredDate && (
                          <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3" />
                            {task.preferredDate}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* ── Poster Card ── */}
            <Reveal delay={0.05}>
              <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-[0_2px_8px_rgba(26,26,46,0.06)] p-4 flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                  {getInitials(task.posterName)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)] font-semibold mb-0.5">Posted by</p>
                  <p className="font-semibold text-[var(--foreground)] text-sm">{task.posterName}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{timeAgo(task.createdAt)}</p>
                </div>
                <div className="text-xs text-[var(--muted-foreground)] bg-[var(--background)] px-2.5 py-1 rounded-full border border-[var(--border)]">
                  #{task.id.slice(-4)}
                </div>
              </div>
            </Reveal>

            {/* ── Description ── */}
            <Reveal delay={0.08}>
              <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-[0_2px_8px_rgba(26,26,46,0.06)] p-5 md:p-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-3">Task Description</h2>
                <div className="border-l-4 border-[var(--primary)] pl-4">
                  <p className="text-[var(--foreground)] leading-relaxed text-sm md:text-base">{task.description}</p>
                </div>
              </div>
            </Reveal>

            {/* ── Bids Section ── */}
            <Reveal delay={0.1}>
              <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-[0_2px_8px_rgba(26,26,46,0.06)] p-5 md:p-6">
                {/* Section heading with Urdu */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-base font-bold text-[var(--foreground)]">
                      Bids Mili Hain
                      <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--primary)] text-white text-xs font-bold">
                        {bids.length}
                      </span>
                    </h2>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5" dir="rtl" style={{ fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif" }}>
                      موصول بولیاں
                    </p>
                  </div>
                  {canSelectBid && (
                    <span className="text-xs text-[var(--muted-foreground)] bg-[var(--background)] px-2.5 py-1 rounded-full border border-[var(--border)]">
                      Select the best offer
                    </span>
                  )}
                </div>

                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  {bids.map((bid) => {
                    const isSelected = selectedBidId === bid.id;
                    return (
                      <motion.div
                        key={bid.id}
                        variants={fadeInUp}
                        className={cn(
                          "rounded-xl border-2 p-4 transition-all duration-200",
                          isSelected
                            ? "border-[var(--primary)] bg-blue-50/60 shadow-[0_0_0_3px_rgba(27,108,168,0.12)]"
                            : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)]/40 hover:shadow-md"
                        )}
                      >
                        {/* Bid header */}
                        <div className="flex items-start gap-3 mb-3">
                          {/* Avatar */}
                          <div className="w-11 h-11 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
                            {getInitials(bid.taskerName)}
                          </div>

                          {/* Name + badges */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="font-bold text-[var(--foreground)] text-sm">{bid.taskerName}</span>
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                                  getVerificationColor(bid.taskerVerified)
                                )}
                              >
                                {getVerificationIcon(bid.taskerVerified)}
                                {getVerificationLabel(bid.taskerVerified)}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                              <StarRating rating={bid.taskerRating} />
                              <span className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                                <Award className="w-3 h-3" />
                                {bid.completedTasks} tasks done
                              </span>
                            </div>
                          </div>

                          {/* Bid amount */}
                          <div className="text-right flex-shrink-0">
                            <p className="text-xl font-bold text-[var(--accent)]">{formatPkr(bid.amountPkr)}</p>
                            <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">
                              Platform fee: {formatPkr(bid.commissionEstimatePkr)}
                            </p>
                          </div>
                        </div>

                        {/* Bid note */}
                        <div className="relative bg-white rounded-lg border border-[var(--border)] p-3 mb-3">
                          <Quote className="w-4 h-4 text-[var(--primary)]/30 absolute top-2 left-2" />
                          <p className="text-sm text-[var(--foreground)] leading-relaxed pl-5 italic">
                            {bid.note}
                          </p>
                        </div>

                        {/* Action */}
                        {canSelectBid && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-[var(--muted-foreground)]">
                              {timeAgo(bid.submittedAt)}
                            </span>
                            {isSelected ? (
                              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full">
                                <CheckCircle className="w-4 h-4" />
                                Selected
                              </span>
                            ) : (
                              <button
                                onClick={() => handleSelectBid(bid.id)}
                                className="btn-primary text-sm px-4 py-1.5 rounded-full"
                              >
                                Select This Tasker
                              </button>
                            )}
                          </div>
                        )}

                        {!canSelectBid && isSelected && (
                          <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                            <CheckCircle className="w-4 h-4" />
                            Assigned Tasker
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            </Reveal>

            {/* ── In-App Messages ── */}
            {showMessages && (
              <Reveal delay={0.12}>
                <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-[0_2px_8px_rgba(26,26,46,0.06)] p-5 md:p-6">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-4 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[var(--primary)]" />
                    In-App Messages
                  </h2>
                  <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex gap-2",
                          msg.isOwn ? "flex-row-reverse" : "flex-row"
                        )}
                      >
                        <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {getInitials(msg.senderName)}
                        </div>
                        <div
                          className={cn(
                            "max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                            msg.isOwn
                              ? "bg-[var(--primary)] text-white rounded-tr-sm"
                              : "bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-tl-sm"
                          )}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message... (contact info is redacted)"
                      className="flex-1 text-sm px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]"
                    />
                    <button type="submit" className="btn-primary px-4 py-2.5 rounded-xl text-sm">
                      Send
                    </button>
                  </form>
                  <p className="text-[10px] text-[var(--muted-foreground)] mt-2 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Phone numbers, emails, and social handles are automatically redacted.
                  </p>
                </div>
              </Reveal>
            )}
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="space-y-5">

            {/* ── Status Actions ── */}
            <Reveal>
              <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-[0_2px_12px_rgba(26,26,46,0.07)] p-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">Task Actions</h3>

                <div className="space-y-2.5">
                  {canRequestCompletion && (
                    <button
                      onClick={() => handleStatusAction("request_completion")}
                      disabled={actionLoading === "request_completion"}
                      className="w-full btn-primary flex items-center justify-center gap-2 rounded-xl py-2.5"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {actionLoading === "request_completion" ? "Requesting..." : "Request Completion"}
                    </button>
                  )}

                  {canCancel && (
                    <button
                      onClick={() => handleStatusAction("cancel")}
                      disabled={actionLoading === "cancel"}
                      className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors rounded-xl py-2.5"
                    >
                      <XCircle className="w-4 h-4" />
                      {actionLoading === "cancel" ? "Cancelling..." : "Cancel Task"}
                    </button>
                  )}

                  {canDispute && (
                    <button
                      onClick={() => handleStatusAction("dispute")}
                      disabled={actionLoading === "dispute"}
                      className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors rounded-xl py-2.5"
                    >
                      <Flag className="w-4 h-4" />
                      {actionLoading === "dispute" ? "Raising..." : "Raise Dispute"}
                    </button>
                  )}

                  {task.status === "completed" && (
                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl py-2.5 px-4">
                      <CheckCircle className="w-4 h-4" />
                      Task Completed
                    </div>
                  )}

                  {task.status === "cancelled" && (
                    <div className="flex items-center gap-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl py-2.5 px-4">
                      <XCircle className="w-4 h-4" />
                      Task Cancelled
                    </div>
                  )}

                  {task.status === "disputed" && (
                    <div className="flex items-center gap-2 text-sm font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl py-2.5 px-4">
                      <Flag className="w-4 h-4" />
                      Dispute Raised
                    </div>
                  )}

                  {task.status === "completion_requested" && (
                    <div className="flex items-center gap-2 text-sm font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-xl py-2.5 px-4">
                      <Clock className="w-4 h-4" />
                      Completion Requested
                    </div>
                  )}
                </div>

                {/* Quick links */}
                <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-2">
                  <Link
                    href="/dispute"
                    className="flex items-center gap-2 text-xs text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    Dispute & Cancellation Policy
                  </Link>
                  <Link
                    href="/ratings-reviews"
                    className="flex items-center gap-2 text-xs text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
                  >
                    <Star className="w-3.5 h-3.5" />
                    Leave a Review
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* ── Task Status Timeline ── */}
            <Reveal delay={0.06}>
              <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-[0_2px_8px_rgba(26,26,46,0.06)] p-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">Status Timeline</h3>
                <div className="space-y-0">
                  {([
                    { key: "open", label: "Open" },
                    { key: "bid_received", label: "Bids Received" },
                    { key: "assigned", label: "Tasker Assigned" },
                    { key: "in_progress", label: "In Progress" },
                    { key: "completion_requested", label: "Completion Requested" },
                    { key: "completed", label: "Completed" },
                  ] as { key: TaskStatus; label: string }[]).map((step, idx, arr) => {
                    const statuses: TaskStatus[] = [
                      "open", "bid_received", "assigned", "in_progress",
                      "completion_requested", "completed",
                    ];
                    const currentIdx = statuses.indexOf(task.status);
                    const stepIdx = statuses.indexOf(step.key);
                    const isDone = currentIdx >= stepIdx;
                    const isCurrent = task.status === step.key;
                    return (
                      <div key={step.key} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div
                            className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-colors",
                              isDone
                                ? "bg-[var(--primary)] border-[var(--primary)]"
                                : "bg-white border-[var(--border)]"
                            )}
                          >
                            {isDone && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                          </div>
                          {idx < arr.length - 1 && (
                            <div
                              className={cn(
                                "w-0.5 h-6 mt-0.5",
                                isDone ? "bg-[var(--primary)]" : "bg-[var(--border)]"
                              )}
                            />
                          )}
                        </div>
                        <p
                          className={cn(
                            "text-xs pt-1 pb-5 font-medium",
                            isCurrent
                              ? "text-[var(--primary)] font-bold"
                              : isDone
                              ? "text-[var(--foreground)]"
                              : "text-[var(--muted-foreground)]"
                          )}
                        >
                          {step.label}
                          {isCurrent && (
                            <span className="ml-1.5 text-[10px] bg-[var(--primary)] text-white px-1.5 py-0.5 rounded-full">Now</span>
                          )}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>

            {/* ── Trust Note ── */}
            <Reveal delay={0.1}>
              <div className="bg-gradient-to-br from-[var(--primary)] to-[#155a8a] rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-[var(--accent)]" />
                  <span className="text-sm font-bold">Stay Safe on Asan Kaam</span>
                </div>
                <p className="text-xs text-white/80 leading-relaxed">
                  Never share personal contact details in chat. All communication, payments, and dispute resolution happen inside the app for your protection.
                </p>
                <Link
                  href="/dispute"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] hover:underline"
                >
                  Learn about dispute resolution
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </main>
  );
}
