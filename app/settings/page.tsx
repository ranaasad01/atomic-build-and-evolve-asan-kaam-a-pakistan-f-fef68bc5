"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Bell, Shield, Code2, AlertTriangle, ChevronRight, Phone, MapPin, Globe, LogOut, Trash2, Eye, EyeOff, Lock, Sliders, Percent, Wallet, Zap, CheckCircle } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import {
  COMMISSION_RATE,
  MIN_BALANCE_PKR,
  URGENCY_BOOST_PRICE_PKR,
  ACTIVE_CITIES,
  formatPKR,
} from "@/lib/data";
import { staggerContainer, fadeInUp } from "@/lib/motion";

// ─── Toggle Switch ────────────────────────────────────────────────────────────
function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2",
        checked ? "bg-[var(--primary)]" : "bg-[var(--border)]"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

// ─── Settings Row ─────────────────────────────────────────────────────────────
function SettingsRow({
  label,
  sublabel,
  children,
  icon: Icon,
}: {
  label: string;
  sublabel?: string;
  children: React.ReactNode;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 border-b border-[var(--border)] last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-[var(--background)] flex items-center justify-center flex-shrink-0">
            <Icon className="w-4 h-4 text-[var(--muted-foreground)]" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--foreground)] leading-tight">{label}</p>
          {sublabel && (
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5 leading-tight">{sublabel}</p>
          )}
        </div>
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({
  title,
  urduTitle,
  icon: Icon,
  accentColor = "text-[var(--primary)]",
  children,
  className,
}: {
  title: string;
  urduTitle?: string;
  icon: React.ElementType;
  accentColor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-[0_1px_3px_rgba(26,26,46,0.06),0_4px_16px_-4px_rgba(26,26,46,0.08)] overflow-hidden",
        className
      )}
    >
      {/* Card header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)] bg-gradient-to-r from-[var(--background)] to-[var(--card)]">
        <div
          className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center",
            accentColor === "text-[var(--primary)]"
              ? "bg-blue-50"
              : accentColor === "text-[var(--accent)]"
              ? "bg-amber-50"
              : accentColor === "text-emerald-600"
              ? "bg-emerald-50"
              : accentColor === "text-purple-600"
              ? "bg-purple-50"
              : "bg-red-50"
          )}
        >
          <Icon className={cn("w-5 h-5", accentColor)} />
        </div>
        <div>
          <h2 className={cn("text-base font-bold leading-tight", accentColor)}>
            {title}
          </h2>
          {urduTitle && (
            <p className="text-xs text-[var(--muted-foreground)] font-medium" dir="rtl">
              {urduTitle}
            </p>
          )}
        </div>
      </div>
      {/* Card body */}
      <div className="px-5">{children}</div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  // ── Account state ──
  const [name, setName] = useState("Bilal Ahmed");
  const [phone] = useState("0312 345 6789");
  const [city, setCity] = useState("Karachi");
  const [language, setLanguage] = useState<"en" | "ur">("en");
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(name);

  // ── Notification state ──
  const [notifBidAlerts, setNotifBidAlerts] = useState(true);
  const [notifTaskUpdates, setNotifTaskUpdates] = useState(true);
  const [notifMessages, setNotifMessages] = useState(true);
  const [notifPromotions, setNotifPromotions] = useState(false);

  // ── Privacy state ──
  const [contactVisible, setContactVisible] = useState(false);
  const [showBlockList, setShowBlockList] = useState(false);

  // ── Feature flags state ──
  const [commissionRate, setCommissionRate] = useState(
    Math.round(COMMISSION_RATE * 100)
  );
  const [minBalance, setMinBalance] = useState(MIN_BALANCE_PKR);
  const [urgencyBoost, setUrgencyBoost] = useState(URGENCY_BOOST_PRICE_PKR);
  const [flagBidding, setFlagBidding] = useState(true);
  const [flagUrgency, setFlagUrgency] = useState(true);
  const [flagDispute, setFlagDispute] = useState(true);

  // ── Danger zone state ──
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleSaveName() {
    setName(nameInput.trim() || name);
    setEditingName(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const MOCK_BLOCK_LIST = ["Usman K.", "Anonymous User #4"];

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* ── Page Header ── */}
      <section className="bg-gradient-to-br from-[#1B6CA8] via-[#155a8a] to-[#0f3f63] pt-10 pb-14">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #F5A623 0%, transparent 60%), radial-gradient(circle at 80% 20%, #ffffff 0%, transparent 50%)",
          }}
          aria-hidden="true"
        />
        <div className="container relative z-10">
          <Reveal>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-white/60 text-sm font-medium mb-1 tracking-wide uppercase">
                  Asan Kaam
                </p>
                <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  Settings
                </h1>
                <p
                  className="text-white/70 text-xl mt-1 font-medium"
                  dir="rtl"
                  lang="ur"
                >
                  ترتیبات
                </p>
              </div>
              {saved && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 bg-emerald-500 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg"
                >
                  <CheckCircle className="w-4 h-4" />
                  Saved!
                </motion.div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="container -mt-6 pb-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-5 max-w-2xl mx-auto"
        >
          {/* ── 1. Account ── */}
          <motion.div variants={fadeInUp}>
            <SectionCard
              title="Account"
              urduTitle="اکاؤنٹ"
              icon={User}
              accentColor="text-[var(--primary)]"
            >
              {/* Name */}
              <SettingsRow
                label="Full Name"
                sublabel="Shown on your profile and bids"
                icon={User}
              >
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="text-sm border border-[var(--border)] rounded-lg px-2.5 py-1.5 w-32 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] text-[var(--foreground)]"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      className="text-xs font-semibold text-white bg-[var(--primary)] px-3 py-1.5 rounded-lg hover:bg-[var(--primary-hover)] transition-colors"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setNameInput(name);
                      setEditingName(true);
                    }}
                    className="text-sm text-[var(--primary)] font-semibold hover:underline flex items-center gap-1"
                  >
                    {name}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </SettingsRow>

              {/* Phone */}
              <SettingsRow
                label="Phone Number"
                sublabel="Used for OTP login — not shared publicly"
                icon={Phone}
              >
                <span className="text-sm text-[var(--muted-foreground)] font-mono bg-[var(--background)] px-2.5 py-1 rounded-lg border border-[var(--border)]">
                  {phone}
                </span>
              </SettingsRow>

              {/* City */}
              <SettingsRow
                label="City"
                sublabel="Your primary task area"
                icon={MapPin}
              >
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="text-sm border border-[var(--border)] rounded-lg px-2.5 py-1.5 bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
                >
                  {ACTIVE_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </SettingsRow>

              {/* Language */}
              <SettingsRow
                label="Language"
                sublabel="Interface language preference"
                icon={Globe}
              >
                <div className="flex items-center gap-1 bg-[var(--background)] border border-[var(--border)] rounded-xl p-1">
                  <button
                    onClick={() => setLanguage("en")}
                    className={cn(
                      "text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200",
                      language === "en"
                        ? "bg-[var(--primary)] text-white shadow-sm"
                        : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    )}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage("ur")}
                    className={cn(
                      "text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200",
                      language === "ur"
                        ? "bg-[var(--primary)] text-white shadow-sm"
                        : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    )}
                  >
                    اردو
                  </button>
                </div>
              </SettingsRow>
            </SectionCard>
          </motion.div>

          {/* ── 2. Notifications ── */}
          <motion.div variants={fadeInUp}>
            <SectionCard
              title="Notifications"
              urduTitle="اطلاعات"
              icon={Bell}
              accentColor="text-[var(--accent)]"
            >
              <SettingsRow
                label="Bid Alerts"
                sublabel="When someone bids on your task"
                icon={Bell}
              >
                <Toggle
                  checked={notifBidAlerts}
                  onChange={setNotifBidAlerts}
                  label="Bid alerts"
                />
              </SettingsRow>

              <SettingsRow
                label="Task Updates"
                sublabel="Status changes, assignments, completions"
                icon={CheckCircle}
              >
                <Toggle
                  checked={notifTaskUpdates}
                  onChange={setNotifTaskUpdates}
                  label="Task updates"
                />
              </SettingsRow>

              <SettingsRow
                label="Messages"
                sublabel="New in-app chat messages"
                icon={Globe}
              >
                <Toggle
                  checked={notifMessages}
                  onChange={setNotifMessages}
                  label="Messages"
                />
              </SettingsRow>

              <SettingsRow
                label="Promotions"
                sublabel="Platform news, offers, and tips"
                icon={Zap}
              >
                <Toggle
                  checked={notifPromotions}
                  onChange={setNotifPromotions}
                  label="Promotions"
                />
              </SettingsRow>
            </SectionCard>
          </motion.div>

          {/* ── 3. Privacy & Safety ── */}
          <motion.div variants={fadeInUp}>
            <SectionCard
              title="Privacy & Safety"
              urduTitle="رازداری اور حفاظت"
              icon={Shield}
              accentColor="text-emerald-600"
            >
              <SettingsRow
                label="Contact Info Visibility"
                sublabel="Allow taskers to see your phone number after task assignment"
                icon={Eye}
              >
                <Toggle
                  checked={contactVisible}
                  onChange={setContactVisible}
                  label="Contact info visibility"
                />
              </SettingsRow>

              {contactVisible && (
                <div className="mb-3 mt-1 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Your phone number will only be shared after a task is assigned. We recommend keeping in-app messaging enabled for full safety.
                  </p>
                </div>
              )}

              <SettingsRow
                label="Blocked Users"
                sublabel={`${MOCK_BLOCK_LIST.length} user${MOCK_BLOCK_LIST.length !== 1 ? "s" : ""} blocked`}
                icon={Lock}
              >
                <button
                  onClick={() => setShowBlockList((v) => !v)}
                  className="text-sm text-[var(--primary)] font-semibold hover:underline flex items-center gap-1"
                >
                  {showBlockList ? "Hide" : "Manage"}
                  <ChevronRight
                    className={cn(
                      "w-3.5 h-3.5 transition-transform",
                      showBlockList && "rotate-90"
                    )}
                  />
                </button>
              </SettingsRow>

              {showBlockList && (
                <div className="mb-3 mt-1 bg-[var(--background)] rounded-xl border border-[var(--border)] overflow-hidden">
                  {MOCK_BLOCK_LIST.map((user, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[var(--border)] flex items-center justify-center">
                          <User className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                        </div>
                        <span className="text-sm text-[var(--foreground)] font-medium">
                          {user}
                        </span>
                      </div>
                      <button className="text-xs text-[var(--destructive)] font-semibold hover:underline">
                        Unblock
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <SettingsRow
                label="Safe Messaging"
                sublabel="Auto-redact phone numbers, emails, and social handles in chat"
                icon={EyeOff}
              >
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  Always On
                </span>
              </SettingsRow>
            </SectionCard>
          </motion.div>

          {/* ── 4. Feature Flags ── */}
          <motion.div variants={fadeInUp}>
            <SectionCard
              title="Feature Flags"
              urduTitle="ڈویلپر ترتیبات"
              icon={Code2}
              accentColor="text-purple-600"
            >
              {/* Dev badge */}
              <div className="flex items-center gap-2 mt-4 mb-4 bg-purple-50 border border-purple-200 rounded-xl px-4 py-3">
                <Code2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-purple-700 uppercase tracking-wide">
                    Dev / Admin Only
                  </p>
                  <p className="text-xs text-purple-600 mt-0.5">
                    These values are configurable at runtime. Changes here are local to this session.
                  </p>
                </div>
              </div>

              {/* Commission Rate */}
              <div className="py-3.5 border-b border-[var(--border)]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--background)] flex items-center justify-center flex-shrink-0">
                    <Percent className="w-4 h-4 text-[var(--muted-foreground)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)] leading-tight">
                      Commission Rate
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      Deducted from tasker earnings on completion
                    </p>
                  </div>
                  <span className="ml-auto text-sm font-bold text-purple-600">
                    {commissionRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={20}
                  step={1}
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className="w-full accent-purple-600 h-2 rounded-full cursor-pointer"
                />
                <div className="flex justify-between text-xs text-[var(--muted-foreground)] mt-1">
                  <span>3%</span>
                  <span>20%</span>
                </div>
              </div>

              {/* Min Balance */}
              <div className="py-3.5 border-b border-[var(--border)]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--background)] flex items-center justify-center flex-shrink-0">
                    <Wallet className="w-4 h-4 text-[var(--muted-foreground)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)] leading-tight">
                      Minimum Tasker Balance
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      Required prepaid balance before bidding
                    </p>
                  </div>
                  <span className="ml-auto text-sm font-bold text-purple-600">
                    {formatPKR(minBalance)}
                  </span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={2000}
                  step={100}
                  value={minBalance}
                  onChange={(e) => setMinBalance(Number(e.target.value))}
                  className="w-full accent-purple-600 h-2 rounded-full cursor-pointer"
                />
                <div className="flex justify-between text-xs text-[var(--muted-foreground)] mt-1">
                  <span>Rs 100</span>
                  <span>Rs 2,000</span>
                </div>
              </div>

              {/* Urgency Boost Price */}
              <div className="py-3.5 border-b border-[var(--border)]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--background)] flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-[var(--muted-foreground)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)] leading-tight">
                      Urgency Boost Price
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      Optional fee to promote a task to the top of the feed
                    </p>
                  </div>
                  <span className="ml-auto text-sm font-bold text-purple-600">
                    {formatPKR(urgencyBoost)}
                  </span>
                </div>
                <input
                  type="range"
                  min={49}
                  max={499}
                  step={50}
                  value={urgencyBoost}
                  onChange={(e) => setUrgencyBoost(Number(e.target.value))}
                  className="w-full accent-purple-600 h-2 rounded-full cursor-pointer"
                />
                <div className="flex justify-between text-xs text-[var(--muted-foreground)] mt-1">
                  <span>Rs 49</span>
                  <span>Rs 499</span>
                </div>
              </div>

              {/* Feature toggles */}
              <SettingsRow
                label="Bidding Enabled"
                sublabel="Allow taskers to submit bids on open tasks"
                icon={Sliders}
              >
                <Toggle
                  checked={flagBidding}
                  onChange={setFlagBidding}
                  label="Bidding enabled"
                />
              </SettingsRow>

              <SettingsRow
                label="Urgency Boost Feature"
                sublabel="Show urgency boost option on task posting"
                icon={Zap}
              >
                <Toggle
                  checked={flagUrgency}
                  onChange={setFlagUrgency}
                  label="Urgency boost feature"
                />
              </SettingsRow>

              <SettingsRow
                label="Dispute Resolution"
                sublabel="Enable dispute filing on completed/in-progress tasks"
                icon={Shield}
              >
                <Toggle
                  checked={flagDispute}
                  onChange={setFlagDispute}
                  label="Dispute resolution"
                />
              </SettingsRow>
            </SectionCard>
          </motion.div>

          {/* ── 5. Danger Zone ── */}
          <motion.div variants={fadeInUp}>
            <SectionCard
              title="Danger Zone"
              urduTitle="خطرناک ترتیبات"
              icon={AlertTriangle}
              accentColor="text-[var(--destructive)]"
              className="border-red-200"
            >
              {/* Sign Out */}
              <SettingsRow
                label="Sign Out"
                sublabel="Log out of your Asan Kaam account on this device"
                icon={LogOut}
              >
                <button
                  className="flex items-center gap-1.5 text-sm font-semibold text-[var(--destructive)] border border-red-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                  onClick={() => alert("Sign out flow — connect to Supabase auth.signOut()")}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </SettingsRow>

              {/* Delete Account */}
              <div className="py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Trash2 className="w-4 h-4 text-[var(--destructive)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--foreground)] leading-tight">
                      Delete Account
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5 leading-relaxed">
                      Permanently remove your profile, task history, and balance. This cannot be undone.
                    </p>
                    {!confirmDelete ? (
                      <button
                        onClick={() => setConfirmDelete(true)}
                        className="mt-3 text-sm font-semibold text-[var(--destructive)] border border-red-200 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors"
                      >
                        Delete My Account
                      </button>
                    ) : (
                      <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-4">
                        <p className="text-sm font-semibold text-[var(--destructive)] mb-3">
                          Are you absolutely sure? This action is irreversible.
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              alert(
                                "Delete account — connect to Supabase user deletion API"
                              )
                            }
                            className="text-sm font-bold text-white bg-[var(--destructive)] hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                          >
                            Yes, Delete
                          </button>
                          <button
                            onClick={() => setConfirmDelete(false)}
                            className="text-sm font-semibold text-[var(--muted-foreground)] border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--background)] px-4 py-2 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SectionCard>
          </motion.div>

          {/* ── Footer note ── */}
          <motion.div variants={fadeInUp}>
            <div className="text-center py-4">
              <p className="text-xs text-[var(--muted-foreground)]">
                Asan Kaam v0.1 &mdash; Pakistan&apos;s Local Task Marketplace
              </p>
              <p
                className="text-xs text-[var(--muted-foreground)] mt-1"
                dir="rtl"
                lang="ur"
              >
                آسان کام — کام ڈھونڈو، کام کرو
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
