"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ShoppingBag, Truck, Sparkles, Wrench, Clock, Monitor, Home, Circle, MapPin, DollarSign, Calendar, Zap, ChevronRight, ChevronLeft, Check, AlertCircle, Info, ArrowRight } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";
import {
  TASK_CATEGORIES, TaskCategory, COMMISSION_RATE, URGENCY_BOOST_PRICE_PKR,
  MIN_BUDGET_PKR, MAX_BUDGET_PKR, formatPKR
} from "@/lib/data";

const COMMISSION_RATE_DEFAULT = COMMISSION_RATE;
const URGENCY_BOOST_FEE_PKR = URGENCY_BOOST_PRICE_PKR;
const BUDGET_MIN_PKR = MIN_BUDGET_PKR;
const BUDGET_MAX_PKR = MAX_BUDGET_PKR;
const formatPkr = formatPKR;

type TimingWindow = "asap" | "morning" | "afternoon" | "evening" | "flexible";

const CITIES: { slug: string; name: string; isLive: boolean; emoji: string }[] = [
  { slug: "karachi", name: "Karachi", isLive: true, emoji: "🇵🇰" },
  { slug: "lahore", name: "Lahore", isLive: true, emoji: "🇵🇰" },
  { slug: "islamabad", name: "Islamabad", isLive: true, emoji: "🇵🇰" },
  { slug: "rawalpindi", name: "Rawalpindi", isLive: true, emoji: "🇵🇰" },
];

const NEIGHBOURHOODS: Record<string, string[]> = {
  karachi: [
    "Clifton", "DHA", "Gulshan-e-Iqbal", "North Nazimabad", "Korangi",
    "Saddar", "Malir", "Orangi Town", "Lyari", "Keamari",
  ],
  lahore: [
    "DHA Lahore", "Gulberg", "Model Town", "Johar Town", "Bahria Town",
    "Iqbal Town", "Cantt", "Wapda Town", "Faisal Town", "Shadman",
  ],
  islamabad: [
    "F-6", "F-7", "F-8", "G-9", "G-10", "G-11",
    "Blue Area", "I-8", "E-7", "Bahria Town Islamabad",
  ],
  rawalpindi: [
    "Saddar", "Cantt", "Satellite Town", "Chaklala", "Bahria Town",
    "Gulraiz", "Westridge", "Askari", "Adiala Road", "Murree Road",
  ],
};

const TIMING_OPTIONS: { key: TimingWindow; label: string; desc: string; urdu: string }[] = [
  { key: "asap", label: "ASAP", desc: "As soon as possible", urdu: "فوری" },
  { key: "morning", label: "Morning", desc: "6 AM – 12 PM", urdu: "صبح" },
  { key: "afternoon", label: "Afternoon", desc: "12 PM – 5 PM", urdu: "دوپہر" },
  { key: "evening", label: "Evening", desc: "5 PM – 9 PM", urdu: "شام" },
  { key: "flexible", label: "Flexible", desc: "Any time works", urdu: "لچکدار" },
];

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  ShoppingBag,
  Truck,
  Sparkles,
  Wrench,
  Clock,
  Monitor,
  Home,
  Circle,
};

const CATEGORY_META: Record<string, { icon: React.ElementType; color: string; bg: string; urdu: string }> = {
  "Errands & Shopping": { icon: ShoppingBag, color: "text-orange-600", bg: "bg-orange-50", urdu: "کام کاج" },
  "Moving & Delivery": { icon: Truck, color: "text-blue-600", bg: "bg-blue-50", urdu: "منتقلی" },
  "Cleaning": { icon: Sparkles, color: "text-emerald-600", bg: "bg-emerald-50", urdu: "صفائی" },
  "Small Repairs & Maintenance": { icon: Wrench, color: "text-red-600", bg: "bg-red-50", urdu: "مرمت" },
  "Queue & Appointment Standing": { icon: Clock, color: "text-purple-600", bg: "bg-purple-50", urdu: "قطار" },
  "Digital Help": { icon: Monitor, color: "text-cyan-600", bg: "bg-cyan-50", urdu: "ڈیجیٹل" },
  "Household Assistance": { icon: Home, color: "text-amber-600", bg: "bg-amber-50", urdu: "گھریلو" },
  "Other": { icon: Circle, color: "text-gray-500", bg: "bg-gray-50", urdu: "دیگر" },
};

const STEPS = [
  { id: 1, label: "Category", urdu: "قسم" },
  { id: 2, label: "Details", urdu: "تفصیل" },
  { id: 3, label: "Location", urdu: "جگہ" },
  { id: 4, label: "Timing", urdu: "وقت" },
  { id: 5, label: "Review", urdu: "جائزہ" },
];

const stepVariants: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, x: -32, transition: { duration: 0.25, ease: "easeIn" } },
};

const stepVariantsBack: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, x: 32, transition: { duration: 0.25, ease: "easeIn" } },
};

interface FormState {
  category: TaskCategory | "";
  title: string;
  description: string;
  city: string;
  area: string;
  budgetPkr: string;
  timing: TimingWindow | "";
  preferredDate: string;
  isUrgent: boolean;
}

const INITIAL_FORM: FormState = {
  category: "",
  title: "",
  description: "",
  city: "",
  area: "",
  budgetPkr: "",
  timing: "",
  preferredDate: "",
  isUrgent: false,
};

function commissionEstimate(budget: number): number {
  return Math.round(budget * COMMISSION_RATE_DEFAULT);
}

// ─── Pakistani-style Step Indicator ─────────────────────────────────────────

function PakStepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-sm mx-auto">
      {STEPS.map((step, idx) => {
        const isCompleted = current > step.id;
        const isActive = current === step.id;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300",
                  isCompleted
                    ? "bg-[var(--primary)] border-[var(--primary)] text-white"
                    : isActive
                    ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-[0_0_0_3px_rgba(245,166,35,0.2)]"
                    : "bg-white border-[var(--border)] text-[var(--muted-foreground)]"
                )}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.id}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium leading-none hidden sm:block",
                  isActive ? "text-[var(--accent)]" : isCompleted ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"
                )}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-8 sm:w-12 mx-1 transition-all duration-300",
                  current > step.id ? "bg-[var(--primary)]" : "bg-[var(--border)]"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Category Step ────────────────────────────────────────────────────────────

function CategoryStep({
  value,
  onChange,
}: {
  value: TaskCategory | "";
  onChange: (cat: TaskCategory) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-[var(--foreground)]">کام کی قسم چنیں</h2>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">Select the type of task</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {TASK_CATEGORIES.map((cat) => {
          const meta = CATEGORY_META[cat] ?? { icon: Circle, color: "text-gray-500", bg: "bg-gray-50", urdu: cat };
          const Icon = meta.icon;
          const isSelected = value === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onChange(cat)}
              className={cn(
                "relative flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 transition-all duration-200 text-left group hover:-translate-y-0.5 hover:shadow-md",
                isSelected
                  ? "border-[var(--accent)] bg-amber-50 shadow-[0_0_0_3px_rgba(245,166,35,0.15)]"
                  : "border-[var(--border)] bg-white hover:border-[var(--primary)]/40"
              )}
            >
              {isSelected && (
                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[var(--accent)] flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </span>
              )}
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", meta.bg)}>
                <Icon className={cn("w-5 h-5", meta.color)} />
              </div>
              <div className="text-center">
                <p className={cn("text-xs font-semibold leading-tight", isSelected ? "text-[var(--foreground)]" : "text-[var(--foreground)]")}>
                  {cat}
                </p>
                <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5 font-medium" dir="rtl">
                  {meta.urdu}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Details Step ─────────────────────────────────────────────────────────────

function DetailsStep({
  title,
  description,
  onTitleChange,
  onDescChange,
  errors,
}: {
  title: string;
  description: string;
  onTitleChange: (v: string) => void;
  onDescChange: (v: string) => void;
  errors: Record<string, string>;
}) {
  const MAX_DESC = 500;
  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-[var(--foreground)]">کام کی تفصیل</h2>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">Describe your task clearly</p>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-[var(--foreground)]">
          Task Title <span className="text-[var(--destructive)]">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="e.g. Grocery run from Imtiaz Store"
          maxLength={80}
          className={cn(
            "w-full px-4 py-3 rounded-xl border-2 bg-white text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)] transition-all duration-200 outline-none",
            errors.title
              ? "border-[var(--destructive)] focus:border-[var(--destructive)]"
              : "border-[var(--border)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(245,166,35,0.12)]"
          )}
        />
        {errors.title && (
          <p className="text-xs text-[var(--destructive)] flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {errors.title}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-[var(--foreground)]">
          Description <span className="text-[var(--destructive)]">*</span>
        </label>
        <div className="relative">
          <textarea
            value={description}
            onChange={(e) => onDescChange(e.target.value)}
            placeholder="Describe what needs to be done, any special requirements, tools needed, etc."
            rows={5}
            maxLength={MAX_DESC}
            className={cn(
              "w-full px-4 py-3 rounded-xl border-2 bg-white text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)] resize-none transition-all duration-200 outline-none",
              errors.description
                ? "border-[var(--destructive)] focus:border-[var(--destructive)]"
                : "border-[var(--border)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(245,166,35,0.12)]"
            )}
          />
          <span
            className={cn(
              "absolute bottom-3 right-3 text-xs font-medium",
              description.length > MAX_DESC * 0.9 ? "text-[var(--destructive)]" : "text-[var(--muted-foreground)]"
            )}
          >
            {description.length}/{MAX_DESC}
          </span>
        </div>
        {errors.description && (
          <p className="text-xs text-[var(--destructive)] flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {errors.description}
          </p>
        )}
        <p className="text-xs text-[var(--muted-foreground)] bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
          Do not share phone numbers, email, or social handles here. Use in-app messaging after assignment.
        </p>
      </div>
    </div>
  );
}

// ─── Location & Budget Step ───────────────────────────────────────────────────

function LocationBudgetStep({
  city,
  area,
  budgetPkr,
  onCityChange,
  onAreaChange,
  onBudgetChange,
  errors,
}: {
  city: string;
  area: string;
  budgetPkr: string;
  onCityChange: (v: string) => void;
  onAreaChange: (v: string) => void;
  onBudgetChange: (v: string) => void;
  errors: Record<string, string>;
}) {
  const neighbourhoods = city ? (NEIGHBOURHOODS[city] ?? []) : [];
  const budgetNum = parseFloat(budgetPkr);
  const isValidBudget = !isNaN(budgetNum) && budgetNum >= BUDGET_MIN_PKR && budgetNum <= BUDGET_MAX_PKR;

  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-[var(--foreground)]">جگہ اور بجٹ</h2>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">Location and budget details</p>
      </div>

      {/* City */}
      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-[var(--foreground)]">
          <MapPin className="inline w-3.5 h-3.5 mr-1 text-[var(--primary)]" />
          City <span className="text-[var(--destructive)]">*</span>
        </label>
        <div className="relative">
          <select
            value={city}
            onChange={(e) => { onCityChange(e.target.value); onAreaChange(""); }}
            className={cn(
              "w-full px-4 py-3 rounded-xl border-2 bg-white text-[var(--foreground)] text-sm appearance-none transition-all duration-200 outline-none cursor-pointer",
              errors.city
                ? "border-[var(--destructive)]"
                : "border-[var(--border)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(245,166,35,0.12)]"
            )}
          >
            <option value="">🇵🇰 شہر چنیں — Select city</option>
            {CITIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.emoji} {c.name}
              </option>
            ))}
          </select>
          <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] rotate-90 pointer-events-none" />
        </div>
        {errors.city && (
          <p className="text-xs text-[var(--destructive)] flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {errors.city}
          </p>
        )}
      </div>

      {/* Neighbourhood */}
      {city && (
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-[var(--foreground)]">
            Neighbourhood / Area
          </label>
          <div className="relative">
            <select
              value={area}
              onChange={(e) => onAreaChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] bg-white text-[var(--foreground)] text-sm appearance-none transition-all duration-200 outline-none cursor-pointer focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(245,166,35,0.12)]"
            >
              <option value="">علاقہ چنیں — Select area</option>
              {neighbourhoods.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] rotate-90 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Budget */}
      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-[var(--foreground)]">
          <DollarSign className="inline w-3.5 h-3.5 mr-1 text-[var(--primary)]" />
          Your Budget <span className="text-[var(--destructive)]">*</span>
        </label>
        <div className="flex items-stretch rounded-xl border-2 overflow-hidden transition-all duration-200 focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_3px_rgba(245,166,35,0.12)] border-[var(--border)]">
          <span className="flex items-center px-4 bg-[var(--accent)] text-white font-bold text-sm border-r border-amber-400 flex-shrink-0">
            Rs
          </span>
          <input
            type="number"
            value={budgetPkr}
            onChange={(e) => onBudgetChange(e.target.value)}
            placeholder="e.g. 1500"
            min={BUDGET_MIN_PKR}
            max={BUDGET_MAX_PKR}
            className="flex-1 px-4 py-3 bg-white text-[var(--foreground)] text-sm outline-none"
          />
        </div>
        <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] px-1">
          <span>Min: {formatPkr(BUDGET_MIN_PKR)}</span>
          {budgetPkr && !isNaN(parseFloat(budgetPkr)) && (
            <span className={cn("font-semibold", isValidBudget ? "text-emerald-600" : "text-[var(--destructive)]")}>
              {isValidBudget ? `Budget: ${formatPkr(parseFloat(budgetPkr))}` : "Out of range"}
            </span>
          )}
          <span>Max: {formatPkr(BUDGET_MAX_PKR)}</span>
        </div>
        {errors.budgetPkr && (
          <p className="text-xs text-[var(--destructive)] flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {errors.budgetPkr}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Timing Step ──────────────────────────────────────────────────────────────

function TimingStep({
  timing,
  preferredDate,
  onTimingChange,
  onDateChange,
  errors,
}: {
  timing: TimingWindow | "";
  preferredDate: string;
  onTimingChange: (v: TimingWindow) => void;
  onDateChange: (v: string) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-[var(--foreground)]">وقت کا انتخاب</h2>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">When do you need this done?</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {TIMING_OPTIONS.map((opt) => {
          const isSelected = timing === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => onTimingChange(opt.key)}
              className={cn(
                "flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                isSelected
                  ? "border-[var(--accent)] bg-amber-50 shadow-[0_0_0_3px_rgba(245,166,35,0.15)]"
                  : "border-[var(--border)] bg-white hover:border-[var(--primary)]/40"
              )}
            >
              <span className={cn("text-base font-bold", isSelected ? "text-[var(--accent)]" : "text-[var(--foreground)]")}>
                {opt.label}
              </span>
              <span className="text-xs text-[var(--muted-foreground)]">{opt.desc}</span>
              <span className="text-[10px] font-medium text-[var(--primary)]" dir="rtl">{opt.urdu}</span>
              {isSelected && (
                <span className="w-5 h-5 rounded-full bg-[var(--accent)] flex items-center justify-center mt-1">
                  <Check className="w-3 h-3 text-white" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {errors.timing && (
        <p className="text-xs text-[var(--destructive)] flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> {errors.timing}
        </p>
      )}

      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-[var(--foreground)]">
          <Calendar className="inline w-3.5 h-3.5 mr-1 text-[var(--primary)]" />
          Preferred Date <span className="text-[var(--muted-foreground)] font-normal">(optional)</span>
        </label>
        <input
          type="date"
          value={preferredDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] bg-white text-[var(--foreground)] text-sm outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(245,166,35,0.12)] transition-all duration-200"
        />
      </div>
    </div>
  );
}

// ─── Review Step ──────────────────────────────────────────────────────────────

function ReviewStep({
  form,
  onUrgentToggle,
  submitted,
}: {
  form: FormState;
  onUrgentToggle: () => void;
  submitted: boolean;
}) {
  const budget = parseFloat(form.budgetPkr) || 0;
  const commission = commissionEstimate(budget);
  const commissionPct = Math.round(COMMISSION_RATE_DEFAULT * 100);
  const cityObj = CITIES.find((c) => c.slug === form.city);
  const meta = form.category ? CATEGORY_META[form.category] : null;
  const Icon = meta?.icon ?? Circle;
  const timingOpt = TIMING_OPTIONS.find((t) => t.key === form.timing);

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-[var(--foreground)]">جائزہ لیں</h2>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">Review your task before posting</p>
      </div>

      {/* Summary card */}
      <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden shadow-[0_2px_12px_rgba(26,26,46,0.06)]">
        {/* Card header */}
        <div className="bg-gradient-to-r from-[var(--primary)] to-[#155a8a] px-5 py-4">
          <div className="flex items-center gap-3">
            {meta && (
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", meta.bg)}>
                <Icon className={cn("w-5 h-5", meta.color)} />
              </div>
            )}
            <div>
              <p className="text-white/70 text-xs font-medium">{form.category}</p>
              <p className="text-white font-bold text-base leading-tight">{form.title || "(No title)"}</p>
            </div>
          </div>
        </div>

        {/* Card body */}
        <div className="p-5 space-y-3">
          {form.description && (
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed line-clamp-3">
              {form.description}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[var(--primary)] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-[var(--muted-foreground)]">Location</p>
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  {cityObj?.name ?? form.city}{form.area ? `, ${form.area}` : ""}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-[var(--primary)] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-[var(--muted-foreground)]">Timing</p>
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  {timingOpt?.label ?? form.timing}
                  {form.preferredDate ? ` · ${form.preferredDate}` : ""}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
            <span className="text-sm text-[var(--muted-foreground)]">Your Budget</span>
            <span className="text-lg font-bold text-[var(--primary)]">{formatPkr(budget)}</span>
          </div>
        </div>
      </div>

      {/* Commission info box */}
      {budget > 0 && (
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
          <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-800">Platform Fee (for Taskers)</p>
            <p className="text-xs text-blue-600 mt-0.5">
              Taskers pay a {commissionPct}% commission on completed work.
              Estimated: <span className="font-bold">{formatPkr(commission)}</span> on your budget.
            </p>
            <p className="text-xs text-blue-500 mt-1">Posting is free for you as a poster.</p>
          </div>
        </div>
      )}

      {/* Urgency boost card */}
      <div
        className={cn(
          "rounded-xl border-2 p-4 transition-all duration-200 cursor-pointer",
          form.isUrgent
            ? "border-[var(--accent)] bg-amber-50"
            : "border-[var(--border)] bg-white hover:border-[var(--accent)]/50"
        )}
        onClick={onUrgentToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onUrgentToggle()}
        aria-pressed={form.isUrgent}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              form.isUrgent ? "bg-[var(--accent)]" : "bg-amber-100"
            )}>
              <Zap className={cn("w-5 h-5", form.isUrgent ? "text-white" : "text-amber-600")} />
            </div>
            <div>
              <p className="font-bold text-sm text-[var(--foreground)]">Urgency Boost</p>
              <p className="text-xs text-[var(--muted-foreground)]">فوری بوسٹ — Get more bids faster</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-[var(--accent)]">{formatPkr(URGENCY_BOOST_FEE_PKR)}</span>
            <div
              className={cn(
                "w-11 h-6 rounded-full transition-all duration-200 relative flex-shrink-0",
                form.isUrgent ? "bg-[var(--accent)]" : "bg-[var(--border)]"
              )}
            >
              <div
                className={cn(
                  "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200",
                  form.isUrgent ? "left-5" : "left-0.5"
                )}
              />
            </div>
          </div>
        </div>
        {form.isUrgent && (
          <p className="text-xs text-amber-700 mt-3 bg-amber-100 rounded-lg px-3 py-2">
            Your task will appear at the top of the feed with an Urgent badge. {formatPkr(URGENCY_BOOST_FEE_PKR)} will be charged on posting.
          </p>
        )}
      </div>

      {submitted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-3 py-6 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
            <Check className="w-8 h-8 text-emerald-600" />
          </div>
          <p className="font-bold text-lg text-[var(--foreground)]">کام پوسٹ ہو گیا!</p>
          <p className="text-sm text-[var(--muted-foreground)]">Task posted successfully. Taskers will start bidding soon.</p>
        </motion.div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PostTaskPage() {
  const t = useTranslations();
  void t;

  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const updateForm = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });
  }, []);

  function validateStep(step: number): boolean {
    const newErrors: Record<string, string> = {};
    if (step === 1 && !form.category) newErrors.category = "Please select a category.";
    if (step === 2) {
      if (!form.title.trim()) newErrors.title = "Task title is required.";
      if (!form.description.trim()) newErrors.description = "Description is required.";
    }
    if (step === 3) {
      if (!form.city) newErrors.city = "Please select a city.";
      const b = parseFloat(form.budgetPkr);
      if (!form.budgetPkr || isNaN(b)) newErrors.budgetPkr = "Please enter a budget.";
      else if (b < BUDGET_MIN_PKR) newErrors.budgetPkr = `Minimum budget is ${formatPkr(BUDGET_MIN_PKR)}.`;
      else if (b > BUDGET_MAX_PKR) newErrors.budgetPkr = `Maximum budget is ${formatPkr(BUDGET_MAX_PKR)}.`;
    }
    if (step === 4 && !form.timing) newErrors.timing = "Please select a timing window.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function goNext() {
    if (!validateStep(currentStep)) return;
    setDirection("forward");
    setCurrentStep((s) => Math.min(s + 1, STEPS.length));
  }

  function goBack() {
    setDirection("back");
    setCurrentStep((s) => Math.max(s - 1, 1));
  }

  function handleSubmit() {
    if (!validateStep(5)) return;
    setSubmitted(true);
  }

  const activeVariant = direction === "forward" ? stepVariants : stepVariantsBack;

  const budget = parseFloat(form.budgetPkr) || 0;
  const commission = commissionEstimate(budget);
  const commissionPct = Math.round(COMMISSION_RATE_DEFAULT * 100);
  void commission;
  void commissionPct;
  void CATEGORY_ICONS;

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* ── Pakistani-style Header ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1A1A2E 0%, #1B6CA8 50%, #155a8a 100%)",
        }}
      >
        {/* Decorative crescent-inspired arc */}
        <div
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #F5A623 0%, transparent 70%)" }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-0 w-full h-1"
          style={{ background: "linear-gradient(90deg, #F5A623 0%, #F5A623 33%, transparent 33%)" }}
          aria-hidden="true"
        />

        <div className="container relative z-10 py-10 md:py-14">
          <div className="max-w-2xl mx-auto text-center">
            {/* Urdu heading */}
            <p
              className="text-[var(--accent)] text-2xl md:text-3xl font-bold mb-1 leading-relaxed"
              dir="rtl"
              lang="ur"
            >
              نیا کام پوسٹ کریں
            </p>
            <h1 className="text-white text-xl md:text-2xl font-bold mb-3">
              Post a New Task
            </h1>
            <p className="text-white/70 text-sm">
              Describe your task, set your budget, and get bids from verified taskers nearby.
            </p>

            {/* Step indicator */}
            <div className="mt-8">
              <PakStepIndicator current={currentStep} total={STEPS.length} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Form Card ── */}
      <section className="container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-[var(--border)] shadow-[0_4px_24px_rgba(26,26,46,0.08)] overflow-hidden">
            {/* Step content */}
            <div className="p-6 md:p-8 min-h-[420px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentStep}
                  variants={activeVariant}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {currentStep === 1 && (
                    <CategoryStep
                      value={form.category}
                      onChange={(cat) => updateForm("category", cat)}
                    />
                  )}
                  {currentStep === 2 && (
                    <DetailsStep
                      title={form.title}
                      description={form.description}
                      onTitleChange={(v) => updateForm("title", v)}
                      onDescChange={(v) => updateForm("description", v)}
                      errors={errors}
                    />
                  )}
                  {currentStep === 3 && (
                    <LocationBudgetStep
                      city={form.city}
                      area={form.area}
                      budgetPkr={form.budgetPkr}
                      onCityChange={(v) => updateForm("city", v)}
                      onAreaChange={(v) => updateForm("area", v)}
                      onBudgetChange={(v) => updateForm("budgetPkr", v)}
                      errors={errors}
                    />
                  )}
                  {currentStep === 4 && (
                    <TimingStep
                      timing={form.timing}
                      preferredDate={form.preferredDate}
                      onTimingChange={(v) => updateForm("timing", v)}
                      onDateChange={(v) => updateForm("preferredDate", v)}
                      errors={errors}
                    />
                  )}
                  {currentStep === 5 && (
                    <ReviewStep
                      form={form}
                      onUrgentToggle={() => updateForm("isUrgent", !form.isUrgent)}
                      submitted={submitted}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation footer */}
            {!submitted && (
              <div className="px-6 md:px-8 py-5 border-t border-[var(--border)] bg-[var(--background)] flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={currentStep === 1}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 font-semibold text-sm transition-all duration-200",
                    currentStep === 1
                      ? "border-[var(--border)] text-[var(--muted-foreground)] opacity-40 cursor-not-allowed"
                      : "border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
                  )}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>

                {/* Step label */}
                <span className="text-xs text-[var(--muted-foreground)] font-medium hidden sm:block">
                  Step {currentStep} of {STEPS.length} — {STEPS[currentStep - 1]?.label}
                </span>

                {currentStep < STEPS.length ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm hover:bg-[var(--primary-hover)] transition-all duration-200 shadow-[0_2px_8px_rgba(27,108,168,0.3)]"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--accent)] text-white font-bold text-sm hover:bg-amber-500 transition-all duration-200 shadow-[0_2px_8px_rgba(245,166,35,0.35)]"
                  >
                    Post Task
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Trust note */}
          <Reveal delay={0.1}>
            <div className="mt-6 flex items-start gap-3 bg-white rounded-xl border border-[var(--border)] px-4 py-3 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-[var(--primary)]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--foreground)]">Posting is free for you</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                  Only taskers pay a small commission on completed work. Your contact details stay private until you accept a bid.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
