"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Wallet, ArrowUpCircle, ArrowDownCircle, Lock, Info, Plus, Minus, TrendingUp, Shield, CheckCircle, Clock, AlertCircle, ChevronDown, RefreshCw } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";
import { formatPKR, COMMISSION_RATE, MIN_BALANCE_PKR } from "@/lib/data";
import { cn } from "@/lib/utils";

const COMMISSION_RATE_PCT = Math.round(COMMISSION_RATE * 100);

// ─── Types ────────────────────────────────────────────────────────────────────

type TxType = "credit" | "debit" | "reservation" | "release" | "commission";
type TxStatus = "completed" | "pending" | "failed" | "reversed";

interface Transaction {
  id: string;
  type: TxType;
  description: string;
  amountPkr: number;
  date: string;
  status: TxStatus;
  taskTitle?: string;
  reference?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_BALANCE = {
  totalPkr: 4750,
  reservedPkr: 420,
};

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-001",
    type: "credit",
    description: "Balance top-up via EasyPaisa",
    amountPkr: 2000,
    date: "2025-06-12T10:30:00Z",
    status: "completed",
    reference: "EP-2025-88123",
  },
  {
    id: "tx-002",
    type: "reservation",
    description: "Commission reserved on assignment",
    amountPkr: 420,
    date: "2025-06-11T14:15:00Z",
    status: "pending",
    taskTitle: "Deep clean 3-bedroom apartment",
    reference: "TASK-3821",
  },
  {
    id: "tx-003",
    type: "commission",
    description: "Platform commission deducted",
    amountPkr: 384,
    date: "2025-06-10T18:00:00Z",
    status: "completed",
    taskTitle: "Fix leaking kitchen tap",
    reference: "TASK-3790",
  },
  {
    id: "tx-004",
    type: "credit",
    description: "Balance top-up via JazzCash",
    amountPkr: 1500,
    date: "2025-06-08T09:00:00Z",
    status: "completed",
    reference: "JC-2025-44901",
  },
  {
    id: "tx-005",
    type: "release",
    description: "Commission reservation released (cancelled task)",
    amountPkr: 312,
    date: "2025-06-07T11:45:00Z",
    status: "reversed",
    taskTitle: "Grocery run from Imtiaz Store",
    reference: "TASK-3755",
  },
  {
    id: "tx-006",
    type: "commission",
    description: "Platform commission deducted",
    amountPkr: 216,
    date: "2025-06-05T16:30:00Z",
    status: "completed",
    taskTitle: "NADRA queue standing — F-8",
    reference: "TASK-3710",
  },
  {
    id: "tx-007",
    type: "debit",
    description: "Withdrawal to bank account",
    amountPkr: 3000,
    date: "2025-06-03T12:00:00Z",
    status: "completed",
    reference: "WD-2025-00291",
  },
  {
    id: "tx-008",
    type: "credit",
    description: "Balance top-up via EasyPaisa",
    amountPkr: 5000,
    date: "2025-05-28T08:20:00Z",
    status: "completed",
    reference: "EP-2025-71044",
  },
  {
    id: "tx-009",
    type: "commission",
    description: "Platform commission deducted",
    amountPkr: 480,
    date: "2025-05-25T17:00:00Z",
    status: "completed",
    taskTitle: "Move sofa + 2 beds to new flat",
    reference: "TASK-3640",
  },
  {
    id: "tx-010",
    type: "credit",
    description: "Balance top-up via JazzCash",
    amountPkr: 1000,
    date: "2025-05-20T10:00:00Z",
    status: "completed",
    reference: "JC-2025-38820",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTxIcon(type: TxType) {
  switch (type) {
    case "credit":
    case "release":
      return { Icon: ArrowUpCircle, color: "text-emerald-500", bg: "bg-emerald-50" };
    case "debit":
    case "commission":
      return { Icon: ArrowDownCircle, color: "text-red-500", bg: "bg-red-50" };
    case "reservation":
      return { Icon: Lock, color: "text-amber-500", bg: "bg-amber-50" };
    default:
      return { Icon: RefreshCw, color: "text-gray-400", bg: "bg-gray-50" };
  }
}

function getTxAmountPrefix(type: TxType): string {
  switch (type) {
    case "credit":
    case "release":
      return "+";
    case "debit":
    case "commission":
      return "-";
    case "reservation":
      return "−";
    default:
      return "";
  }
}

function getTxAmountColor(type: TxType): string {
  switch (type) {
    case "credit":
    case "release":
      return "text-emerald-600";
    case "debit":
    case "commission":
      return "text-red-600";
    case "reservation":
      return "text-amber-600";
    default:
      return "text-[var(--foreground)]";
  }
}

function getStatusBadge(status: TxStatus) {
  switch (status) {
    case "completed":
      return { label: "Completed", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    case "pending":
      return { label: "Pending", cls: "bg-amber-50 text-amber-700 border-amber-200" };
    case "failed":
      return { label: "Failed", cls: "bg-red-50 text-red-700 border-red-200" };
    case "reversed":
      return { label: "Reversed", cls: "bg-blue-50 text-blue-700 border-blue-200" };
    default:
      return { label: status, cls: "bg-gray-50 text-gray-600 border-gray-200" };
  }
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" });
}

const TX_TYPE_FILTERS: { key: TxType | "all"; label: string }[] = [
  { key: "all", label: "Sab" },
  { key: "credit", label: "Credit" },
  { key: "debit", label: "Debit" },
  { key: "commission", label: "Commission" },
  { key: "reservation", label: "Reserved" },
  { key: "release", label: "Released" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TaskerBalancePage() {
  const [activeFilter, setActiveFilter] = useState<TxType | "all">("all");
  const [showAll, setShowAll] = useState(false);

  const availablePkr = MOCK_BALANCE.totalPkr - MOCK_BALANCE.reservedPkr;

  const filtered = useMemo(() => {
    const list =
      activeFilter === "all"
        ? MOCK_TRANSACTIONS
        : MOCK_TRANSACTIONS.filter((tx) => tx.type === activeFilter);
    return showAll ? list : list.slice(0, 6);
  }, [activeFilter, showAll]);

  const totalFiltered = useMemo(
    () =>
      activeFilter === "all"
        ? MOCK_TRANSACTIONS.length
        : MOCK_TRANSACTIONS.filter((tx) => tx.type === activeFilter).length,
    [activeFilter]
  );

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* ── PAGE HEADER ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0f3f63 0%, #1B6CA8 55%, #1e7fc0 100%)",
        }}
      >
        {/* Decorative pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #F5A623 0%, transparent 45%), radial-gradient(circle at 80% 20%, #ffffff 0%, transparent 40%)",
          }}
          aria-hidden="true"
        />
        {/* Geometric accent */}
        <div
          className="absolute right-0 top-0 w-64 h-64 opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
            backgroundSize: "12px 12px",
          }}
          aria-hidden="true"
        />

        <div className="container relative z-10 py-10 md:py-14">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-white" aria-hidden="true" />
                </div>
                <span className="text-white/70 text-sm font-medium tracking-wide uppercase">
                  Tasker Account
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Mera Balance
              </h1>
              <p
                className="text-white/60 text-lg mt-0.5"
                style={{ fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif" }}
                dir="rtl"
              >
                میرا بیلنس
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/verification-status"
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-3 py-2 rounded-lg border border-white/20 transition-colors"
              >
                <Shield className="w-4 h-4" aria-hidden="true" />
                Verification
              </Link>
              <Link
                href="/my-bids-tasker"
                className="flex items-center gap-1.5 bg-[#1A1A2E] hover:bg-[#2d2d4e] text-white text-sm font-bold px-3 py-2 rounded-lg transition-colors"
              >
                <TrendingUp className="w-4 h-4" aria-hidden="true" />
                My Bids
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-6 md:py-10 space-y-6">
        {/* ── BALANCE CARDS ── */}
        <Reveal>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {/* Total Balance — hero card */}
            <motion.div
              variants={scaleIn}
              className="sm:col-span-3 relative overflow-hidden rounded-2xl p-6 md:p-8"
              style={{
                background:
                  "linear-gradient(135deg, #1B6CA8 0%, #0f3f63 100%)",
                boxShadow:
                  "0 4px 6px rgba(27,108,168,0.15), 0 20px 40px -12px rgba(27,108,168,0.35)",
              }}
            >
              {/* Decorative circle */}
              <div
                className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10"
                style={{ background: "#F5A623" }}
                aria-hidden="true"
              />
              <div
                className="absolute -right-4 -bottom-12 w-56 h-56 rounded-full opacity-[0.06]"
                style={{ background: "#ffffff" }}
                aria-hidden="true"
              />

              <div className="relative z-10">
                <p className="text-white/60 text-sm font-medium uppercase tracking-widest mb-1">
                  Kul Balance
                </p>
                <p
                  className="text-white/50 text-xs mb-3"
                  style={{
                    fontFamily:
                      "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif",
                  }}
                  dir="rtl"
                >
                  کل بیلنس
                </p>
                <div className="flex items-end gap-3 mb-6">
                  <span className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                    {formatPKR(MOCK_BALANCE.totalPkr)}
                  </span>
                  <span className="text-white/50 text-sm mb-1.5">PKR</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Available */}
                  <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-1.5 mb-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-300" aria-hidden="true" />
                      <span className="text-white/60 text-xs font-medium uppercase tracking-wide">
                        Dastiyab
                      </span>
                    </div>
                    <p
                      className="text-white/40 text-xs mb-2"
                      style={{
                        fontFamily:
                          "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif",
                      }}
                      dir="rtl"
                    >
                      دستیاب
                    </p>
                    <p className="text-2xl font-bold text-emerald-300">
                      {formatPKR(availablePkr)}
                    </p>
                  </div>

                  {/* Reserved */}
                  <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Lock className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
                      <span className="text-white/60 text-xs font-medium uppercase tracking-wide">
                        Commission Reserved
                      </span>
                    </div>
                    <p
                      className="text-white/40 text-xs mb-2"
                      style={{
                        fontFamily:
                          "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif",
                      }}
                      dir="rtl"
                    >
                      محفوظ کمیشن
                    </p>
                    <p className="text-2xl font-bold text-amber-300">
                      {formatPKR(MOCK_BALANCE.reservedPkr)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </Reveal>

        {/* ── QUICK ACTIONS ── */}
        <Reveal delay={0.05}>
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wide mb-4">
              Quick Actions
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="btn-primary flex-1 gap-2"
                onClick={() => alert("Payment integration coming soon. Yeh feature jald aa raha hai!")}
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                Paisa Daalo (Add Funds)
              </button>
              <button
                className="btn-secondary flex-1 gap-2"
                onClick={() => alert("Withdrawal feature coming soon. Jald aa raha hai!")}
              >
                <Minus className="w-4 h-4" aria-hidden="true" />
                Nikalo (Withdraw)
              </button>
            </div>
            <div             className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-amber-700 text-xs leading-relaxed">
                <strong>Mock balance</strong> — payment integration coming soon. Abhi yeh sirf demo hai.
              </p>
            </div>
          </div>
        </Reveal>

        {/* ── COMMISSION INFO ── */}
        <Reveal delay={0.08}>
          <div
            className="rounded-xl p-4 border flex items-start gap-3"
            style={{
              background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
              borderColor: "#bfdbfe",
            }}
          >
            <div className="w-9 h-9 rounded-lg bg-[var(--primary)] flex items-center justify-center flex-shrink-0">
              <Info className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[var(--primary)] font-semibold text-sm">
                Platform Commission: {COMMISSION_RATE_PCT}%
              </p>
              <p className="text-blue-700 text-xs mt-0.5 leading-relaxed">
                Platform sirf successfully complete hone wale tasks par{" "}
                <strong>{COMMISSION_RATE_PCT}%</strong> commission leta hai. Commission tabhi kata
                jata hai jab kaam mukammal ho jaye. Minimum balance requirement:{" "}
                <strong>{formatPKR(MIN_BALANCE_PKR)}</strong>.
              </p>
            </div>
          </div>
        </Reveal>

        {/* ── TRANSACTION HISTORY ── */}
        <Reveal delay={0.1}>
          <div className="card overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="section-heading">Lain-Den ka Hisaab</h2>
                <p
                  className="text-[var(--muted-foreground)] text-xs mt-0.5"
                  style={{
                    fontFamily:
                      "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif",
                  }}
                  dir="rtl"
                >
                  لین دین کا حساب
                </p>
              </div>
              <span className="text-xs text-[var(--muted-foreground)] bg-[var(--background)] px-2.5 py-1 rounded-full border border-[var(--border)]">
                {totalFiltered} transactions
              </span>
            </div>

            {/* Filter tabs */}
            <div className="px-5 py-3 border-b border-[var(--border)] overflow-x-auto">
              <div className="flex gap-2 min-w-max">
                {TX_TYPE_FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => {
                      setActiveFilter(f.key);
                      setShowAll(false);
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 whitespace-nowrap",
                      activeFilter === f.key
                        ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                        : "bg-white text-[var(--muted-foreground)] border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Transaction list */}
            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="divide-y divide-[var(--border)]"
            >
              {filtered.length === 0 ? (
                <li className="px-5 py-10 text-center text-[var(--muted-foreground)] text-sm">
                  Koi transaction nahi mili.
                </li>
              ) : (
                filtered.map((tx) => {
                  const { Icon, color, bg } = getTxIcon(tx.type);
                  const prefix = getTxAmountPrefix(tx.type);
                  const amtColor = getTxAmountColor(tx.type);
                  const { label: statusLabel, cls: statusCls } = getStatusBadge(tx.status);

                  return (
                    <motion.li
                      key={tx.id}
                      variants={fadeInUp}
                      className="px-5 py-4 flex items-start gap-4 hover:bg-[var(--background)] transition-colors"
                    >
                      {/* Icon */}
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5",
                          bg
                        )}
                      >
                        <Icon className={cn("w-5 h-5", color)} aria-hidden="true" />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[var(--foreground)] leading-snug truncate">
                              {tx.description}
                            </p>
                            {tx.taskTitle && (
                              <p className="text-xs text-[var(--muted-foreground)] mt-0.5 truncate">
                                Task: {tx.taskTitle}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              <span className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                                <Clock className="w-3 h-3" aria-hidden="true" />
                                {formatDate(tx.date)} · {formatTime(tx.date)}
                              </span>
                              {tx.reference && (
                                <span className="text-xs text-[var(--muted-foreground)] font-mono">
                                  #{tx.reference}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Amount + status */}
                          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                            <span
                              className={cn(
                                "text-sm font-bold tabular-nums",
                                amtColor
                              )}
                            >
                              {prefix}{formatPKR(tx.amountPkr)}
                            </span>
                            <span
                              className={cn(
                                "text-xs font-semibold px-2 py-0.5 rounded-full border",
                                statusCls
                              )}
                            >
                              {statusLabel}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  );
                })
              )}
            </motion.ul>

            {/* Show more */}
            {totalFiltered > 6 && !showAll && (
              <div className="px-5 py-4 border-t border-[var(--border)]">
                <button
                  onClick={() => setShowAll(true)}
                  className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors py-1"
                >
                  <ChevronDown className="w-4 h-4" aria-hidden="true" />
                  Aur Dekhein ({totalFiltered - 6} aur)
                </button>
              </div>
            )}
          </div>
        </Reveal>

        {/* ── BALANCE TIPS ── */}
        <Reveal delay={0.12}>
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[var(--primary)]" aria-hidden="true" />
              Balance ke Baare Mein Zaroori Baatein
            </h2>
            <ul className="space-y-3">
              {[
                {
                  icon: CheckCircle,
                  color: "text-emerald-500",
                  text: `Bidding ke liye minimum ${formatPKR(MIN_BALANCE_PKR)} balance zaroori hai.`,
                },
                {
                  icon: Lock,
                  color: "text-amber-500",
                  text: `Jab aap kisi task par assign ho jaate hain, commission (${COMMISSION_RATE_PCT}%) reserve ho jata hai.`,
                },
                {
                  icon: AlertCircle,
                  color: "text-blue-500",
                  text: "Task complete hone par commission kaat liya jata hai. Cancel hone par wapas aa jata hai.",
                },
                {
                  icon: TrendingUp,
                  color: "text-[var(--primary)]",
                  text: "Zyada balance rakhne se zyada tasks par bid kar sakte hain aur jaldi assign ho sakte hain.",
                },
              ].map(({ icon: Icon, color, text }, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Icon className={cn("w-4 h-4 flex-shrink-0 mt-0.5", color)} aria-hidden="true" />
                  <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* ── BOTTOM SPACER ── */}
        <div className="h-4" />
      </div>
    </main>
  );
}
