"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle, CheckCircle, Info, Wallet, TrendingUp, Clock, MapPin, Tag, ChevronRight, AlertTriangle } from 'lucide-react';
import { getStatusLabel, getStatusColor, TASK_CATEGORIES, TaskCategory } from "@/lib/data";
type COMMISSION_RATE_DEFAULT = any;
const COMMISSION_RATE_DEFAULT: any = [];
type BALANCE_MINIMUM_PKR = any;
const BALANCE_MINIMUM_PKR: any = [];
type BUDGET_MIN_PKR = any;
const BUDGET_MIN_PKR: any = [];
type BUDGET_MAX_PKR = any;
const BUDGET_MAX_PKR: any = [];
type formatPkr = any;
const formatPkr: any = [];
type Task = any;
const Task: any = [];
type TimingWindow = any;
const TimingWindow: any = [];
import { Reveal } from "@/components/Reveal";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_TASK: Task = {
  id: "task-001",
  title: "Move furniture from DHA Phase 5 to Gulshan-e-Iqbal",
  category: "moving_delivery",
  description:
    "Need help moving a sofa, 2 beds, a dining table, and 6 chairs from my old apartment in DHA Phase 5 to my new place in Gulshan-e-Iqbal Block 13. A pickup truck or small loader is preferred. Please bring at least one helper. The move should be completed in a single trip if possible.",
  city: "Karachi",
  area: "DHA Phase 5",
  budgetPkr: 4500,
  timing: "morning",
  preferredDate: "2025-02-15",
  status: "open",
  bidCount: 3,
  isUrgent: false,
  posterId: "poster-001",
  createdAt: "2025-02-10T09:00:00Z",
};

const MOCK_TASKER_BALANCE = 1200; // PKR — current mock balance

const TIMING_LABELS: Record<TimingWindow, string> = {
  morning: "Morning (8am – 12pm)",
  afternoon: "Afternoon (12pm – 5pm)",
  evening: "Evening (5pm – 9pm)",
  flexible: "Flexible",
  asap: "As Soon As Possible",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCategoryLabel(key: TaskCategory): string {
  return TASK_CATEGORIES.find((c) => c.key === key)?.label ?? key;
}

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

// ─── Sub-components (inline) ──────────────────────────────────────────────────

function InfoRow({
  label,
  value,
  highlight,
  destructive,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  destructive?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[var(--border)] last:border-0">
      <span className="text-sm text-[var(--muted-foreground)]">{label}</span>
      <span
        className={`text-sm font-semibold ${
          destructive
            ? "text-red-500"
            : highlight
            ? "text-[var(--brand-primary)]"
            : "text-[var(--foreground)]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: Task["status"] }) {
  const color = getStatusColor(status);
  const label = getStatusLabel(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BidSubmissionPage({
  params,
}: {
  params: { id: string };
}) {
  const task = MOCK_TASK; // In production: fetch by params.id
  const currentBalance = MOCK_TASKER_BALANCE;

  // Form state
  const [bidAmount, setBidAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Derived calculations
  const bidPkr = parseFloat(bidAmount) || 0;
  const isValidBid =
    bidPkr >= BUDGET_MIN_PKR && bidPkr <= BUDGET_MAX_PKR;
  const commissionPkr = Math.round(bidPkr * COMMISSION_RATE_DEFAULT);
  const reservedAmount = commissionPkr;
  const netEarning = bidPkr - commissionPkr;
  const shortfall = Math.max(0, reservedAmount - currentBalance);
  const hasInsufficientBalance = bidPkr > 0 && shortfall > 0;
  const canSubmit =
    isValidBid && acknowledged && !hasInsufficientBalance && note.trim().length >= 10;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    // Simulate async submission
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4">
        <Reveal>
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            className="max-w-md w-full bg-[var(--card)] border border-[var(--border)] rounded-2xl p-10 text-center shadow-[0_4px_32px_-8px_rgba(0,0,0,0.12)]"
          >
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
              Bid Submitted!
            </h2>
            <p className="text-[var(--muted-foreground)] mb-2">
              Your bid of{" "}
              <span className="font-semibold text-[var(--foreground)]">
                {formatPkr(bidPkr)}
              </span>{" "}
              has been sent to the poster.
            </p>
            <p className="text-sm text-[var(--muted-foreground)] mb-8">
              {formatPkr(reservedAmount)} has been reserved from your balance as
              a commission hold. You will be notified when the poster responds.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href={`/task/${params.id}`}
                className="w-full py-3 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-primary-foreground)] font-semibold text-sm hover:opacity-90 transition-opacity text-center"
              >
                View Task
              </Link>
              <Link
                href="/my-bids-tasker"
                className="w-full py-3 rounded-xl border border-[var(--border)] text-[var(--foreground)] font-semibold text-sm hover:bg-[var(--muted)] transition-colors text-center"
              >
                My Bids
              </Link>
            </div>
          </motion.div>
        </Reveal>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-3xl mx-auto px-4 py-10 md:py-16">
        {/* Back nav */}
        <Reveal>
          <Link
            href={`/task/${params.id}`}
            className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Task
          </Link>
        </Reveal>

        {/* Page heading */}
        <Reveal delay={0.05}>
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] tracking-tight mb-2">
              Submit Your Bid
            </h1>
            <p className="text-[var(--muted-foreground)] text-base leading-relaxed">
              Review the task details, set your price, and send a compelling
              note to the poster.
            </p>
          </div>
        </Reveal>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── Task Summary Card ── */}
          <Reveal delay={0.08}>
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)]">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <StatusBadge status={task.status} />
                    {task.isUrgent && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                        <AlertTriangle className="w-3 h-3" />
                        Urgent
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-[var(--foreground)] leading-snug">
                    {task.title}
                  </h2>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-[var(--muted-foreground)] mb-0.5">
                    Budget
                  </p>
                  <p className="text-xl font-bold text-[var(--brand-primary)]">
                    {formatPkr(task.budgetPkr)}
                  </p>
                </div>
              </div>

              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-5 line-clamp-3">
                {task.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                  <MapPin className="w-4 h-4 shrink-0 text-[var(--brand-primary)]" />
                  <span>
                    {task.area}, {task.city}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                  <Clock className="w-4 h-4 shrink-0 text-[var(--brand-primary)]" />
                  <span>{TIMING_LABELS[task.timing]}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                  <Tag className="w-4 h-4 shrink-0 text-[var(--brand-primary)]" />
                  <span>{getCategoryLabel(task.category)}</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* ── Bid Amount Input ── */}
          <Reveal delay={0.12}>
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)]">
              <h3 className="text-base font-semibold text-[var(--foreground)] mb-1">
                Your Bid Amount
              </h3>
              <p className="text-sm text-[var(--muted-foreground)] mb-4">
                Enter the amount you want to charge for this task. The poster
                has budgeted{" "}
                <span className="font-medium text-[var(--foreground)]">
                  {formatPkr(task.budgetPkr)}
                </span>
                .
              </p>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[var(--muted-foreground)]">
                  PKR
                </span>
                <input
                  type="number"
                  min={BUDGET_MIN_PKR}
                  max={BUDGET_MAX_PKR}
                  step={50}
                  value={bidAmount}
                  onChange={(e) => {
                    setBidAmount(e.target.value);
                    setError(null);
                  }}
                  placeholder="e.g. 4000"
                  className="w-full pl-14 pr-4 py-4 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] text-lg font-semibold placeholder:text-[var(--muted-foreground)] placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40 focus:border-[var(--brand-primary)] transition-all"
                />
              </div>

              {bidAmount && !isValidBid && (
                <p className="mt-2 text-xs text-red-500 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Bid must be between {formatPkr(BUDGET_MIN_PKR)} and{" "}
                  {formatPkr(BUDGET_MAX_PKR)}.
                </p>
              )}

              <div className="mt-3 flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>
                  Allowed range: {formatPkr(BUDGET_MIN_PKR)} –{" "}
                  {formatPkr(BUDGET_MAX_PKR)}
                </span>
              </div>
            </div>
          </Reveal>

          {/* ── Pre-Bid Transparency Card ── */}
          {bidPkr > 0 && isValidBid && (
            <Reveal delay={0.14}>
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-[var(--brand-primary)]" />
                  <h3 className="text-base font-semibold text-[var(--foreground)]">
                    Earnings Breakdown
                  </h3>
                </div>

                <div className="divide-y divide-[var(--border)]">
                  <InfoRow
                    label="Task Budget (Poster)"
                    value={formatPkr(task.budgetPkr)}
                  />
                  <InfoRow
                    label="Your Bid"
                    value={formatPkr(bidPkr)}
                    highlight
                  />
                  <InfoRow
                    label={`Platform Commission (${Math.round(COMMISSION_RATE_DEFAULT * 100)}%)`}
                    value={`– ${formatPkr(commissionPkr)}`}
                    destructive
                  />
                  <InfoRow
                    label="Amount Reserved on Assignment"
                    value={formatPkr(reservedAmount)}
                  />
                  <InfoRow
                    label="Your Net Earning"
                    value={formatPkr(netEarning)}
                    highlight
                  />
                </div>

                <div className="mt-4 p-3 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                    Commission is reserved from your balance when the poster
                    assigns you. It is deducted upon task completion and
                    released if the task is cancelled before work begins.
                  </p>
                </div>
              </motion.div>
            </Reveal>
          )}

          {/* ── Balance Status Card ── */}
          {bidPkr > 0 && isValidBid && (
            <Reveal delay={0.16}>
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className={`rounded-2xl p-6 border shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)] ${
                  hasInsufficientBalance
                    ? "bg-red-50 border-red-200"
                    : "bg-green-50 border-green-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      hasInsufficientBalance
                        ? "bg-red-100"
                        : "bg-green-100"
                    }`}
                  >
                    <Wallet
                      className={`w-5 h-5 ${
                        hasInsufficientBalance
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`font-semibold text-sm mb-1 ${
                        hasInsufficientBalance
                          ? "text-red-700"
                          : "text-green-700"
                      }`}
                    >
                      {hasInsufficientBalance
                        ? "Insufficient Balance"
                        : "Balance Sufficient"}
                    </h4>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span
                          className={
                            hasInsufficientBalance
                              ? "text-red-600"
                              : "text-green-600"
                          }
                        >
                          Current Balance
                        </span>
                        <span
                          className={`font-semibold ${
                            hasInsufficientBalance
                              ? "text-red-700"
                              : "text-green-700"
                          }`}
                        >
                          {formatPkr(currentBalance)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span
                          className={
                            hasInsufficientBalance
                              ? "text-red-600"
                              : "text-green-600"
                          }
                        >
                          Required Reserve
                        </span>
                        <span
                          className={`font-semibold ${
                            hasInsufficientBalance
                              ? "text-red-700"
                              : "text-green-700"
                          }`}
                        >
                          {formatPkr(reservedAmount)}
                        </span>
                      </div>
                      {hasInsufficientBalance && (
                        <div className="flex justify-between text-sm border-t border-red-200 pt-1 mt-1">
                          <span className="text-red-600 font-medium">
                            Shortfall
                          </span>
                          <span className="font-bold text-red-700">
                            {formatPkr(shortfall)}
                          </span>
                        </div>
                      )}
                    </div>

                    {hasInsufficientBalance && (
                      <div className="mt-4">
                        <p className="text-xs text-red-600 mb-3 leading-relaxed">
                          You need at least{" "}
                          <strong>{formatPkr(reservedAmount)}</strong> in your
                          balance to bid on this task. Top up{" "}
                          <strong>{formatPkr(shortfall)}</strong> or more to
                          continue.
                        </p>
                        <Link
                          href="/tasker-balance-transaction-history"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
                        >
                          <Wallet className="w-4 h-4" />
                          Top Up Balance
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    )}

                    {!hasInsufficientBalance && (
                      <p className="text-xs text-green-600 mt-2">
                        Your balance covers the commission reserve. You are
                        good to bid.
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </Reveal>
          )}

          {/* ── Minimum Balance Notice ── */}
          <Reveal delay={0.18}>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
              <Info className="w-4 h-4 text-[var(--muted-foreground)] shrink-0 mt-0.5" />
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                Taskers must maintain a minimum balance of{" "}
                <span className="font-semibold text-[var(--foreground)]">
                  {formatPkr(BALANCE_MINIMUM_PKR)}
                </span>{" "}
                at all times. Commission is reserved when you are assigned and
                deducted upon task completion.
              </p>
            </div>
          </Reveal>

          {/* ── Note to Poster ── */}
          <Reveal delay={0.2}>
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)]">
              <h3 className="text-base font-semibold text-[var(--foreground)] mb-1">
                Note to Poster
              </h3>
              <p className="text-sm text-[var(--muted-foreground)] mb-4">
                Explain why you are the right person for this task. Mention
                your experience, availability, and any relevant skills.
              </p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={5}
                maxLength={500}
                placeholder="e.g. I have a pickup truck and a helper available. I have done 12 similar moves in Karachi. I can start tomorrow morning at 8am."
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40 focus:border-[var(--brand-primary)] transition-all resize-none leading-relaxed"
              />
              <div className="flex items-center justify-between mt-2">
                {note.trim().length > 0 && note.trim().length < 10 ? (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Please write at least 10 characters.
                  </p>
                ) : (
                  <span />
                )}
                <p className="text-xs text-[var(--muted-foreground)] ml-auto">
                  {note.length}/500
                </p>
              </div>

              <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200">
                <p className="text-xs text-amber-700 leading-relaxed flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  Do not share phone numbers, email addresses, WhatsApp links,
                  or social media handles. Contact details are exchanged only
                  after task assignment through the secure in-app chat.
                </p>
              </div>
            </div>
          </Reveal>

          {/* ── Acknowledgement & Submit ── */}
          <Reveal delay={0.22}>
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)]">
              <h3 className="text-base font-semibold text-[var(--foreground)] mb-4">
                Confirm Your Bid
              </h3>

              <label className="flex items-start gap-3 cursor-pointer group mb-6">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={acknowledged}
                    onChange={(e) => setAcknowledged(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      acknowledged
                        ? "bg-[var(--brand-primary)] border-[var(--brand-primary)]"
                        : "border-[var(--border)] bg-[var(--background)] group-hover:border-[var(--brand-primary)]"
                    }`}
                  >
                    {acknowledged && (
                      <svg
                        className="w-3 h-3 text-[var(--brand-primary-foreground)]"
                        fill="none"
                        viewBox="0 0 12 12"
                      >
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                  I understand that submitting this bid will reserve{" "}
                  <strong className="text-[var(--foreground)]">
                    {bidPkr > 0 && isValidBid
                      ? formatPkr(reservedAmount)
                      : "the commission amount"}
                  </strong>{" "}
                  from my balance upon assignment. I agree to complete the task
                  as described and abide by the Asan Kaam community guidelines.
                </span>
              </label>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              {hasInsufficientBalance && bidPkr > 0 && isValidBid ? (
                <Link
                  href="/tasker-balance-transaction-history"
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-red-600 text-white font-semibold text-base hover:bg-red-700 transition-colors"
                >
                  <Wallet className="w-5 h-5" />
                  Top Up {formatPkr(shortfall)} to Continue
                </Link>
              ) : (
                <motion.button
                  type="submit"
                  disabled={!canSubmit || submitting}
                  whileHover={canSubmit ? { scale: 1.01 } : {}}
                  whileTap={canSubmit ? { scale: 0.99 } : {}}
                  className={`w-full py-4 rounded-xl font-semibold text-base transition-all ${
                    canSubmit
                      ? "bg-[var(--brand-primary)] text-[var(--brand-primary-foreground)] hover:opacity-90 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.2)]"
                      : "bg-[var(--muted)] text-[var(--muted-foreground)] cursor-not-allowed"
                  }`}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Submitting Bid...
                    </span>
                  ) : (
                    "Submit Bid"
                  )}
                </motion.button>
              )}

              {!canSubmit && !hasInsufficientBalance && (
                <ul className="mt-3 space-y-1">
                  {(!bidAmount || !isValidBid) && (
                    <li className="text-xs text-[var(--muted-foreground)] flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[var(--muted-foreground)]" />
                      Enter a valid bid amount
                    </li>
                  )}
                  {note.trim().length < 10 && (
                    <li className="text-xs text-[var(--muted-foreground)] flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[var(--muted-foreground)]" />
                      Write a note to the poster (min. 10 characters)
                    </li>
                  )}
                  {!acknowledged && (
                    <li className="text-xs text-[var(--muted-foreground)] flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[var(--muted-foreground)]" />
                      Check the acknowledgement box
                    </li>
                  )}
                </ul>
              )}
            </div>
          </Reveal>
        </form>
      </div>
    </div>
  );
}