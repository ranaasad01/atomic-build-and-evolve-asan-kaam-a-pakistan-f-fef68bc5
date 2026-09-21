"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ShoppingBag, Truck, Sparkles, Wrench, Clock, Monitor, Home, Circle, MapPin, DollarSign, Calendar, Zap, ChevronRight, ChevronLeft, Check, AlertCircle, Info, ArrowRight } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";
import { TASK_CATEGORIES, TaskCategory } from "@/lib/data";
type CITIES = any;
const CITIES: any = [];
type COMMISSION_RATE_DEFAULT = any;
const COMMISSION_RATE_DEFAULT: any = [];
type URGENCY_BOOST_FEE_PKR = any;
const URGENCY_BOOST_FEE_PKR: any = [];
type BUDGET_MIN_PKR = any;
const BUDGET_MIN_PKR: any = [];
type BUDGET_MAX_PKR = any;
const BUDGET_MAX_PKR: any = [];
type formatPkr = any;
const formatPkr: any = [];
type TimingWindow = any;
const TimingWindow: any = [];

// ─── inline neighbourhood data ───────────────────────────────────────────────
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

const TIMING_OPTIONS: { key: TimingWindow; label: string; desc: string }[] = [
  { key: "asap", label: "ASAP", desc: "As soon as possible" },
  { key: "morning", label: "Morning", desc: "6 AM – 12 PM" },
  { key: "afternoon", label: "Afternoon", desc: "12 PM – 5 PM" },
  { key: "evening", label: "Evening", desc: "5 PM – 9 PM" },
  { key: "flexible", label: "Flexible", desc: "Any time works" },
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

const STEPS = [
  { id: 1, label: "Category" },
  { id: 2, label: "Details" },
  { id: 3, label: "Location & Budget" },
  { id: 4, label: "Timing" },
  { id: 5, label: "Review" },
];

// ─── animation variants ───────────────────────────────────────────────────────
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

// ─── form state type ──────────────────────────────────────────────────────────
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

// ─── helper ───────────────────────────────────────────────────────────────────
function commissionEstimate(budget: number): number {
  return Math.round(budget * COMMISSION_RATE_DEFAULT);
}

// ─── sub-components (inline) ─────────────────────────────────────────────────

function ProgressStepper({ current }: { current: number }) {
  const t = useTranslations();
  return (
    <nav aria-label={t("postTask.stepper.ariaLabel")} className="mb-10">
      <ol className="flex items-center gap-0">
        {STEPS.map((step, idx) => {
          const done = current > step.id;
          const active = current === step.id;
          return (
            <li key={step.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-300",
                    done
                      ? "bg-[var(--accent)] border-[var(--accent)] text-black"
                      : active
                      ? "border-[var(--accent)] text-[var(--accent)] bg-transparent"
                      : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] bg-transparent",
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : step.id}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium hidden sm:block",
                    active
                      ? "text-[var(--accent)]"
                      : done
                      ? "text-[hsl(var(--foreground))]"
                      : "text-[hsl(var(--muted-foreground))]",
                  )}
                >
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2 transition-all duration-500",
                    done ? "bg-[var(--accent)]" : "bg-[hsl(var(--border))]",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
      {msg}
    </p>
  );
}

function StepCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 sm:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

// ─── Step 1: Category ─────────────────────────────────────────────────────────
function StepCategory({
  value,
  onChange,
  error,
}: {
  value: TaskCategory | "";
  onChange: (v: TaskCategory) => void;
  error?: string;
}) {
  const t = useTranslations();
  return (
    <StepCard>
      <h2 className="text-xl font-bold text-[hsl(var(--foreground))] mb-1">
        {t("postTask.step1.heading")}
      </h2>
      <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6">
        {t("postTask.step1.sub")}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {TASK_CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.icon] ?? Circle;
          const selected = value === cat.key;
          return (
            <motion.button
              key={cat.key}
              type="button"
              onClick={() => onChange(cat.key)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "flex flex-col items-center gap-2.5 rounded-xl border-2 p-4 text-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
                selected
                  ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[hsl(var(--foreground))]"
                  : "border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--muted-foreground))] hover:border-[var(--accent)]/50 hover:text-[hsl(var(--foreground))]",
              )}
              aria-pressed={selected}
            >
              <Icon
                className={cn(
                  "h-7 w-7 transition-colors",
                  selected ? "text-[var(--accent)]" : "text-[hsl(var(--muted-foreground))]",
                )}
                aria-hidden="true"
              />
              <span className="text-xs font-semibold leading-tight">{cat.label}</span>
            </motion.button>
          );
        })}
      </div>
      <FieldError msg={error} />
    </StepCard>
  );
}

// ─── Step 2: Details ──────────────────────────────────────────────────────────
function StepDetails({
  title,
  description,
  onTitle,
  onDesc,
  errors,
}: {
  title: string;
  description: string;
  onTitle: (v: string) => void;
  onDesc: (v: string) => void;
  errors: { title?: string; description?: string };
}) {
  const t = useTranslations();
  return (
    <StepCard>
      <h2 className="text-xl font-bold text-[hsl(var(--foreground))] mb-1">
        {t("postTask.step2.heading")}
      </h2>
      <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6">
        {t("postTask.step2.sub")}
      </p>
      <div className="space-y-5">
        <div>
          <label
            htmlFor="task-title"
            className="block text-sm font-semibold text-[hsl(var(--foreground))] mb-1.5"
          >
            {t("postTask.step2.titleLabel")}
          </label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => onTitle(e.target.value)}
            placeholder={t("postTask.step2.titlePlaceholder")}
            maxLength={100}
            className={cn(
              "w-full rounded-xl border bg-[hsl(var(--background))] px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] outline-none transition-all focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)]",
              errors.title ? "border-red-500" : "border-[hsl(var(--border))]",
            )}
          />
          <div className="flex justify-between mt-1">
            <FieldError msg={errors.title} />
            <span className="text-xs text-[hsl(var(--muted-foreground))] ml-auto">
              {title.length}/100
            </span>
          </div>
        </div>
        <div>
          <label
            htmlFor="task-desc"
            className="block text-sm font-semibold text-[hsl(var(--foreground))] mb-1.5"
          >
            {t("postTask.step2.descLabel")}
          </label>
          <textarea
            id="task-desc"
            value={description}
            onChange={(e) => onDesc(e.target.value)}
            placeholder={t("postTask.step2.descPlaceholder")}
            rows={5}
            maxLength={1000}
            className={cn(
              "w-full rounded-xl border bg-[hsl(var(--background))] px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] outline-none transition-all focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] resize-none",
              errors.description ? "border-red-500" : "border-[hsl(var(--border))]",
            )}
          />
          <div className="flex justify-between mt-1">
            <FieldError msg={errors.description} />
            <span className="text-xs text-[hsl(var(--muted-foreground))] ml-auto">
              {description.length}/1000
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4 flex gap-3">
          <Info className="h-4 w-4 text-[var(--accent)] flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
            {t("postTask.step2.tip")}
          </p>
        </div>
      </div>
    </StepCard>
  );
}

// ─── Step 3: Location & Budget ────────────────────────────────────────────────
function StepLocationBudget({
  city,
  area,
  budgetPkr,
  onCity,
  onArea,
  onBudget,
  errors,
}: {
  city: string;
  area: string;
  budgetPkr: string;
  onCity: (v: string) => void;
  onArea: (v: string) => void;
  onBudget: (v: string) => void;
  errors: { city?: string; area?: string; budgetPkr?: string };
}) {
  const t = useTranslations();
  const liveCities = CITIES.filter((c) => c.isLive);
  const neighbourhoods = city ? (NEIGHBOURHOODS[city] ?? []) : [];
  const budgetNum = parseFloat(budgetPkr) || 0;
  const commission = commissionEstimate(budgetNum);

  return (
    <StepCard>
      <h2 className="text-xl font-bold text-[hsl(var(--foreground))] mb-1">
        {t("postTask.step3.heading")}
      </h2>
      <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6">
        {t("postTask.step3.sub")}
      </p>
      <div className="space-y-5">
        {/* City */}
        <div>
          <label
            htmlFor="task-city"
            className="block text-sm font-semibold text-[hsl(var(--foreground))] mb-1.5"
          >
            {t("postTask.step3.cityLabel")}
          </label>
          <div className="relative">
            <MapPin
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]"
              aria-hidden="true"
            />
            <select
              id="task-city"
              value={city}
              onChange={(e) => { onCity(e.target.value); onArea(""); }}
              className={cn(
                "w-full rounded-xl border bg-[hsl(var(--background))] pl-9 pr-4 py-3 text-sm text-[hsl(var(--foreground))] outline-none transition-all focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] appearance-none",
                errors.city ? "border-red-500" : "border-[hsl(var(--border))]",
              )}
            >
              <option value="">{t("postTask.step3.cityPlaceholder")}</option>
              {liveCities.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <FieldError msg={errors.city} />
        </div>

        {/* Area / Neighbourhood */}
        <div>
          <label
            htmlFor="task-area"
            className="block text-sm font-semibold text-[hsl(var(--foreground))] mb-1.5"
          >
            {t("postTask.step3.areaLabel")}
          </label>
          <select
            id="task-area"
            value={area}
            onChange={(e) => onArea(e.target.value)}
            disabled={!city}
            className={cn(
              "w-full rounded-xl border bg-[hsl(var(--background))] px-4 py-3 text-sm text-[hsl(var(--foreground))] outline-none transition-all focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] appearance-none disabled:opacity-50",
              errors.area ? "border-red-500" : "border-[hsl(var(--border))]",
            )}
          >
            <option value="">{t("postTask.step3.areaPlaceholder")}</option>
            {neighbourhoods.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <FieldError msg={errors.area} />
        </div>

        {/* Budget */}
        <div>
          <label
            htmlFor="task-budget"
            className="block text-sm font-semibold text-[hsl(var(--foreground))] mb-1.5"
          >
            {t("postTask.step3.budgetLabel")}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[hsl(var(--muted-foreground))]">
              PKR
            </span>
            <input
              id="task-budget"
              type="number"
              value={budgetPkr}
              onChange={(e) => onBudget(e.target.value)}
              placeholder={`${BUDGET_MIN_PKR} – ${BUDGET_MAX_PKR}`}
              min={BUDGET_MIN_PKR}
              max={BUDGET_MAX_PKR}
              className={cn(
                "w-full rounded-xl border bg-[hsl(var(--background))] pl-14 pr-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] outline-none transition-all focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)]",
                errors.budgetPkr ? "border-red-500" : "border-[hsl(var(--border))]",
              )}
            />
          </div>
          <FieldError msg={errors.budgetPkr} />
        </div>

        {/* Commission callout */}
        <AnimatePresence>
          {budgetNum >= BUDGET_MIN_PKR && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/8 p-4"
            >
              <div className="flex items-start gap-3">
                <DollarSign
                  className="h-5 w-5 text-[var(--accent)] flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold text-[hsl(var(--foreground))]">
                    {t("postTask.step3.commissionTitle")}
                  </p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5 leading-relaxed">
                    {t("postTask.step3.commissionDesc", {
                      rate: `${Math.round(COMMISSION_RATE_DEFAULT * 100)}%`,
                      amount: formatPkr(commission),
                    })}
                  </p>
                  <div className="mt-2 flex gap-4 text-xs">
                    <span className="text-[hsl(var(--muted-foreground))]">
                      {t("postTask.step3.yourBudget")}{" "}
                      <strong className="text-[hsl(var(--foreground))]">{formatPkr(budgetNum)}</strong>
                    </span>
                    <span className="text-[hsl(var(--muted-foreground))]">
                      {t("postTask.step3.taskerEarns")}{" "}
                      <strong className="text-[hsl(var(--foreground))]">
                        {formatPkr(budgetNum - commission)}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </StepCard>
  );
}

// ─── Step 4: Timing ───────────────────────────────────────────────────────────
function StepTiming({
  timing,
  preferredDate,
  onTiming,
  onDate,
  errors,
}: {
  timing: TimingWindow | "";
  preferredDate: string;
  onTiming: (v: TimingWindow) => void;
  onDate: (v: string) => void;
  errors: { timing?: string };
}) {
  const t = useTranslations();
  const today = new Date().toISOString().split("T")[0];

  return (
    <StepCard>
      <h2 className="text-xl font-bold text-[hsl(var(--foreground))] mb-1">
        {t("postTask.step4.heading")}
      </h2>
      <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6">
        {t("postTask.step4.sub")}
      </p>
      <div className="space-y-5">
        {/* Time window */}
        <div>
          <p className="text-sm font-semibold text-[hsl(var(--foreground))] mb-3">
            {t("postTask.step4.windowLabel")}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {TIMING_OPTIONS.map((opt) => {
              const selected = timing === opt.key;
              return (
                <motion.button
                  key={opt.key}
                  type="button"
                  onClick={() => onTiming(opt.key)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    "rounded-xl border-2 px-4 py-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
                    selected
                      ? "border-[var(--accent)] bg-[var(--accent)]/10"
                      : "border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:border-[var(--accent)]/50",
                  )}
                  aria-pressed={selected}
                >
                  <span
                    className={cn(
                      "block text-sm font-semibold",
                      selected ? "text-[var(--accent)]" : "text-[hsl(var(--foreground))]",
                    )}
                  >
                    {opt.label}
                  </span>
                  <span className="block text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                    {opt.desc}
                  </span>
                </motion.button>
              );
            })}
          </div>
          <FieldError msg={errors.timing} />
        </div>

        {/* Preferred date */}
        <div>
          <label
            htmlFor="task-date"
            className="block text-sm font-semibold text-[hsl(var(--foreground))] mb-1.5"
          >
            {t("postTask.step4.dateLabel")}
          </label>
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]"
              aria-hidden="true"
            />
            <input
              id="task-date"
              type="date"
              value={preferredDate}
              min={today}
              onChange={(e) => onDate(e.target.value)}
              className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] pl-9 pr-4 py-3 text-sm text-[hsl(var(--foreground))] outline-none transition-all focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)]"
            />
          </div>
          <p className="mt-1.5 text-xs text-[hsl(var(--muted-foreground))]">
            {t("postTask.step4.dateOptional")}
          </p>
        </div>
      </div>
    </StepCard>
  );
}

// ─── Step 5: Urgency + Review ─────────────────────────────────────────────────
function StepReview({
  form,
  onToggleUrgent,
}: {
  form: FormState;
  onToggleUrgent: () => void;
}) {
  const t = useTranslations();
  const budgetNum = parseFloat(form.budgetPkr) || 0;
  const commission = commissionEstimate(budgetNum);
  const total = budgetNum + (form.isUrgent ? URGENCY_BOOST_FEE_PKR : 0);

  const categoryLabel =
    TASK_CATEGORIES.find((c) => c.key === form.category)?.label ?? form.category;
  const cityLabel = CITIES.find((c) => c.slug === form.city)?.name ?? form.city;
  const timingLabel =
    TIMING_OPTIONS.find((o) => o.key === form.timing)?.label ?? form.timing;

  const rows: { label: string; value: string }[] = [
    { label: t("postTask.review.category"), value: categoryLabel },
    { label: t("postTask.review.title"), value: form.title },
    { label: t("postTask.review.location"), value: `${form.area}, ${cityLabel}` },
    { label: t("postTask.review.budget"), value: formatPkr(budgetNum) },
    { label: t("postTask.review.timing"), value: timingLabel },
    ...(form.preferredDate
      ? [{ label: t("postTask.review.date"), value: form.preferredDate }]
      : []),
  ];

  return (
    <div className="space-y-5">
      {/* Urgency boost card */}
      <StepCard>
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
            <Zap className="h-6 w-6 text-amber-500" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-[hsl(var(--foreground))]">
              {t("postTask.urgency.title")}
            </h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5 leading-relaxed">
              {t("postTask.urgency.desc", { fee: formatPkr(URGENCY_BOOST_FEE_PKR) })}
            </p>
            <ul className="mt-3 space-y-1.5">
              {(Array.isArray(t.raw("postTask.urgency.benefits"))
                ? (t.raw("postTask.urgency.benefits") as string[])
                : []
              ).map((b: string, i: number) => (
                <li key={i} className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
                  <Check className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <span className="text-sm font-bold text-[hsl(var(--foreground))]">
              +{formatPkr(URGENCY_BOOST_FEE_PKR)}
            </span>
            <button
              type="button"
              onClick={onToggleUrgent}
              className={cn(
                "relative h-6 w-11 rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
                form.isUrgent ? "bg-amber-500" : "bg-[hsl(var(--border))]",
              )}
              role="switch"
              aria-checked={form.isUrgent}
              aria-label={t("postTask.urgency.toggleLabel")}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300",
                  form.isUrgent ? "translate-x-5" : "translate-x-0",
                )}
              />
            </button>
          </div>
        </div>
      </StepCard>

      {/* Summary */}
      <StepCard>
        <h2 className="text-xl font-bold text-[hsl(var(--foreground))] mb-1">
          {t("postTask.review.heading")}
        </h2>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-5">
          {t("postTask.review.sub")}
        </p>

        <dl className="divide-y divide-[hsl(var(--border))]">
          {rows.map((row) => (
            <div key={row.label} className="flex justify-between py-3 gap-4">
              <dt className="text-sm text-[hsl(var(--muted-foreground))] flex-shrink-0">
                {row.label}
              </dt>
              <dd className="text-sm font-medium text-[hsl(var(--foreground))] text-right">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>

        {/* Description preview */}
        <div className="mt-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4">
          <p className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wide mb-2">
            {t("postTask.review.descPreview")}
          </p>
          <p className="text-sm text-[hsl(var(--foreground))] leading-relaxed whitespace-pre-wrap">
            {form.description}
          </p>
        </div>

        {/* Cost breakdown */}
        <div className="mt-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[hsl(var(--muted-foreground))]">{t("postTask.review.yourBudget")}</span>
            <span className="font-medium text-[hsl(var(--foreground))]">{formatPkr(budgetNum)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[hsl(var(--muted-foreground))]">
              {t("postTask.review.commission", { rate: `${Math.round(COMMISSION_RATE_DEFAULT * 100)}%` })}
            </span>
            <span className="font-medium text-[hsl(var(--muted-foreground))]">
              {formatPkr(commission)} {t("postTask.review.taskerPays")}
            </span>
          </div>
          {form.isUrgent && (
            <div className="flex justify-between text-sm">
              <span className="text-amber-600">{t("postTask.review.urgencyFee")}</span>
              <span className="font-medium text-amber-600">+{formatPkr(URGENCY_BOOST_FEE_PKR)}</span>
            </div>
          )}
          <div className="border-t border-[hsl(var(--border))] pt-2 flex justify-between">
            <span className="text-sm font-bold text-[hsl(var(--foreground))]">
              {t("postTask.review.totalPosted")}
            </span>
            <span className="text-sm font-bold text-[var(--accent)]">{formatPkr(total)}</span>
          </div>
        </div>
      </StepCard>
    </div>
  );
}

// ─── Success screen ───────────────────────────────────────────────────────────
function SuccessScreen() {
  const t = useTranslations();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="text-center py-16 px-6"
    >
      <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-[var(--accent)]/15 flex items-center justify-center">
        <Check className="h-10 w-10 text-[var(--accent)]" aria-hidden="true" />
      </div>
      <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-2">
        {t("postTask.success.heading")}
      </h2>
      <p className="text-[hsl(var(--muted-foreground))] max-w-sm mx-auto leading-relaxed">
        {t("postTask.success.desc")}
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href="/my-tasks"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-black transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          {t("postTask.success.viewTasks")}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
        <a
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 py-3 text-sm font-semibold text-[hsl(var(--foreground))] transition-all hover:bg-[hsl(var(--background))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          {t("postTask.success.browseTasks")}
        </a>
      </div>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function PostTaskPage() {
  const t = useTranslations();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const update = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  const validateStep = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};
    if (step === 1) {
      if (!form.category) newErrors.category = t("postTask.errors.categoryRequired");
    }
    if (step === 2) {
      if (!form.title.trim() || form.title.length < 5)
        newErrors.title = t("postTask.errors.titleShort");
      if (!form.description.trim() || form.description.length < 20)
        newErrors.description = t("postTask.errors.descShort");
    }
    if (step === 3) {
      if (!form.city) newErrors.city = t("postTask.errors.cityRequired");
      if (!form.area) newErrors.area = t("postTask.errors.areaRequired");
      const b = parseFloat(form.budgetPkr);
      if (!form.budgetPkr || isNaN(b) || b < BUDGET_MIN_PKR || b > BUDGET_MAX_PKR)
        newErrors.budgetPkr = t("postTask.errors.budgetRange", {
          min: formatPkr(BUDGET_MIN_PKR),
          max: formatPkr(BUDGET_MAX_PKR),
        });
    }
    if (step === 4) {
      if (!form.timing) newErrors.timing = t("postTask.errors.timingRequired");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [step, form, t]);

  const goNext = useCallback(() => {
    if (!validateStep()) return;
    if (step === 5) {
      setSubmitted(true);
      return;
    }
    setDirection("forward");
    setStep((s) => s + 1);
  }, [step, validateStep]);

  const goBack = useCallback(() => {
    setDirection("back");
    setStep((s) => Math.max(1, s - 1));
  }, []);

  const activeVariants = direction === "forward" ? stepVariants : stepVariantsBack;

  const stepContent = useMemo(() => {
    switch (step) {
      case 1:
        return (
          <StepCategory
            value={form.category}
            onChange={(v) => update("category", v)}
            error={errors.category}
          />
        );
      case 2:
        return (
          <StepDetails
            title={form.title}
            description={form.description}
            onTitle={(v) => update("title", v)}
            onDesc={(v) => update("description", v)}
            errors={{ title: errors.title, description: errors.description }}
          />
        );
      case 3:
        return (
          <StepLocationBudget
            city={form.city}
            area={form.area}
            budgetPkr={form.budgetPkr}
            onCity={(v) => update("city", v)}
            onArea={(v) => update("area", v)}
            onBudget={(v) => update("budgetPkr", v)}
            errors={{ city: errors.city, area: errors.area, budgetPkr: errors.budgetPkr }}
          />
        );
      case 4:
        return (
          <StepTiming
            timing={form.timing}
            preferredDate={form.preferredDate}
            onTiming={(v) => update("timing", v)}
            onDate={(v) => update("preferredDate", v)}
            errors={{ timing: errors.timing }}
          />
        );
      case 5:
        return (
          <StepReview
            form={form}
            onToggleUrgent={() => update("isUrgent", !form.isUrgent)}
          />
        );
      default:
        return null;
    }
  }, [step, form, errors, update]);

  if (submitted) {
    return (
      <main className="min-h-screen bg-[hsl(var(--background))]">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
          <SuccessScreen />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[hsl(var(--background))]">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:py-16">
        {/* Page header */}
        <Reveal>
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-4xl">
              {t("postTask.pageTitle")}
            </h1>
            <p className="mt-2 text-[hsl(var(--muted-foreground))]">
              {t("postTask.pageSub")}
            </p>
          </div>
        </Reveal>

        {/* Stepper */}
        <Reveal delay={0.05}>
          <ProgressStepper current={step} />
        </Reveal>

        {/* Step content with animation */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            variants={activeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {stepContent}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <Reveal delay={0.1}>
          <div className="mt-6 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 1}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-3 text-sm font-semibold text-[hsl(var(--foreground))] transition-all hover:bg-[hsl(var(--background))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
                step === 1 && "opacity-40 pointer-events-none",
              )}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              {t("postTask.nav.back")}
            </button>

            <span className="text-xs text-[hsl(var(--muted-foreground))]">
              {t("postTask.nav.stepOf", { current: step, total: STEPS.length })}
            </span>

            <motion.button
              type="button"
              onClick={goNext}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-black transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              {step === 5 ? t("postTask.nav.submit") : t("postTask.nav.next")}
              {step < 5 ? (
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Check className="h-4 w-4" aria-hidden="true" />
              )}
            </motion.button>
          </div>
        </Reveal>
      </div>
    </main>
  );
}