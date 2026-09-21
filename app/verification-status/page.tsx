"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle, Clock, XCircle, AlertCircle, Upload, FileText, User, Phone, Camera, ChevronRight, Info, Star, Lock, Unlock, Eye } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";
import { APP_NAME, VerificationStatus } from "@/lib/data";
type COMMISSION_RATE_DEFAULT = any;
const COMMISSION_RATE_DEFAULT: any = [];

// ─── Local helpers (NOT imported from @/lib/data) ───────────────────────────
function getVerificationLabel(status: VerificationStatus): string {
  switch (status) {
    case "unverified":
      return "Unverified";
    case "submitted":
      return "Under Review";
    case "verified":
      return "Verified";
    case "restricted":
      return "Restricted";
  }
}

function getVerificationColor(status: VerificationStatus): string {
  switch (status) {
    case "unverified":
      return "text-gray-500";
    case "submitted":
      return "text-amber-600";
    case "verified":
      return "text-emerald-600";
    case "restricted":
      return "text-red-600";
  }
}

function getVerificationBg(status: VerificationStatus): string {
  switch (status) {
    case "unverified":
      return "bg-gray-100 border-gray-200";
    case "submitted":
      return "bg-amber-50 border-amber-200";
    case "verified":
      return "bg-emerald-50 border-emerald-200";
    case "restricted":
      return "bg-red-50 border-red-200";
  }
}

// ─── Mock current user verification state ───────────────────────────────────
const MOCK_VERIFICATION: {
  status: VerificationStatus;
  submittedAt?: string;
  reviewedAt?: string;
  restrictionReason?: string;
  steps: {
    key: string;
    label: string;
    description: string;
    completed: boolean;
    required: boolean;
  }[];
} = {
  status: "submitted",
  submittedAt: "2025-01-10",
  steps: [
    {
      key: "cnic_front",
      label: "CNIC Front Photo",
      description: "Clear photo of the front side of your National ID Card",
      completed: true,
      required: true,
    },
    {
      key: "cnic_back",
      label: "CNIC Back Photo",
      description: "Clear photo of the back side of your National ID Card",
      completed: true,
      required: true,
    },
    {
      key: "selfie",
      label: "Selfie with CNIC",
      description: "A selfie holding your CNIC next to your face",
      completed: true,
      required: true,
    },
    {
      key: "phone",
      label: "Phone Number Verified",
      description: "Verify your Pakistani mobile number via OTP",
      completed: true,
      required: true,
    },
    {
      key: "address",
      label: "Address Proof",
      description: "Utility bill or bank statement showing your address",
      completed: false,
      required: false,
    },
  ],
};

const BENEFITS: {
  icon: React.ReactNode;
  title: string;
  description: string;
  locked: boolean;
}[] = [
  {
    icon: <Star className="w-5 h-5" />,
    title: "Verified Badge on Profile",
    description:
      "Stand out to posters with a prominent verified checkmark on your profile and bids.",
    locked: false,
  },
  {
    icon: <Unlock className="w-5 h-5" />,
    title: "Bid on All Tasks",
    description:
      "Unverified taskers can only bid on tasks under Rs 2,000. Verification removes this limit.",
    locked: false,
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Priority in Search Results",
    description:
      "Verified taskers appear higher in task feed results and get more visibility.",
    locked: false,
  },
  {
    icon: <Star className="w-5 h-5" />,
    title: "Reduced Commission Rate",
    description: `Verified taskers enjoy a reduced commission rate of ${Math.round((COMMISSION_RATE_DEFAULT - 0.02) * 100)}% vs the standard ${Math.round(COMMISSION_RATE_DEFAULT * 100)}%.`,
    locked: false,
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: "Dispute Protection",
    description:
      "Verified taskers receive priority support and stronger protections in dispute resolution.",
    locked: true,
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: "Trust Score Display",
    description:
      "A public trust score based on your verification level, ratings, and completion rate.",
    locked: true,
  },
];

const TIMELINE: { status: VerificationStatus; label: string; date?: string }[] =
  [
    { status: "unverified", label: "Account Created", date: "2025-01-05" },
    { status: "submitted", label: "Documents Submitted", date: "2025-01-10" },
    { status: "verified", label: "Verification Complete", date: undefined },
    { status: "restricted", label: "Account Restricted", date: undefined },
  ];

const FAQ: { q: string; a: string }[] = [
  {
    q: "How long does verification take?",
    a: "Our team reviews submissions within 1 to 3 business days. You will receive a notification once your status changes.",
  },
  {
    q: "What if my documents are rejected?",
    a: "You will receive a reason for rejection and can resubmit corrected documents. Common issues include blurry photos or mismatched names.",
  },
  {
    q: "Is my CNIC data safe?",
    a: "Yes. All documents are encrypted at rest and in transit. We follow NADRA guidelines and never share your data with third parties.",
  },
  {
    q: "Can I still use Asan Kaam while under review?",
    a: "Yes. You can bid on tasks under Rs 2,000 and receive messages while your verification is being processed.",
  },
  {
    q: "What does 'Restricted' status mean?",
    a: "A restricted account has been flagged for a policy violation or failed verification. Contact support to understand the reason and appeal.",
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: VerificationStatus }) {
  const icons: Record<VerificationStatus, React.ReactNode> = {
    unverified: <AlertCircle className="w-5 h-5" />,
    submitted: <Clock className="w-5 h-5" />,
    verified: <CheckCircle className="w-5 h-5" />,
    restricted: <XCircle className="w-5 h-5" />,
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${getVerificationBg(status)} ${getVerificationColor(status)}`}
    >
      {icons[status]}
      {getVerificationLabel(status)}
    </span>
  );
}

function StepRow({
  step,
  index,
}: {
  step: (typeof MOCK_VERIFICATION.steps)[number];
  index: number;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 ${
        step.completed
          ? "bg-emerald-50 border-emerald-200"
          : "bg-white border-gray-200 hover:border-[var(--brand-primary)]/40"
      }`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
          step.completed
            ? "bg-emerald-500 text-white"
            : "bg-gray-100 text-gray-400"
        }`}
      >
        {step.completed ? <CheckCircle className="w-4 h-4" /> : index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`font-semibold text-sm ${step.completed ? "text-emerald-800" : "text-gray-800"}`}
          >
            {step.label}
          </span>
          {!step.required && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
              Optional
            </span>
          )}
        </div>
        <p
          className={`text-xs mt-0.5 leading-relaxed ${step.completed ? "text-emerald-700" : "text-gray-500"}`}
        >
          {step.description}
        </p>
      </div>
      {!step.completed && (
        <button className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold text-[var(--brand-primary)] hover:underline">
          <Upload className="w-3.5 h-3.5" />
          Upload
        </button>
      )}
    </motion.div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors duration-150"
      >
        <span className="font-semibold text-gray-800 text-sm">{q}</span>
        <ChevronRight
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-4 bg-gray-50 border-t border-gray-100">
          <p className="text-sm text-gray-600 leading-relaxed pt-3">{a}</p>
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function VerificationStatusPage() {
  const [activeTab, setActiveTab] = useState<"status" | "benefits" | "faq">(
    "status"
  );
  const v = MOCK_VERIFICATION;
  const completedSteps = v.steps.filter((s) => s.completed).length;
  const totalRequired = v.steps.filter((s) => s.required).length;
  const completedRequired = v.steps.filter((s) => s.required && s.completed)
    .length;
  const progressPct = Math.round((completedRequired / totalRequired) * 100);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* ── Hero / Status Banner ── */}
      <Reveal>
        <section className="bg-gradient-to-br from-[var(--brand-primary)]/10 via-white to-emerald-50 border-b border-gray-100 py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Shield className="w-4 h-4 text-[var(--brand-primary)]" />
                  <span>Tasker Verification</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight text-balance mb-3">
                  Verification Status
                </h1>
                <p className="text-gray-600 leading-relaxed max-w-lg">
                  Complete your identity verification to unlock full bidding
                  access, a verified badge, and reduced commission on{" "}
                  {APP_NAME}.
                </p>
              </div>
              <div
                className={`flex-shrink-0 rounded-2xl border-2 p-6 text-center min-w-[180px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] ${getVerificationBg(v.status)}`}
              >
                <div
                  className={`text-4xl font-black mb-1 ${getVerificationColor(v.status)}`}
                >
                  {progressPct}%
                </div>
                <div className="text-xs text-gray-500 mb-3">
                  Required steps done
                </div>
                <StatusBadge status={v.status} />
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-8">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>
                  {completedRequired} of {totalRequired} required steps
                  completed
                </span>
                <span>{completedSteps} of {v.steps.length} total</span>
              </div>
              <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[var(--brand-primary)] to-emerald-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                />
              </div>
            </div>

            {/* Status-specific alert */}
            {v.status === "submitted" && (
              <div className="mt-5 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  Your documents were submitted on{" "}
                  <strong>{v.submittedAt}</strong>. Our team reviews submissions
                  within 1 to 3 business days. No action needed from you right
                  now.
                </p>
              </div>
            )}
            {v.status === "restricted" && v.restrictionReason && (
              <div className="mt-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">
                  <strong>Account Restricted:</strong> {v.restrictionReason}{" "}
                  Please contact support to appeal.
                </p>
              </div>
            )}
            {v.status === "verified" && (
              <div className="mt-5 flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-emerald-800">
                  Your identity is fully verified. You have access to all tasker
                  features and the reduced commission rate.
                </p>
              </div>
            )}
          </div>
        </section>
      </Reveal>

      {/* ── Tabs ── */}
      <Reveal>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
            {(
              [
                { key: "status", label: "My Documents" },
                { key: "benefits", label: "Benefits" },
                { key: "faq", label: "FAQ" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* ── Tab: Status / Documents ── */}
        {activeTab === "status" && (
          <>
            {/* Verification timeline */}
            <Reveal>
              <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[var(--brand-primary)]" />
                  Verification Journey
                </h2>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
                  <div className="space-y-0">
                    {TIMELINE.map((step, i) => {
                      const isCurrent = step.status === v.status;
                      const isPast =
                        TIMELINE.findIndex((t) => t.status === v.status) > i;
                      const isFuture =
                        TIMELINE.findIndex((t) => t.status === v.status) < i;
                      if (step.status === "restricted") return null;
                      return (
                        <div key={step.status} className="flex items-start gap-4 pb-6 last:pb-0">
                          <div
                            className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                              isCurrent
                                ? "bg-[var(--brand-primary)] border-[var(--brand-primary)] text-white"
                                : isPast
                                ? "bg-emerald-500 border-emerald-500 text-white"
                                : "bg-white border-gray-300 text-gray-400"
                            }`}
                          >
                            {isPast ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : isCurrent ? (
                              <Clock className="w-4 h-4" />
                            ) : (
                              <span className="text-xs font-bold">{i + 1}</span>
                            )}
                          </div>
                          <div className="pt-1">
                            <div
                              className={`font-semibold text-sm ${isCurrent ? "text-[var(--brand-primary)]" : isPast ? "text-gray-800" : "text-gray-400"}`}
                            >
                              {step.label}
                            </div>
                            {step.date && (
                              <div className="text-xs text-gray-400 mt-0.5">
                                {step.date}
                              </div>
                            )}
                            {isCurrent && !step.date && (
                              <div className="text-xs text-amber-600 mt-0.5">
                                In progress
                              </div>
                            )}
                            {isFuture && (
                              <div className="text-xs text-gray-400 mt-0.5">
                                Pending
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Document checklist */}
            <Reveal>
              <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <User className="w-5 h-5 text-[var(--brand-primary)]" />
                  Document Checklist
                </h2>
                <p className="text-sm text-gray-500 mb-5">
                  Upload clear, well-lit photos. Blurry or cropped images will
                  be rejected.
                </p>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3"
                >
                  {v.steps.map((step, i) => (
                    <StepRow key={step.key} step={step} index={i} />
                  ))}
                </motion.div>

                {v.status === "unverified" && (
                  <button className="mt-6 w-full flex items-center justify-center gap-2 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/90 text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
                    <Upload className="w-4 h-4" />
                    Submit Documents for Review
                  </button>
                )}
              </div>
            </Reveal>

            {/* Tips */}
            <Reveal>
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-blue-900 text-sm mb-2">
                      Tips for a successful verification
                    </h3>
                    <ul className="space-y-1.5 text-sm text-blue-800">
                      <li className="flex items-start gap-2">
                        <Camera className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        Ensure photos are taken in good lighting with no glare
                        on the card.
                      </li>
                      <li className="flex items-start gap-2">
                        <FileText className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        All four corners of the CNIC must be visible in the
                        frame.
                      </li>
                      <li className="flex items-start gap-2">
                        <Phone className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        The name on your CNIC must match the name on your{" "}
                        {APP_NAME} account.
                      </li>
                      <li className="flex items-start gap-2">
                        <User className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        In your selfie, hold the CNIC beside your face so both
                        are clearly visible.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Reveal>
          </>
        )}

        {/* ── Tab: Benefits ── */}
        {activeTab === "benefits" && (
          <Reveal>
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  What verification unlocks
                </h2>
                <p className="text-gray-500 text-sm">
                  Verified taskers earn more, pay less commission, and build
                  trust faster.
                </p>
              </div>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {BENEFITS.map((b, i) => (
                  <motion.div
                    key={i}
                    variants={scaleIn}
                    className={`relative rounded-2xl border p-5 transition-all duration-200 ${
                      b.locked
                        ? "bg-gray-50 border-gray-200 opacity-60"
                        : "bg-white border-gray-200 hover:border-[var(--brand-primary)]/40 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
                    }`}
                  >
                    {b.locked && (
                      <div className="absolute top-3 right-3">
                        <Lock className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${
                        b.locked
                          ? "bg-gray-200 text-gray-400"
                          : "bg-[var(--brand-primary)]/15 text-[var(--brand-primary)]"
                      }`}
                    >
                      {b.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">
                      {b.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {b.description}
                    </p>
                    {b.locked && (
                      <div className="mt-3 text-xs text-gray-400 font-medium">
                        Coming soon
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>

              {/* Commission comparison */}
              <div className="mt-8 bg-gradient-to-r from-[var(--brand-primary)]/10 to-emerald-50 border border-[var(--brand-primary)]/20 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-sm">
                  Commission Rate Comparison
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                    <div className="text-2xl font-black text-gray-400 mb-1">
                      {Math.round(COMMISSION_RATE_DEFAULT * 100)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      Unverified / Standard
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-emerald-300 p-4 text-center shadow-[0_2px_8px_rgba(16,185,129,0.12)]">
                    <div className="text-2xl font-black text-emerald-600 mb-1">
                      {Math.round((COMMISSION_RATE_DEFAULT - 0.02) * 100)}%
                    </div>
                    <div className="text-xs text-emerald-700 font-semibold">
                      Verified Tasker
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  On a Rs 5,000 task, that is Rs{" "}
                  {(5000 * 0.02).toLocaleString("en-PK")} more in your pocket
                  per job.
                </p>
              </div>
            </div>
          </Reveal>
        )}

        {/* ── Tab: FAQ ── */}
        {activeTab === "faq" && (
          <Reveal>
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Frequently Asked Questions
                </h2>
                <p className="text-gray-500 text-sm">
                  Everything you need to know about the verification process.
                </p>
              </div>
              <div className="space-y-3">
                {FAQ.map((item, i) => (
                  <FaqItem key={i} q={item.q} a={item.a} />
                ))}
              </div>

              <div className="mt-8 bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
                <h3 className="font-bold text-gray-900 mb-2">
                  Still have questions?
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Our support team is available 9am to 9pm, Monday to Saturday.
                </p>
                <a
                  href="mailto:support@asankaam.pk"
                  className="inline-flex items-center gap-2 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/90 text-white font-bold px-5 py-2.5 rounded-xl transition-all duration-200 text-sm"
                >
                  Contact Support
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </main>
  );
}