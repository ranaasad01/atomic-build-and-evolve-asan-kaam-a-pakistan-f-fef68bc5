"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, AlertCircle, RefreshCw, Filter, ChevronDown, Info, Shield, Zap } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Reveal } from "@/components/Reveal";
import { fadeInUp, staggerContainer } from "@/lib/motion";
type TransactionType = any;
const TransactionType: any = [];
type COMMISSION_RATE_DEFAULT = any;
const COMMISSION_RATE_DEFAULT: any = [];
type formatPkr = any;
const formatPkr: any = [];

// ─── Local constants ────────────────────────────────────────────────────────

const COMMISSION_RATE_PCT = 12; // 12% — mirrors COMMISSION_RATE_DEFAULT * 100
const BALANCE_MINIMUM = 500; // PKR — mirrors BALANCE_MINIMUM_PKR

function pkr(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}

// ─── Types ───────────────────────────────────────────────────────────────────

type TxType = TransactionType;

interface Transaction {
  id: string;
  type: TxType;
  amountPkr: number;
  description: string;
  taskTitle?: string;
  taskId?: string;
  date: string;
  status: "completed" | "pending" | "failed";
  balanceAfterPkr: number;
}

// ─── Mock data ───────────────────────────────────────────────────────────────

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-001",
    type: "top_up",
    amountPkr: 2000,
    description: "Balance top-up via JazzCash",
    date: "2025-06-10T09:15:00Z",
    status: "completed",
    balanceAfterPkr: 3200,
  },
  {
    id: "tx-002",
    type: "commission_reserved",
    amountPkr: -360,
    description: "Commission hold on assignment",
    taskTitle: "Move furniture from DHA to Gulshan",
    taskId: "task-101",
    date: "2025-06-09T14:30:00Z",
    status: "completed",
    balanceAfterPkr: 1200,
  },
  {
    id: "tx-003",
    type: "commission_deducted",
    amountPkr: -360,
    description: "Commission deducted on task completion",
    taskTitle: "Move furniture from DHA to Gulshan",
    taskId: "task-101",
    date: "2025-06-09T18:45:00Z",
    status: "completed",
    balanceAfterPkr: 840,
  },
  {
    id: "tx-004",
    type: "top_up",
    amountPkr: 1500,
    description: "Balance top-up via EasyPaisa",
    date: "2025-06-08T11:00:00Z",
    status: "completed",
    balanceAfterPkr: 1200,
  },
  {
    id: "tx-005",
    type: "commission_reserved",
    amountPkr: -180,
    description: "Commission hold on assignment",
    taskTitle: "Grocery run in F-10 Markaz",
    taskId: "task-098",
    date: "2025-06-07T10:20:00Z",
    status: "completed",
    balanceAfterPkr: -300,
  },
  {
    id: "tx-006",
    type: "commission_released",
    amountPkr: 180,
    description: "Commission released — task cancelled by poster",
    taskTitle: "Grocery run in F-10 Markaz",
    taskId: "task-098",
    date: "2025-06-07T16:00:00Z",
    status: "completed",
    balanceAfterPkr: -120,
  },
  {
    id: "tx-007",
    type: "boost_fee",
    amountPkr: -99,
    description: "Urgency boost fee",
    taskTitle: "Fix leaking tap in Johar Town",
    taskId: "task-095",
    date: "2025-06-06T08:00:00Z",
    status: "completed",
    balanceAfterPkr: -219,
  },
  {
    id: "tx-008",
    type: "refund",
    amountPkr: 99,
    description: "Boost fee refunded — task not filled",
    taskTitle: "Fix leaking tap in Johar Town",
    taskId: "task-095",
    date: "2025-06-06T20:00:00Z",
    status: "completed",
    balanceAfterPkr: -120,
  },
  {
    id: "tx-009",
    type: "top_up",
    amountPkr: 3000,
    description: "Balance top-up via bank transfer",
    date: "2025-06-05T13:00:00Z",
    status: "completed",
    balanceAfterPkr: 2880,
  },
  {
    id: "tx-010",
    type: "commission_deducted",
    amountPkr: -240,
    description: "Commission deducted on task completion",
    taskTitle: "Help with NADRA form submission",
    taskId: "task-090",
    date: "2025-06-04T15:30:00Z",
    status: "completed",
    balanceAfterPkr: 2640,
  },
  {
    id: "tx-011",
    type: "commission_reserved",
    amountPkr: -240,
    description: "Commission hold on assignment",
    taskTitle: "Help with NADRA form submission",
    taskId: "task-090",
    date: "2025-06-04T09:00:00Z",
    status: "completed",
    balanceAfterPkr: 2880,
  },
  {
    id: "tx-012",
    type: "top_up",
    amountPkr: 1000,
    description: "Balance top-up via JazzCash",
    date: "2025-06-03T10:00:00Z",
    status: "completed",
    balanceAfterPkr: 3120,
  },
];

const CHART_DATA = [
  { date: "Jun 1", balance: 800 },
  { date: "Jun 2", balance: 1200 },
  { date: "Jun 3", balance: 3120 },
  { date: "Jun 4", balance: 2640 },
  { date: "Jun 5", balance: 2880 },
  { date: "Jun 6", balance: 2880 },
  { date: "Jun 7", balance: -120 },
  { date: "Jun 8", balance: 1200 },
  { date: "Jun 9", balance: 840 },
  { date: "Jun 10", balance: 3200 },
];

const TX_TYPE_FILTERS = [
  { label: "All", value: "all" },
  { label: "Top-ups", value: "top_up" },
  { label: "Commission", value: "commission" },
  { label: "Boosts", value: "boost_fee" },
  { label: "Refunds", value: "refund" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function txIcon(type: TxType) {
  switch (type) {
    case "top_up":
      return <ArrowUpRight className="w-4 h-4" />;
    case "commission_reserved":
      return <Clock className="w-4 h-4" />;
    case "commission_deducted":
      return <ArrowDownRight className="w-4 h-4" />;
    case "commission_released":
      return <RefreshCw className="w-4 h-4" />;
    case "boost_fee":
      return <Zap className="w-4 h-4" />;
    case "refund":
      return <CheckCircle className="w-4 h-4" />;
    default:
      return <ArrowUpRight className="w-4 h-4" />;
  }
}

function txColor(type: TxType): string {
  switch (type) {
    case "top_up":
    case "commission_released":
    case "refund":
      return "text-emerald-600 bg-emerald-50 border-emerald-100";
    case "commission_reserved":
      return "text-amber-600 bg-amber-50 border-amber-100";
    case "commission_deducted":
    case "boost_fee":
      return "text-red-500 bg-red-50 border-red-100";
    default:
      return "text-slate-500 bg-slate-50 border-slate-100";
  }
}

function txLabel(type: TxType): string {
  switch (type) {
    case "top_up":
      return "Top-up";
    case "commission_reserved":
      return "Hold";
    case "commission_deducted":
      return "Commission";
    case "commission_released":
      return "Released";
    case "boost_fee":
      return "Boost";
    case "refund":
      return "Refund";
    default:
      return "Transaction";
  }
}

function isCredit(type: TxType): boolean {
  return type === "top_up" || type === "commission_released" || type === "refund";
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

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 8px 32px -8px rgba(0,0,0,0.12)" }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl border border-black/5 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)] flex flex-col gap-3"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent ?? "bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]"}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-0.5 tracking-tight">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
    </motion.div>
  );
}

interface TooltipPayload {
  value: number;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  return (
    <div className="bg-white border border-black/5 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="text-slate-500 text-xs mb-1">{label}</p>
      <p className={`font-bold ${val >= 0 ? "text-emerald-600" : "text-red-500"}`}>
        {pkr(val)}
      </p>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function TaskerBalancePage() {
  const [filter, setFilter] = useState<string>("all");
  const [showInfo, setShowInfo] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentBalance = 3200;
  const reservedBalance = 360;
  const availableBalance = currentBalance - reservedBalance;

  const totalEarned = MOCK_TRANSACTIONS.filter(
    (t) => t.type === "top_up"
  ).reduce((s, t) => s + t.amountPkr, 0);

  const totalCommission = MOCK_TRANSACTIONS.filter(
    (t) => t.type === "commission_deducted"
  ).reduce((s, t) => s + Math.abs(t.amountPkr), 0);

  const filtered = MOCK_TRANSACTIONS.filter((tx) => {
    if (filter === "all") return true;
    if (filter === "commission")
      return (
        tx.type === "commission_reserved" ||
        tx.type === "commission_deducted" ||
        tx.type === "commission_released"
      );
    return tx.type === filter;
  });

  return (
    <main className="min-h-screen bg-[var(--background)] pb-20">
      {/* ── Header ── */}
      <Reveal>
        <section className="bg-white border-b border-black/5 px-4 py-10 md:py-14">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  <Wallet className="w-3.5 h-3.5" />
                  Tasker Wallet
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight text-balance">
                  Balance &amp; Transactions
                </h1>
                <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                  Track your prepaid balance, commission deductions, and full transaction history.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 bg-[var(--brand-primary)] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:opacity-90 transition-opacity self-start sm:self-auto"
              >
                <ArrowUpRight className="w-4 h-4" />
                Top Up Balance
              </motion.button>
            </div>
          </div>
        </section>
      </Reveal>

      <div className="max-w-5xl mx-auto px-4 mt-8 space-y-8">
        {/* ── Balance cards ── */}
        <Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<Wallet className="w-5 h-5" />}
              label="Current Balance"
              value={pkr(currentBalance)}
              sub={`Min. required: ${pkr(BALANCE_MINIMUM)}`}
              accent="bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]"
            />
            <StatCard
              icon={<Shield className="w-5 h-5" />}
              label="Reserved (On Hold)"
              value={pkr(reservedBalance)}
              sub="Held for active task"
              accent="bg-amber-50 text-amber-600"
            />
            <StatCard
              icon={<CheckCircle className="w-5 h-5" />}
              label="Available"
              value={pkr(availableBalance)}
              sub="Free to use for bids"
              accent="bg-emerald-50 text-emerald-600"
            />
            <StatCard
              icon={<TrendingDown className="w-5 h-5" />}
              label="Total Commission Paid"
              value={pkr(totalCommission)}
              sub={`${COMMISSION_RATE_PCT}% per completed task`}
              accent="bg-red-50 text-red-500"
            />
          </div>
        </Reveal>

        {/* ── Commission explainer ── */}
        <Reveal>
          <div className="bg-slate-50 border border-black/5 rounded-2xl p-5">
            <button
              onClick={() => setShowInfo((v) => !v)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
                <Info className="w-4 h-4 text-[var(--brand-primary)]" />
                How does the commission &amp; balance system work?
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showInfo ? "rotate-180" : ""}`}
              />
            </button>
            {showInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-4 grid sm:grid-cols-3 gap-4 text-sm text-slate-600"
              >
                <div className="bg-white rounded-xl p-4 border border-black/5">
                  <p className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-xs flex items-center justify-center font-bold">1</span>
                    Maintain Balance
                  </p>
                  <p className="leading-relaxed text-xs">
                    Keep at least {pkr(BALANCE_MINIMUM)} in your wallet to place bids. Without sufficient balance, you cannot be assigned tasks.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-black/5">
                  <p className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-xs flex items-center justify-center font-bold">2</span>
                    Commission Hold
                  </p>
                  <p className="leading-relaxed text-xs">
                    When assigned a task, {COMMISSION_RATE_PCT}% of your bid amount is reserved from your balance. This prevents overbidding beyond your capacity.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-black/5">
                  <p className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-xs flex items-center justify-center font-bold">3</span>
                    Deduction on Completion
                  </p>
                  <p className="leading-relaxed text-xs">
                    Once the poster marks the task complete, the held commission is permanently deducted. If cancelled, it is released back to your balance.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </Reveal>

        {/* ── Balance chart ── */}
        <Reveal>
          <div className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)] p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Balance Over Time</h2>
                <p className="text-xs text-slate-400 mt-0.5">Last 10 days</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                +{pkr(2400)} this week
              </div>
            </div>
            {mounted && (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={CHART_DATA} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--brand-primary)" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => `${v >= 0 ? "" : "-"}${Math.abs(v / 1000).toFixed(1)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="var(--brand-primary)"
                    strokeWidth={2}
                    fill="url(#balGrad)"
                    dot={false}
                    activeDot={{ r: 5, fill: "var(--brand-primary)", strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Reveal>

        {/* ── Transaction list ── */}
        <Reveal>
          <div className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)] overflow-hidden">
            {/* Header + filters */}
            <div className="px-6 py-5 border-b border-black/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-base font-bold text-slate-900">Transaction History</h2>
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                {TX_TYPE_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFilter(f.value)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-150 ${
                      filter === f.value
                        ? "bg-[var(--brand-primary)] text-white border-[var(--brand-primary)]"
                        : "bg-white text-slate-500 border-slate-200 hover:border-[var(--brand-primary)]/40"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rows */}
            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="divide-y divide-black/5"
            >
              {filtered.length === 0 && (
                <li className="px-6 py-12 text-center text-slate-400 text-sm">
                  No transactions found for this filter.
                </li>
              )}
              {filtered.map((tx) => (
                <motion.li
                  key={tx.id}
                  variants={fadeInUp}
                  className="px-6 py-4 flex items-start gap-4 hover:bg-slate-50/60 transition-colors duration-150"
                >
                  {/* Icon */}
                  <div
                    className={`mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0 ${txColor(tx.type)}`}
                  >
                    {txIcon(tx.type)}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {tx.description}
                        </p>
                        {tx.taskTitle && (
                          <p className="text-xs text-slate-400 mt-0.5 truncate">
                            Task: {tx.taskTitle}
                          </p>
                        )}
                        <p className="text-xs text-slate-400 mt-0.5">
                          {mounted ? `${formatDate(tx.date)} at ${formatTime(tx.date)}` : "—"}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p
                          className={`text-sm font-bold ${
                            isCredit(tx.type) ? "text-emerald-600" : "text-red-500"
                          }`}
                        >
                          {isCredit(tx.type) ? "+" : ""}
                          {pkr(Math.abs(tx.amountPkr))}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Bal: {pkr(tx.balanceAfterPkr)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${txColor(tx.type)}`}
                      >
                        {txLabel(tx.type)}
                      </span>
                      {tx.status === "completed" && (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                          <CheckCircle className="w-3 h-3" />
                          Settled
                        </span>
                      )}
                      {tx.status === "pending" && (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-500">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                      {tx.status === "failed" && (
                        <span className="inline-flex items-center gap-1 text-xs text-red-500">
                          <AlertCircle className="w-3 h-3" />
                          Failed
                        </span>
                      )}
                    </div>
                  </div>
                </motion.li>
              ))}
            </motion.ul>

            {/* Footer summary */}
            <div className="px-6 py-4 bg-slate-50 border-t border-black/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-500">
              <span>{filtered.length} transaction{filtered.length !== 1 ? "s" : ""} shown</span>
              <span>
                Commission rate: <strong className="text-slate-700">{COMMISSION_RATE_PCT}%</strong> of bid amount per completed task
              </span>
            </div>
          </div>
        </Reveal>

        {/* ── Top-up CTA ── */}
        <Reveal>
          <div className="rounded-2xl bg-[var(--brand-primary)] p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Keep your balance topped up
              </h2>
              <p className="text-white/80 text-sm mt-1 leading-relaxed max-w-md">
                A healthy balance means you can bid on more tasks without interruption. Top up via JazzCash, EasyPaisa, or bank transfer.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 bg-white text-[var(--brand-primary)] text-sm font-bold px-6 py-3 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:bg-white/90 transition-colors"
              >
                <ArrowUpRight className="w-4 h-4" />
                Top Up Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 bg-white/15 text-white text-sm font-semibold px-6 py-3 rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
              >
                View Payment Methods
              </motion.button>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}