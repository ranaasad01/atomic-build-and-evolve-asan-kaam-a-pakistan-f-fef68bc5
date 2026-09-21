"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle, Clock, FileText, MessageSquare, ChevronDown, Send, Shield, Info, Phone, XCircle, RotateCcw } from 'lucide-react';
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/motion";

// ─── Types ───────────────────────────────────────────────────────────────────

type DisputeStatus = "open" | "under_review" | "resolved";

interface DisputeCase {
  id: string;
  taskTitle: string;
  taskId: string;
  reason: string;
  submittedDate: string;
  lastUpdate: string;
  status: DisputeStatus;
  amount: number;
  otherParty: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_DISPUTES: DisputeCase[] = [
  {
    id: "d-001",
    taskTitle: "Deep clean 3-bedroom apartment before handover",
    taskId: "task-003",
    reason: "Work not completed as agreed",
    submittedDate: "12 Jun 2025",
    lastUpdate: "14 Jun 2025",
    status: "under_review",
    amount: 3200,
    otherParty: "Usman Farooq",
  },
  {
    id: "d-002",
    taskTitle: "Grocery run from Imtiaz Store, Gulshan",
    taskId: "task-001",
    reason: "Tasker did not show up",
    submittedDate: "5 Jun 2025",
    lastUpdate: "8 Jun 2025",
    status: "resolved",
    amount: 600,
    otherParty: "Ali Hassan",
  },
  {
    id: "d-003",
    taskTitle: "Fix leaking kitchen tap and replace bathroom flush",
    taskId: "task-004",
    reason: "Quality of work unsatisfactory",
    submittedDate: "18 Jun 2025",
    lastUpdate: "18 Jun 2025",
    status: "open",
    amount: 1200,
    otherParty: "Kamran Iqbal",
  },
];

const MOCK_TASKS = [
  { id: "task-001", title: "Grocery run from Imtiaz Store, Gulshan" },
  { id: "task-003", title: "Deep clean 3-bedroom apartment before handover" },
  { id: "task-004", title: "Fix leaking kitchen tap and replace bathroom flush" },
  { id: "task-007", title: "Ironing and folding laundry — 2 bags" },
];

const DISPUTE_REASONS = [
  "Work not completed as agreed",
  "Tasker did not show up",
  "Quality of work unsatisfactory",
  "Tasker was rude or unprofessional",
  "Overcharged beyond agreed amount",
  "Task completed but payment not released",
  "Other",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPKR(amount: number): string {
  return `Rs ${(amount ?? 0).toLocaleString("en-PK")}`;
}

function getStatusConfig(status: DisputeStatus): {
  label: string;
  urdu: string;
  bg: string;
  text: string;
  border: string;
  icon: React.ElementType;
} {
  switch (status) {
    case "open":
      return {
        label: "Open",
        urdu: "کھلا",
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        icon: AlertTriangle,
      };
    case "under_review":
      return {
        label: "Under Review",
        urdu: "زیر جائزہ",
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        icon: Clock,
      };
    case "resolved":
      return {
        label: "Resolved",
        urdu: "حل شدہ",
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        icon: CheckCircle,
      };
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: DisputeStatus }) {
  const cfg = getStatusConfig(status);
  const Icon = cfg.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
        cfg.bg,
        cfg.text,
        cfg.border
      )}
    >
      <Icon className="w-3 h-3" aria-hidden="true" />
      {cfg.label}
      <span className="opacity-60 font-normal">· {cfg.urdu}</span>
    </span>
  );
}

function DisputeCard({ dispute }: { dispute: DisputeCase }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      variants={fadeInUp}
      className="card overflow-hidden"
    >
      {/* Status accent bar */}
      <div
        className={cn(
          "h-1 w-full",
          dispute.status === "open"
            ? "bg-amber-400"
            : dispute.status === "under_review"
            ? "bg-[var(--primary)]"
            : "bg-emerald-500"
        )}
      />

      <div className="p-4 md:p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[var(--muted-foreground)] mb-1 font-medium uppercase tracking-wide">
              Case #{dispute.id}
            </p>
            <h3 className="font-semibold text-[var(--foreground)] text-sm leading-snug line-clamp-2">
              {dispute.taskTitle}
            </h3>
          </div>
          <StatusBadge status={dispute.status} />
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-[var(--background)] rounded-lg p-2.5">
            <p className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wide mb-0.5">Reason</p>
            <p className="text-xs font-medium text-[var(--foreground)] leading-snug">{dispute.reason}</p>
          </div>
          <div className="bg-[var(--background)] rounded-lg p-2.5">
            <p className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wide mb-0.5">Amount</p>
            <p className="text-xs font-bold text-[var(--primary)]">{formatPKR(dispute.amount)}</p>
          </div>
        </div>

        {/* Expandable details */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1.5 text-xs text-[var(--primary)] font-medium hover:underline mb-2"
          aria-expanded={expanded}
        >
          <ChevronDown
            className={cn("w-3.5 h-3.5 transition-transform duration-200", expanded && "rotate-180")}
            aria-hidden="true"
          />
          {expanded ? "Hide details" : "Show details"}
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="border-t border-[var(--border)] pt-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--muted-foreground)]">Other party</span>
                  <span className="font-medium text-[var(--foreground)]">{dispute.otherParty}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--muted-foreground)]">Submitted</span>
                  <span className="font-medium text-[var(--foreground)]">{dispute.submittedDate}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--muted-foreground)]">Last update</span>
                  <span className="font-medium text-[var(--foreground)]">{dispute.lastUpdate}</span>
                </div>
                <Link
                  href={`/task/${dispute.taskId}`}
                  className="inline-flex items-center gap-1 text-xs text-[var(--primary)] hover:underline mt-1"
                >
                  <FileText className="w-3 h-3" aria-hidden="true" />
                  View task details
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DisputePage() {
  // Form state
  const [selectedTask, setSelectedTask] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  // Filter state
  const [statusFilter, setStatusFilter] = useState<DisputeStatus | "all">("all");

  const filteredDisputes =
    statusFilter === "all"
      ? MOCK_DISPUTES
      : MOCK_DISPUTES.filter((d) => d.status === statusFilter);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTask) { setFormError("Please select a task."); return; }
    if (!selectedReason) { setFormError("Please select a reason."); return; }
    if (description.trim().length < 20) { setFormError("Please describe the issue in at least 20 characters."); return; }
    setFormError("");
    setSubmitted(true);
  }

  function handleReset() {
    setSelectedTask("");
    setSelectedReason("");
    setDescription("");
    setSubmitted(false);
    setFormError("");
  }

  const statusCounts = {
    all: MOCK_DISPUTES.length,
    open: MOCK_DISPUTES.filter((d) => d.status === "open").length,
    under_review: MOCK_DISPUTES.filter((d) => d.status === "under_review").length,
    resolved: MOCK_DISPUTES.filter((d) => d.status === "resolved").length,
  };

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* ── PAGE HEADER ── */}
      <section className="bg-[var(--card)] border-b border-[var(--border)]">
        <div className="container py-6 md:py-8">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-[var(--radius)] bg-[var(--destructive)] flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-4 h-4 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[var(--foreground)] leading-tight">
                      Dispute &amp; Cancellation
                    </h1>
                    <p className="text-sm text-[var(--muted-foreground)] font-medium" dir="rtl" lang="ur">
                      تنازعہ اور منسوخی
                    </p>
                  </div>
                </div>
                <p className="text-sm text-[var(--muted-foreground)] mt-1 max-w-lg">
                  Raise a dispute, track its progress, or understand our cancellation policy. Our team reviews every case fairly.
                </p>
              </div>

              {/* Stats strip */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-center px-3 py-2 bg-amber-50 border border-amber-200 rounded-[var(--radius)]">
                  <p className="text-lg font-bold text-amber-700">{statusCounts.open}</p>
                  <p className="text-[10px] text-amber-600 uppercase tracking-wide">Open</p>
                </div>
                <div className="text-center px-3 py-2 bg-blue-50 border border-blue-200 rounded-[var(--radius)]">
                  <p className="text-lg font-bold text-blue-700">{statusCounts.under_review}</p>
                  <p className="text-[10px] text-blue-600 uppercase tracking-wide">In Review</p>
                </div>
                <div className="text-center px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-[var(--radius)]">
                  <p className="text-lg font-bold text-emerald-700">{statusCounts.resolved}</p>
                  <p className="text-[10px] text-emerald-600 uppercase tracking-wide">Resolved</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="container py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT COLUMN: Active disputes + Raise form ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Active Disputes */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="section-heading">Your Disputes</h2>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5" dir="rtl" lang="ur">آپ کے تنازعات</p>
                </div>

                {/* Filter pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(["all", "open", "under_review", "resolved"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setStatusFilter(f)}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-150",
                        statusFilter === f
                          ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                          : "bg-[var(--card)] text-[var(--muted-foreground)] border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                      )}
                    >
                      {f === "all" ? "All" : f === "under_review" ? "In Review" : f.charAt(0).toUpperCase() + f.slice(1)}
                      <span className="ml-1 opacity-70">
                        ({f === "all" ? statusCounts.all : f === "open" ? statusCounts.open : f === "under_review" ? statusCounts.under_review : statusCounts.resolved})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {filteredDisputes.length === 0 ? (
                <div className="card p-8 text-center">
                  <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" aria-hidden="true" />
                  <p className="font-semibold text-[var(--foreground)] mb-1">No disputes here</p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {statusFilter === "all" ? "You have no active or past disputes." : `No ${statusFilter.replace("_", " ")} disputes found.`}
                  </p>
                </div>
              ) : (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3"
                >
                  {filteredDisputes.map((dispute) => (
                    <DisputeCard key={dispute.id} dispute={dispute} />
                  ))}
                </motion.div>
              )}
            </section>

            {/* Raise New Dispute Form */}
            <section>
              <Reveal>
                <div className="card overflow-hidden">
                  {/* Card header with green-to-primary gradient */}
                  <div className="bg-gradient-to-r from-[var(--primary)] to-[#155a8a] px-5 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-white" aria-hidden="true" />
                      <div>
                        <h2 className="text-white font-bold text-base">Raise a New Dispute</h2>
                        <p className="text-white/70 text-xs" dir="rtl" lang="ur">نیا تنازعہ درج کریں</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <AnimatePresence mode="wait">
                      {submitted ? (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-center py-8"
                        >
                          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-7 h-7 text-emerald-600" aria-hidden="true" />
                          </div>
                          <h3 className="font-bold text-[var(--foreground)] text-lg mb-2">Dispute Submitted</h3>
                          <p className="text-sm text-[var(--muted-foreground)] mb-1">Case ID: <span className="font-semibold text-[var(--primary)]">D-{Date.now().toString().slice(-5)}</span></p>
                          <p className="text-sm text-[var(--muted-foreground)] mb-6 max-w-sm mx-auto">
                            Our support team will review your case and respond within 24 hours. You will be notified of any updates.
                          </p>
                          <button
                            onClick={handleReset}
                            className="btn-secondary inline-flex items-center gap-2"
                          >
                            <RotateCcw className="w-4 h-4" aria-hidden="true" />
                            Raise Another
                          </button>
                        </motion.div>
                      ) : (
                        <motion.form
                          key="form"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onSubmit={handleSubmit}
                          className="space-y-4"
                          noValidate
                        >
                          {/* Task selector */}
                          <div>
                            <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">
                              Select Task <span className="text-[var(--destructive)]">*</span>
                            </label>
                            <div className="relative">
                              <select
                                value={selectedTask}
                                onChange={(e) => setSelectedTask(e.target.value)}
                                className="w-full appearance-none bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius)] px-3 py-2.5 pr-8 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                              >
                                <option value="">Choose a completed or assigned task…</option>
                                {MOCK_TASKS.map((t) => (
                                  <option key={t.id} value={t.id}>{t.title}</option>
                                ))}
                              </select>
                              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] pointer-events-none" aria-hidden="true" />
                            </div>
                          </div>

                          {/* Reason dropdown */}
                          <div>
                            <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">
                              Reason <span className="text-[var(--destructive)]">*</span>
                            </label>
                            <div className="relative">
                              <select
                                value={selectedReason}
                                onChange={(e) => setSelectedReason(e.target.value)}
                                className="w-full appearance-none bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius)] px-3 py-2.5 pr-8 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                              >
                                <option value="">Select a reason…</option>
                                {DISPUTE_REASONS.map((r) => (
                                  <option key={r} value={r}>{r}</option>
                                ))}
                              </select>
                              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] pointer-events-none" aria-hidden="true" />
                            </div>
                          </div>

                          {/* Description */}
                          <div>
                            <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">
                              Describe the Issue <span className="text-[var(--destructive)]">*</span>
                            </label>
                            <textarea
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              rows={4}
                              placeholder="Explain what happened in detail. Include dates, amounts, and any relevant context. The more detail you provide, the faster we can resolve your case."
                              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius)] px-3 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none leading-relaxed"
                            />
                            <p className="text-xs text-[var(--muted-foreground)] mt-1">
                              {description.length} / 500 characters
                            </p>
                          </div>

                          {/* Evidence note */}
                          <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-200 rounded-[var(--radius)] p-3">
                            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                            <p className="text-xs text-blue-700 leading-relaxed">
                              <span className="font-semibold">Evidence tip:</span> Screenshots, task records, and in-app messages are automatically available to our review team. You do not need to attach files — just describe the issue clearly.
                            </p>
                          </div>

                          {/* Error */}
                          {formError && (
                            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-[var(--radius)] px-3 py-2.5">
                              <XCircle className="w-4 h-4 text-[var(--destructive)] flex-shrink-0" aria-hidden="true" />
                              <p className="text-xs text-[var(--destructive)] font-medium">{formError}</p>
                            </div>
                          )}

                          <button
                            type="submit"
                            className="btn-primary w-full flex items-center justify-center gap-2"
                          >
                            <Send className="w-4 h-4" aria-hidden="true" />
                            Submit Dispute
                          </button>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </Reveal>
            </section>
          </div>

          {/* ── RIGHT COLUMN: Policy + Support ── */}
          <div className="space-y-5">

            {/* Cancellation Policy */}
            <Reveal delay={0.05}>
              <div className="card overflow-hidden">
                <div className="bg-[var(--foreground)] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
                    <div>
                      <h2 className="text-white font-bold text-sm">Cancellation Policy</h2>
                      <p className="text-white/60 text-[10px]" dir="rtl" lang="ur">منسوخی کی پالیسی</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  {[
                    {
                      icon: CheckCircle,
                      color: "text-emerald-600",
                      bg: "bg-emerald-50",
                      title: "Free cancellation before assignment",
                      desc: "Cancel any open task at no cost before a tasker is assigned.",
                    },
                    {
                      icon: Clock,
                      color: "text-amber-600",
                      bg: "bg-amber-50",
                      title: "2-hour window after assignment",
                      desc: "Cancel within 2 hours of assigning a tasker with no penalty.",
                    },
                    {
                      icon: AlertTriangle,
                      color: "text-orange-600",
                      bg: "bg-orange-50",
                      title: "Late cancellation fee",
                      desc: "Cancelling after 2 hours may incur a small fee to compensate the tasker for their time.",
                    },
                    {
                      icon: XCircle,
                      color: "text-[var(--destructive)]",
                      bg: "bg-red-50",
                      title: "No-show policy",
                      desc: "If a tasker does not show up, you are entitled to a full refund and can raise a dispute.",
                    },
                    {
                      icon: RotateCcw,
                      color: "text-[var(--primary)]",
                      bg: "bg-blue-50",
                      title: "Commission release on cancellation",
                      desc: "Any reserved commission is released back to the tasker's balance on an approved cancellation.",
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="flex items-start gap-3">
                        <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5", item.bg)}>
                          <Icon className={cn("w-3.5 h-3.5", item.color)} aria-hidden="true" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[var(--foreground)] leading-snug">{item.title}</p>
                          <p className="text-xs text-[var(--muted-foreground)] leading-relaxed mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>

            {/* Support Contact */}
            <Reveal delay={0.1}>
              <div className="card overflow-hidden">
                {/* Accent top border */}
                <div className="h-1 bg-[var(--accent)]" />
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="font-bold text-[var(--foreground)] text-sm">Need Help?</h2>
                      <p className="text-[10px] text-[var(--muted-foreground)]" dir="rtl" lang="ur">مدد چاہیے؟</p>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed mb-4">
                    Our support team responds within <span className="font-semibold text-[var(--foreground)]">24 hours</span>. For urgent matters, use the in-app chat for faster assistance.
                  </p>

                  <div className="space-y-2">
                    <Link
                      href="/in-app-messaging-chat"
                      className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
                    >
                      <MessageSquare className="w-4 h-4" aria-hidden="true" />
                      Contact Support
                    </Link>
                    <a
                      href="tel:+92300000000"
                      className="btn-secondary w-full flex items-center justify-center gap-2 text-sm"
                    >
                      <Phone className="w-4 h-4" aria-hidden="true" />
                      Call Helpline
                    </a>
                  </div>

                  {/* Response time indicator */}
                  <div className="mt-4 flex items-center gap-2 bg-[var(--background)] rounded-[var(--radius)] px-3 py-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" aria-hidden="true" />
                    <p className="text-xs text-[var(--muted-foreground)]">
                      Support is <span className="font-semibold text-emerald-600">online</span> — avg. response 4 hrs
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Quick links */}
            <Reveal delay={0.15}>
              <div className="card p-4">
                <h3 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide mb-3">Quick Links</h3>
                <div className="space-y-1">
                  {[
                    { label: "My Tasks", href: "/my-tasks" },
                    { label: "My Bids", href: "/my-bids-tasker" },
                    { label: "Notifications", href: "/notifications" },
                    { label: "Settings", href: "/settings" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-[var(--background)] transition-colors group"
                    >
                      <span className="text-sm text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                        {link.label}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-[var(--muted-foreground)] -rotate-90" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </main>
  );
}
