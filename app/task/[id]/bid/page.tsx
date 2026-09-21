"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight, MapPin, Clock, Wallet, AlertTriangle, CheckCircle, Shield, Info, Zap, ArrowRight } from 'lucide-react';
import { cn } from "@/lib/utils";
import { COMMISSION_RATE, MIN_BALANCE_PKR, formatPKR } from "@/lib/data";
import { Reveal } from "@/components/Reveal";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_TASK = {
  id: "task-001",
  title: "Help me move furniture from DHA Phase 5 to Gulshan",
  area: "DHA Phase 5, Karachi",
  budgetPkr: 3500,
  timing: "Morning (6 AM – 12 PM)",
  preferredDate: "15 Feb 2025",
  category: "Moving & Delivery",
};

const MOCK_TASKER_BALANCE = 1800; // PKR — mock current balance

// ─── Helpers ─────────────────────────────────────────────────────────────────

function calcCommission(amount: number): number {
  return Math.round(amount * COMMISSION_RATE);
}

function calcNetEarnings(amount: number): number {
  return amount - calcCommission(amount);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BidSubmitPage() {
  const params = useParams();
  const taskId = (params?.id as string) ?? MOCK_TASK.id;

  const task = MOCK_TASK; // In production: fetch by taskId
  const currentBalance = MOCK_TASKER_BALANCE;

  const [bidAmount, setBidAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const bidAmountNum = useMemo(() => {
    const n = parseFloat(bidAmount);
    return isNaN(n) || n <= 0 ? 0 : n;
  }, [bidAmount]);

  const commission = useMemo(() => calcCommission(bidAmountNum), [bidAmountNum]);
  const netEarnings = useMemo(() => calcNetEarnings(bidAmountNum), [bidAmountNum]);
  const balanceSufficient = currentBalance >= MIN_BALANCE_PKR;
  const canSubmit = bidAmountNum > 0 && note.trim().length > 0 && balanceSufficient && !submitting;

  const NOTE_MAX = 400;
  const noteCharsLeft = NOTE_MAX - note.length;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1400);
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <main className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4">
        <div className="card max-w-md w-full p-8 text-center">
          {/* Green checkmark circle */}
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-xl font-bold text-[var(--foreground)] mb-2">
            Bid Jama Ho Gayi!{" "}
            <span className="block text-sm font-normal text-[var(--muted-foreground)] mt-1 urdu-text" dir="rtl">
              بولی کامیابی سے جمع ہو گئی
            </span>
          </h1>
          <p className="text-[var(--muted-foreground)] text-sm leading-relaxed mb-6">
            Your bid of{" "}
            <span className="font-bold text-[var(--primary)]">{formatPKR(bidAmountNum)}</span>{" "}
            has been submitted. The poster will review all bids and notify you if selected.
          </p>
          <div className="flex flex-col gap-3">
            <Link href={`/task/${taskId}`} className="btn-primary w-full">
              Task Dekhein
            </Link>
            <Link href="/my-bids-tasker" className="btn-secondary w-full">
              Meri Bids
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ── Main form ──────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[var(--background)] pb-16">
      {/* ── Top accent bar ── */}
      <div className="h-1 w-full bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--primary)]" />

      <div className="container py-6 max-w-2xl">
        {/* ── Breadcrumb ── */}
        <Reveal>
          <nav className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] mb-5" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[var(--primary)] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <Link href={`/task/${taskId}`} className="hover:text-[var(--primary)] transition-colors">
              Task Details
            </Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <span className="text-[var(--foreground)] font-medium">Bid Submit Karein</span>
          </nav>
        </Reveal>

        {/* ── Page heading ── */}
        <Reveal delay={0.05}>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
              Bid Submit Karein
            </h1>
            <p
              className="text-base text-[var(--muted-foreground)] mt-0.5"
              dir="rtl"
              lang="ur"
            >
              بولی جمع کریں
            </p>
          </div>
        </Reveal>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* ── 1. Task summary card ── */}
          <Reveal delay={0.08}>
            <div className="card overflow-hidden">
              {/* Left accent border via inner layout */}
              <div className="flex">
                <div className="w-1 flex-shrink-0 bg-[var(--primary)] rounded-l-[var(--radius)]" />
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--primary)] mb-1 block">
                        {task.category}
                      </span>
                      <h2 className="font-bold text-[var(--foreground)] text-base leading-snug">
                        {task.title}
                      </h2>
                    </div>
                    <span className="flex-shrink-0 text-xs font-bold text-[var(--primary)] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                      {formatPKR(task.budgetPkr)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-[var(--muted-foreground)]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[var(--primary)]" />
                      {task.area}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[var(--accent)]" />
                      {task.timing}
                    </span>
                    {task.preferredDate && (
                      <span className="flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                        {task.preferredDate}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* ── 2. Pre-bid transparency box ── */}
          <Reveal delay={0.12}>
            <div className="rounded-[var(--radius)] border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span className="text-sm font-semibold text-amber-800">
                  Bid se Pehle Jaanein — Fee Transparency
                </span>
              </div>

              <div className="space-y-2 text-sm">
                {/* Task budget */}
                <div className="flex justify-between items-center">
                  <span className="text-amber-700">Task Budget (Poster ka)</span>
                  <span className="font-semibold text-amber-900">{formatPKR(task.budgetPkr)}</span>
                </div>

                {/* Bid amount */}
                <div className="flex justify-between items-center">
                  <span className="text-amber-700">Aapki Bid</span>
                  <span className="font-semibold text-amber-900">
                    {bidAmountNum > 0 ? formatPKR(bidAmountNum) : "—"}
                  </span>
                </div>

                {/* Commission */}
                <div className="flex justify-between items-center">
                  <span className="text-amber-700">
                    Commission ({Math.round(COMMISSION_RATE * 100)}%)
                  </span>
                  <span className="font-semibold text-red-600">
                    {bidAmountNum > 0 ? `− ${formatPKR(commission)}` : "—"}
                  </span>
                </div>

                <div className="border-t border-amber-200 my-1" />

                {/* Net earnings */}
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-amber-800">Aapki Net Kamai</span>
                  <span className="font-bold text-emerald-700 text-base">
                    {bidAmountNum > 0 ? formatPKR(netEarnings) : "—"}
                  </span>
                </div>

                <div className="border-t border-amber-200 my-1" />

                {/* Required balance */}
                <div className="flex justify-between items-center">
                  <span className="text-amber-700">Minimum Balance Chahiye</span>
                  <span className="font-semibold text-amber-900">{formatPKR(MIN_BALANCE_PKR)}</span>
                </div>

                {/* Current balance */}
                <div className="flex justify-between items-center">
                  <span className="text-amber-700">Aapka Balance</span>
                  <span
                    className={cn(
                      "font-bold text-base",
                      balanceSufficient ? "text-emerald-600" : "text-red-600"
                    )}
                  >
                    {formatPKR(currentBalance)}
                    {balanceSufficient ? (
                      <CheckCircle className="inline w-3.5 h-3.5 ml-1 mb-0.5" />
                    ) : (
                      <AlertTriangle className="inline w-3.5 h-3.5 ml-1 mb-0.5" />
                    )}
                  </span>
                </div>
              </div>

              {/* Insufficient balance warning */}
              {!balanceSufficient && (
                <div className="mt-3 rounded-lg bg-red-50 border border-red-200 p-3 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-red-700 mb-0.5">Balance Kam Hai</p>
                    <p className="text-xs text-red-600">
                      Bid karne ke liye aapko kam az kam{" "}
                      <span className="font-bold">{formatPKR(MIN_BALANCE_PKR)}</span> balance chahiye.{" "}
                      <Link
                        href="/tasker-balance-transaction-history"
                        className="underline font-semibold hover:text-red-800"
                      >
                        Balance Top Up Karein
                      </Link>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Reveal>

          {/* ── 3. Bid amount input ── */}
          <Reveal delay={0.16}>
            <div className="card p-4">
              <label
                htmlFor="bid-amount"
                className="block text-sm font-semibold text-[var(--foreground)] mb-1"
              >
                Apni Bid Likhein
                <span className="text-[var(--muted-foreground)] font-normal ml-1 text-xs">
                  (PKR mein)
                </span>
              </label>
              <p className="text-xs text-[var(--muted-foreground)] mb-3">
                Poster ke budget se zyada ya kam bid kar sakte hain.
              </p>

              {/* Input with Rs prefix */}
              <div className="flex items-center border-2 border-[var(--border)] rounded-[var(--radius)] overflow-hidden focus-within:border-[var(--primary)] transition-colors">
                <span className="px-3 py-3 bg-[var(--background)] text-[var(--accent)] font-bold text-base border-r border-[var(--border)] select-none">
                  Rs
                </span>
                <input
                  id="bid-amount"
                  type="number"
                  min={200}
                  max={50000}
                  step={50}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="Maslan: 3000"
                  className="flex-1 px-3 py-3 text-base font-bold text-[var(--foreground)] bg-white outline-none placeholder:text-[var(--border)] placeholder:font-normal"
                  aria-label="Bid amount in PKR"
                />
              </div>

              {/* Real-time commission breakdown */}
              {bidAmountNum > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="rounded-lg bg-blue-50 border border-blue-100 p-2.5 text-center">
                    <p className="text-[10px] text-blue-500 font-medium uppercase tracking-wide mb-0.5">Aapki Bid</p>
                    <p className="text-sm font-bold text-blue-700">{formatPKR(bidAmountNum)}</p>
                  </div>
                  <div className="rounded-lg bg-red-50 border border-red-100 p-2.5 text-center">
                    <p className="text-[10px] text-red-400 font-medium uppercase tracking-wide mb-0.5">Commission</p>
                    <p className="text-sm font-bold text-red-600">− {formatPKR(commission)}</p>
                  </div>
                  <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-2.5 text-center">
                    <p className="text-[10px] text-emerald-500 font-medium uppercase tracking-wide mb-0.5">Net Kamai</p>
                    <p className="text-sm font-bold text-emerald-700">{formatPKR(netEarnings)}</p>
                  </div>
                </div>
              )}
            </div>
          </Reveal>

          {/* ── 4. Bid note textarea ── */}
          <Reveal delay={0.2}>
            <div className="card p-4">
              <label
                htmlFor="bid-note"
                className="block text-sm font-semibold text-[var(--foreground)] mb-1"
              >
                Apna Note Likhein
                <span
                  className="block text-xs font-normal text-[var(--muted-foreground)] mt-0.5"
                  dir="rtl"
                  lang="ur"
                >
                  اپنا نوٹ لکھیں
                </span>
              </label>
              <p className="text-xs text-[var(--muted-foreground)] mb-3">
                Poster ko batayein ke aap is kaam ke liye kyun best hain.
              </p>
              <textarea
                id="bid-note"
                rows={5}
                maxLength={NOTE_MAX}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Describe your experience and why you are the best fit for this task..."
                className="w-full border-2 border-[var(--border)] rounded-[var(--radius)] px-3 py-2.5 text-sm text-[var(--foreground)] bg-white outline-none focus:border-[var(--primary)] transition-colors resize-none placeholder:text-[var(--border)]"
                aria-label="Bid note"
              />
              <div className="flex justify-end mt-1">
                <span
                  className={cn(
                    "text-xs font-medium",
                    noteCharsLeft < 50 ? "text-amber-500" : "text-[var(--muted-foreground)]"
                  )}
                >
                  {noteCharsLeft} characters remaining
                </span>
              </div>
            </div>
          </Reveal>

          {/* ── 5. Safety reminder ── */}
          <Reveal delay={0.24}>
            <div className="flex items-start gap-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-4 py-3">
              <Shield className="w-4 h-4 text-[var(--primary)] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                <span className="font-semibold text-[var(--foreground)]">Yaad Rakhein:</span>{" "}
                Apna phone number ya contact details bid note mein mat likhein. Hamara system inhe automatically hata deta hai. Asan Kaam ke andar hi baat karein — yeh aapki aur poster ki dono ki hifazat ke liye hai.
              </p>
            </div>
          </Reveal>

          {/* ── 6. Submit button ── */}
          <Reveal delay={0.28}>
            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={!canSubmit}
                className={cn(
                  "btn-primary w-full py-3.5 text-base font-bold tracking-wide transition-all duration-200",
                  !canSubmit && "opacity-50 cursor-not-allowed"
                )}
                aria-disabled={!canSubmit}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Jama Ho Rahi Hai...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Bid Submit Karein
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>

              {!balanceSufficient && (
                <Link
                  href="/tasker-balance-transaction-history"
                  className="btn-secondary w-full py-3 text-sm font-semibold text-center"
                >
                  <Wallet className="w-4 h-4 inline mr-1.5" />
                  Balance Top Up Karein
                </Link>
              )}

              <Link
                href={`/task/${taskId}`}
                className="text-center text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors py-1"
              >
                Wapas Jayein
              </Link>
            </div>
          </Reveal>
        </form>
      </div>
    </main>
  );
}
