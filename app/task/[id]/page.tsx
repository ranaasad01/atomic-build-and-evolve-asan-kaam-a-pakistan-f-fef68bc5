"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Star, CheckCircle, AlertCircle, ChevronRight, Shield, Zap, MessageSquare, XCircle, Flag, User, Calendar, DollarSign, ArrowRight, Check } from 'lucide-react';
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import { getStatusLabel, getStatusColor, TaskStatus, VerificationStatus, TaskCategory } from "@/lib/data";
type formatPkr = any;
const formatPkr: any = [];
type getVerificationLabel = any;
const getVerificationLabel: any = [];
type getVerificationColor = any;
const getVerificationColor: any = [];
type COMMISSION_RATE_DEFAULT = any;
const COMMISSION_RATE_DEFAULT: any = [];
type TimingWindow = any;
const TimingWindow: any = [];

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

const MOCK_HISTORY = [
  {
    id: "h1",
    timestamp: "2025-02-10T09:30:00Z",
    event: "Task posted",
    detail: "Task created and published as open.",
    actor: "Ayesha Siddiqui",
  },
  {
    id: "h2",
    timestamp: "2025-02-10T09:35:00Z",
    event: "Urgency boost applied",
    detail: "Poster applied urgency boost (Rs 99) for higher visibility.",
    actor: "Ayesha Siddiqui",
  },
  {
    id: "h3",
    timestamp: "2025-02-10T10:15:00Z",
    event: "Bid received",
    detail: "Muhammad Bilal placed a bid of Rs 3,200.",
    actor: "Muhammad Bilal",
  },
  {
    id: "h4",
    timestamp: "2025-02-10T11:00:00Z",
    event: "Bid received",
    detail: "Ali Hassan placed a bid of Rs 3,500.",
    actor: "Ali Hassan",
  },
  {
    id: "h5",
    timestamp: "2025-02-10T12:30:00Z",
    event: "Bid received",
    detail: "Usman Farooq placed a bid of Rs 2,800.",
    actor: "Usman Farooq",
  },
  {
    id: "h6",
    timestamp: "2025-02-10T14:00:00Z",
    event: "Bid received",
    detail: "Kamran Iqbal placed a bid of Rs 2,500.",
    actor: "Kamran Iqbal",
  },
];

// ─── State machine steps ──────────────────────────────────────────────────────

const STATUS_STEPS: TaskStatus[] = [
  "open",
  "bid_received",
  "assigned",
  "in_progress",
  "completion_requested",
  "completed",
];

const STATUS_LABELS: Record<TaskStatus, string> = {
  draft: "Draft",
  open: "Open",
  bid_received: "Bids In",
  assigned: "Assigned",
  in_progress: "In Progress",
  completion_requested: "Completion Requested",
  completed: "Completed",
  cancelled: "Cancelled",
  disputed: "Disputed",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-PK", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={cn(
            "h-3.5 w-3.5",
            s <= Math.round(rating)
              ? "fill-[var(--brand-accent)] text-[var(--brand-accent)]"
              : "fill-transparent text-gray-300"
          )}
        />
      ))}
      <span className="ml-1 text-xs text-gray-500">{rating.toFixed(1)}</span>
    </span>
  );
}

function VerificationBadge({ status }: { status: VerificationStatus }) {
  const colorMap: Record<VerificationStatus, string> = {
    verified: "bg-emerald-50 text-emerald-700 border-emerald-200",
    submitted: "bg-amber-50 text-amber-700 border-amber-200",
    unverified: "bg-gray-50 text-gray-500 border-gray-200",
    restricted: "bg-red-50 text-red-700 border-red-200",
  };
  const iconMap: Record<VerificationStatus, React.ReactNode> = {
    verified: <Shield className="h-3 w-3" />,
    submitted: <Clock className="h-3 w-3" />,
    unverified: <User className="h-3 w-3" />,
    restricted: <XCircle className="h-3 w-3" />,
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        colorMap[status]
      )}
    >
      {iconMap[status]}
      {getVerificationLabel(status)}
    </span>
  );
}

function StatusChip({ status }: { status: TaskStatus }) {
  const colorMap: Record<TaskStatus, string> = {
    draft: "bg-gray-100 text-gray-600 border-gray-200",
    open: "bg-blue-50 text-blue-700 border-blue-200",
    bid_received: "bg-violet-50 text-violet-700 border-violet-200",
    assigned: "bg-indigo-50 text-indigo-700 border-indigo-200",
    in_progress: "bg-amber-50 text-amber-700 border-amber-200",
    completion_requested: "bg-orange-50 text-orange-700 border-orange-200",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-red-50 text-red-600 border-red-200",
    disputed: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold",
        colorMap[status]
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {STATUS_LABELS[status]}
    </span>
  );
}

// ─── Status Timeline ──────────────────────────────────────────────────────────

function StatusTimeline({ currentStatus }: { currentStatus: TaskStatus }) {
  const isTerminal =
    currentStatus === "cancelled" || currentStatus === "disputed";
  const currentIndex = STATUS_STEPS.indexOf(currentStatus);

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max items-center gap-0 py-2">
        {STATUS_STEPS.map((step, i) => {
          const isDone = !isTerminal && currentIndex > i;
          const isActive = !isTerminal && currentIndex === i;
          const isFuture = isTerminal || currentIndex < i;

          return (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all",
                    isDone &&
                      "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white",
                    isActive &&
                      "border-[var(--brand-primary)] bg-white text-[var(--brand-primary)] shadow-md",
                    isFuture && "border-gray-200 bg-gray-50 text-gray-400"
                  )}
                >
                  {isDone ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span
                  className={cn(
                    "max-w-[72px] text-center text-[10px] font-medium leading-tight",
                    isDone && "text-[var(--brand-primary)]",
                    isActive && "text-[var(--brand-primary)] font-semibold",
                    isFuture && "text-gray-400"
                  )}
                >
                  {STATUS_LABELS[step]}
                </span>
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div
                  className={cn(
                    "mx-1 h-0.5 w-10 rounded-full transition-all",
                    isDone
                      ? "bg-[var(--brand-primary)]"
                      : "bg-gray-200"
                  )}
                />
              )}
            </div>
          );
        })}

        {isTerminal && (
          <>
            <div className="mx-1 h-0.5 w-10 rounded-full bg-red-200" />
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-red-400 bg-red-50 text-red-500">
                {currentStatus === "cancelled" ? (
                  <XCircle className="h-4 w-4" />
                ) : (
                  <Flag className="h-4 w-4" />
                )}
              </div>
              <span className="max-w-[72px] text-center text-[10px] font-semibold text-red-500">
                {STATUS_LABELS[currentStatus]}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Bid Row ──────────────────────────────────────────────────────────────────

function BidRow({
  bid,
  isPoster,
  onAccept,
}: {
  bid: (typeof MOCK_BIDS)[0];
  isPoster: boolean;
  onAccept: (bidId: string) => void;
}) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="group border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
    >
      <td className="py-4 pl-4 pr-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-primary)]/10 text-sm font-bold text-[var(--brand-primary)]">
            {bid.taskerName.charAt(0)}
          </div>
          <div>
            <Link
              href={`/tasker-profile`}
              className="text-sm font-semibold text-gray-900 hover:text-[var(--brand-primary)] transition-colors"
            >
              {bid.taskerName}
            </Link>
            <p className="text-xs text-gray-500">{bid.completedTasks} tasks done</p>
          </div>
        </div>
      </td>
      <td className="px-3 py-4">
        <VerificationBadge status={bid.taskerVerified} />
      </td>
      <td className="px-3 py-4">
        <StarRating rating={bid.taskerRating} />
      </td>
      <td className="px-3 py-4">
        <span className="text-base font-bold text-gray-900">
          {formatPkr(bid.amountPkr)}
        </span>
        <p className="text-xs text-gray-400">
          Commission: {formatPkr(bid.commissionEstimatePkr)}
        </p>
      </td>
      <td className="px-3 py-4 max-w-[200px]">
        <p className="text-xs text-gray-600 line-clamp-2">{bid.note}</p>
      </td>
      <td className="py-4 pl-3 pr-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <Link
            href="/in-app-messaging-chat"
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-all"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Chat
          </Link>
          {isPoster && (
            <button
              onClick={() => onAccept(bid.id)}
              className="inline-flex items-center gap-1 rounded-lg bg-[var(--brand-primary)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--brand-primary-dark)] transition-all shadow-sm"
            >
              <Check className="h-3.5 w-3.5" />
              Accept
            </button>
          )}
        </div>
      </td>
    </motion.tr>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TaskDetailPage() {
  const t = useTranslations();
  const task = MOCK_TASK;
  const bids = MOCK_BIDS;
  const history = MOCK_HISTORY;

  // Simulate poster role for demo
  const [viewerRole, setViewerRole] = useState<"poster" | "tasker">("poster");
  const [acceptedBidId, setAcceptedBidId] = useState<string | null>(null);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<TaskStatus>(task.status);

  const isPoster = viewerRole === "poster";

  function handleAcceptBid(bidId: string) {
    setAcceptedBidId(bidId);
    setCurrentStatus("assigned");
  }

  function handleRequestCompletion() {
    setCurrentStatus("completion_requested");
  }

  function handleConfirmComplete() {
    setCurrentStatus("completed");
  }

  function handleCancel() {
    setCurrentStatus("cancelled");
    setShowCancelModal(false);
  }

  function handleDispute() {
    setCurrentStatus("disputed");
    setShowDisputeModal(false);
  }

  const timingLabels: Record<TimingWindow, string> = {
    morning: "Morning (8am – 12pm)",
    afternoon: "Afternoon (12pm – 5pm)",
    evening: "Evening (5pm – 9pm)",
    flexible: "Flexible",
    asap: "ASAP",
  };

  const categoryLabels: Record<string, string> = {
    errands: "Errands & Shopping",
    moving_delivery: "Moving & Delivery",
    cleaning: "Cleaning",
    small_repairs: "Small Repairs",
    queue_standing: "Queue Standing",
    digital_help: "Digital Help",
    household_assistance: "Household Assistance",
    other: "Other",
  };

  return (
    <main className="min-h-screen bg-[var(--surface-muted)] pb-20">
      {/* Role toggle for demo */}
      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2">
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <Link href="/" className="hover:text-[var(--brand-primary)] transition-colors">
              {t("taskDetail.breadcrumbHome")}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-gray-900">{t("taskDetail.breadcrumbTask")}</span>
          </nav>
          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 p-1">
            <button
              onClick={() => setViewerRole("poster")}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-all",
                viewerRole === "poster"
                  ? "bg-[var(--brand-primary)] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {t("taskDetail.viewAsPoster")}
            </button>
            <button
              onClick={() => setViewerRole("tasker")}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-all",
                viewerRole === "tasker"
                  ? "bg-[var(--brand-primary)] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {t("taskDetail.viewAsTasker")}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">

        {/* ── Task Header ── */}
        <Reveal>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <StatusChip status={currentStatus} />
                  {task.isUrgent && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                      <Zap className="h-3 w-3 fill-amber-500" />
                      {t("taskDetail.urgentBadge")}
                    </span>
                  )}
                  <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                    {categoryLabels[task.category]}
                  </span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 text-balance">
                  {task.title}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  {t("taskDetail.postedBy")} <span className="font-medium text-gray-700">{task.posterName}</span> &middot; {formatDate(task.createdAt)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">{t("taskDetail.budget")}</p>
                  <p className="text-3xl font-extrabold text-[var(--brand-primary)]">
                    {formatPkr(task.budgetPkr)}
                  </p>
                </div>
                <p className="text-xs text-gray-400">{task.bidCount} {t("taskDetail.bidsReceived")}</p>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                {t("taskDetail.taskProgress")}
              </p>
              <StatusTimeline currentStatus={currentStatus} />
            </div>
          </div>
        </Reveal>

        {/* ── Details + Info Panel ── */}
        <Reveal delay={0.05}>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Description */}
            <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)]">
              <h2 className="mb-3 text-base font-semibold text-gray-900">
                {t("taskDetail.descriptionTitle")}
              </h2>
              <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                {task.description}
              </p>
            </div>

            {/* Info Panel */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)] space-y-4">
              <h2 className="text-base font-semibold text-gray-900">
                {t("taskDetail.taskInfo")}
              </h2>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-primary)]" />
                  <div>
                    <p className="text-xs text-gray-400">{t("taskDetail.location")}</p>
                    <p className="text-sm font-medium text-gray-800">
                      {task.area}, {task.city}
                    </p>
                    {task.destinationArea && (
                      <p className="text-xs text-gray-500">
                        → {task.destinationArea}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-primary)]" />
                  <div>
                    <p className="text-xs text-gray-400">{t("taskDetail.timing")}</p>
                    <p className="text-sm font-medium text-gray-800">
                      {timingLabels[task.timing]}
                    </p>
                  </div>
                </div>

                {task.preferredDate && (
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-primary)]" />
                    <div>
                      <p className="text-xs text-gray-400">{t("taskDetail.preferredDate")}</p>
                      <p className="text-sm font-medium text-gray-800">
                        {formatDate(task.preferredDate)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <DollarSign className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-primary)]" />
                  <div>
                    <p className="text-xs text-gray-400">{t("taskDetail.budget")}</p>
                    <p className="text-sm font-medium text-gray-800">
                      {formatPkr(task.budgetPkr)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {t("taskDetail.commissionNote", { rate: Math.round(COMMISSION_RATE_DEFAULT * 100) })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tasker CTA */}
              {!isPoster && currentStatus === "open" && (
                <Link
                  href={`/task/${task.id}/bid`}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-4 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-primary-dark)] transition-all shadow-sm"
                >
                  {t("taskDetail.placeBid")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              {!isPoster && currentStatus === "bid_received" && (
                <Link
                  href={`/task/${task.id}/bid`}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-4 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-primary-dark)] transition-all shadow-sm"
                >
                  {t("taskDetail.placeBid")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        </Reveal>

        {/* ── Bid Comparison Table ── */}
        {(currentStatus === "bid_received" || currentStatus === "open") && (
          <Reveal delay={0.08}>
            <div className="rounded-2xl border border-gray-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)] overflow-hidden">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    {t("taskDetail.bidsTitle")}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {bids.length} {t("taskDetail.bidsSubtitle")}
                  </p>
                </div>
                {isPoster && (
                  <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 border border-violet-200">
                    {t("taskDetail.selectTasker")}
                  </span>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="py-3 pl-4 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                        {t("taskDetail.colTasker")}
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                        {t("taskDetail.colVerification")}
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                        {t("taskDetail.colRating")}
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                        {t("taskDetail.colBid")}
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                        {t("taskDetail.colNote")}
                      </th>
                      <th className="py-3 pl-3 pr-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">
                        {t("taskDetail.colAction")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bids.map((bid) => (
                      <BidRow
                        key={bid.id}
                        bid={bid}
                        isPoster={isPoster}
                        onAccept={handleAcceptBid}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>
        )}

        {/* ── Assigned Tasker Card ── */}
        {(currentStatus === "assigned" ||
          currentStatus === "in_progress" ||
          currentStatus === "completion_requested" ||
          currentStatus === "completed") &&
          acceptedBidId && (
            <Reveal delay={0.08}>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)]">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <h2 className="text-base font-semibold text-emerald-800">
                    {t("taskDetail.assignedTasker")}
                  </h2>
                </div>
                {(() => {
                  const accepted = bids.find((b) => b.id === acceptedBidId);
                  if (!accepted) return null;
                  return (
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-200 text-lg font-bold text-emerald-800">
                          {accepted.taskerName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-emerald-900">{accepted.taskerName}</p>
                          <StarRating rating={accepted.taskerRating} />
                          <VerificationBadge status={accepted.taskerVerified} />
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-emerald-600">{t("taskDetail.agreedAmount")}</p>
                        <p className="text-2xl font-extrabold text-emerald-800">
                          {formatPkr(accepted.amountPkr)}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </Reveal>
          )}

        {/* ── Action Buttons ── */}
        <Reveal delay={0.1}>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)]">
            <h2 className="mb-4 text-base font-semibold text-gray-900">
              {t("taskDetail.actionsTitle")}
            </h2>
            <div className="flex flex-wrap gap-3">
              {/* Poster actions */}
              {isPoster && currentStatus === "in_progress" && (
                <button
                  onClick={handleRequestCompletion}
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-primary-dark)] transition-all shadow-sm"
                >
                  <CheckCircle className="h-4 w-4" />
                  {t("taskDetail.actionRequestCompletion")}
                </button>
              )}
              {isPoster && currentStatus === "completion_requested" && (
                <button
                  onClick={handleConfirmComplete}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-all shadow-sm"
                >
                  <Check className="h-4 w-4" />
                  {t("taskDetail.actionConfirmComplete")}
                </button>
              )}
              {isPoster &&
                (currentStatus === "assigned" ||
                  currentStatus === "in_progress") && (
                  <button
                    onClick={() => setShowDisputeModal(true)}
                    className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-5 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-100 transition-all"
                  >
                    <Flag className="h-4 w-4" />
                    {t("taskDetail.actionOpenDispute")}
                  </button>
                )}
              {(currentStatus === "open" ||
                currentStatus === "bid_received" ||
                currentStatus === "assigned") && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all"
                >
                  <XCircle className="h-4 w-4" />
                  {t("taskDetail.actionCancel")}
                </button>
              )}
              {currentStatus === "completed" && (
                <Link
                  href="/ratings-reviews"
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-5 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-100 transition-all"
                >
                  <Star className="h-4 w-4" />
                  {t("taskDetail.actionLeaveReview")}
                </Link>
              )}
              {currentStatus === "cancelled" && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <XCircle className="h-4 w-4 text-red-400" />
                  {t("taskDetail.taskCancelledNote")}
                </div>
              )}
              {currentStatus === "disputed" && (
                <div className="flex items-center gap-2 text-sm text-rose-600">
                  <AlertCircle className="h-4 w-4" />
                  {t("taskDetail.taskDisputedNote")}
                </div>
              )}
              {/* Tasker: mark in progress */}
              {!isPoster && currentStatus === "assigned" && (
                <button
                  onClick={() => setCurrentStatus("in_progress")}
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-primary-dark)] transition-all shadow-sm"
                >
                  <ArrowRight className="h-4 w-4" />
                  {t("taskDetail.actionMarkInProgress")}
                </button>
              )}
              {/* Always show message link when assigned */}
              {(currentStatus === "assigned" ||
                currentStatus === "in_progress" ||
                currentStatus === "completion_requested") && (
                <Link
                  href="/in-app-messaging-chat"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-all"
                >
                  <MessageSquare className="h-4 w-4" />
                  {t("taskDetail.actionMessage")}
                </Link>
              )}
            </div>
          </div>
        </Reveal>

        {/* ── Task History Timeline ── */}
        <Reveal delay={0.12}>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)]">
            <h2 className="mb-5 text-base font-semibold text-gray-900">
              {t("taskDetail.historyTitle")}
            </h2>
            <div className="relative max-h-80 overflow-y-auto pr-2">
              <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gray-100" />
              <div className="space-y-5">
                {history.map((item, i) => (
                  <div key={item.id} className="relative flex gap-4 pl-10">
                    <div className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-100 bg-white">
                      <div className="h-2.5 w-2.5 rounded-full bg-[var(--brand-primary)]" />
                    </div>
                    <div className="flex-1 pb-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-900">
                          {item.event}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(item.timestamp)} {formatTime(item.timestamp)}
                        </p>
                      </div>
                      <p className="mt-0.5 text-xs text-gray-600">{item.detail}</p>
                      <p className="mt-0.5 text-xs text-gray-400">
                        {t("taskDetail.historyBy")} {item.actor}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── Cancel Modal ── */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {t("taskDetail.cancelModalTitle")}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {t("taskDetail.cancelModalBody")}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelModal(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
              >
                {t("taskDetail.cancelModalKeep")}
              </button>
              <button
                onClick={handleCancel}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-all"
              >
                {t("taskDetail.cancelModalConfirm")}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── Dispute Modal ── */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {t("taskDetail.disputeModalTitle")}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {t("taskDetail.disputeModalBody")}
            </p>
            <textarea
              className="w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-800 placeholder-gray-400 focus:border-[var(--brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20 resize-none"
              rows={3}
              placeholder={t("taskDetail.disputeModalPlaceholder")}
            />
            <div className="mt-4 flex gap-3 justify-end">
              <button
                onClick={() => setShowDisputeModal(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
              >
                {t("taskDetail.disputeModalCancel")}
              </button>
              <button
                onClick={handleDispute}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition-all"
              >
                {t("taskDetail.disputeModalSubmit")}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}