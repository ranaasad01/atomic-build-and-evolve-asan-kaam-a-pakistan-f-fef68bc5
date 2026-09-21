"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Gavel, ClipboardList, MessageSquare, CheckCheck, Dot } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";
import { staggerContainer, fadeInUp } from "@/lib/motion";

// ─── Types ────────────────────────────────────────────────────────────────────

type NotifType = "bid" | "task" | "system" | "message";
type FilterTab = "all" | "unread" | "bids" | "tasks" | "system";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  description: string;
  timestamp: string; // ISO string
  read: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "bid",
    title: "New Bid Received",
    description: "Muhammad Bilal placed a bid of Rs 3,200 on your task \"Move furniture from DHA to Gulshan\".",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "n2",
    type: "task",
    title: "Task Assigned",
    description: "You have been assigned the task \"Grocery run from Imtiaz Store, Gulshan\". Please confirm availability.",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "n3",
    type: "message",
    title: "New Message",
    description: "Ayesha Siddiqui sent you a message regarding \"Deep clean 3-bedroom apartment\".",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "n4",
    type: "system",
    title: "Verification Update",
    description: "Your CNIC documents have been received. Verification is in progress and may take 24–48 hours.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: "n5",
    type: "bid",
    title: "Bid Accepted",
    description: "Your bid of Rs 1,500 on \"Fix leaking kitchen tap\" was accepted. Task is now assigned to you.",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: "n6",
    type: "task",
    title: "Task Completed",
    description: "\"Stand in NADRA queue for CNIC renewal\" has been marked as completed. Your earnings have been credited.",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: "n7",
    type: "system",
    title: "Balance Low",
    description: "Your platform balance is below Rs 500. Top up to continue bidding on new tasks.",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: "n8",
    type: "message",
    title: "New Message",
    description: "Tariq Hussain replied to your message about \"Parcel delivery — Blue Area to G-9\".",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: "n9",
    type: "bid",
    title: "New Bid Received",
    description: "Ali Hassan placed a bid of Rs 2,800 on your task \"Deep kitchen cleaning (3-bedroom flat)\".",
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: "n10",
    type: "task",
    title: "Task Cancelled",
    description: "The task \"Pick up prescription from pharmacy\" was cancelled. Any reserved commission has been released.",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function relativeTime(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Abhi abhi";
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Kal";
  if (diffDays < 7) return `${diffDays} din pehle`;
  return `${Math.floor(diffDays / 7)} hafte pehle`;
}

const TYPE_CONFIG: Record<
  NotifType,
  { Icon: React.ElementType; bg: string; iconColor: string; label: string }
> = {
  bid: {
    Icon: Gavel,
    bg: "bg-blue-50",
    iconColor: "text-[var(--primary)]",
    label: "Bid",
  },
  task: {
    Icon: ClipboardList,
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    label: "Task",
  },
  message: {
    Icon: MessageSquare,
    bg: "bg-amber-50",
    iconColor: "text-[var(--accent)]",
    label: "Message",
  },
  system: {
    Icon: Bell,
    bg: "bg-purple-50",
    iconColor: "text-purple-600",
    label: "System",
  },
};

const FILTER_TABS: { key: FilterTab; label: string; urdu: string }[] = [
  { key: "all", label: "All", urdu: "سب" },
  { key: "unread", label: "Unread", urdu: "نہ پڑھے" },
  { key: "bids", label: "Bids", urdu: "بولیاں" },
  { key: "tasks", label: "Tasks", urdu: "کام" },
  { key: "system", label: "System", urdu: "نظام" },
];

// ─── Notification Card ────────────────────────────────────────────────────────

function NotificationCard({
  notif,
  onMarkRead,
}: {
  notif: Notification;
  onMarkRead: (id: string) => void;
}) {
  const config = TYPE_CONFIG[notif.type];
  const { Icon } = config;

  return (
    <motion.div
      layout
      variants={fadeInUp}
      onClick={() => !notif.read && onMarkRead(notif.id)}
      className={cn(
        "relative flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer group",
        notif.read
          ? "bg-[var(--card)] border-[var(--border)]"
          : "bg-white border-[var(--primary)]/20 shadow-[0_2px_12px_rgba(27,108,168,0.08)]"
      )}
      aria-label={notif.title}
    >
      {/* Unread dot */}
      {!notif.read && (
        <span
          className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[var(--primary)] flex-shrink-0"
          aria-label="Unread"
        />
      )}

      {/* Icon */}
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5",
          config.bg
        )}
      >
        <Icon className={cn("w-5 h-5", config.iconColor)} aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "text-sm font-semibold leading-snug",
              notif.read ? "text-[var(--muted-foreground)]" : "text-[var(--foreground)]"
            )}
          >
            {notif.title}
          </p>
          <span className="text-xs text-[var(--muted-foreground)] whitespace-nowrap flex-shrink-0">
            {relativeTime(notif.timestamp)}
          </span>
        </div>
        <p
          className={cn(
            "text-sm mt-1 leading-relaxed",
            notif.read ? "text-[var(--muted-foreground)]/70" : "text-[var(--muted-foreground)]"
          )}
        >
          {notif.description}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const filtered = useMemo(() => {
    switch (activeTab) {
      case "unread":
        return notifications.filter((n) => !n.read);
      case "bids":
        return notifications.filter((n) => n.type === "bid");
      case "tasks":
        return notifications.filter((n) => n.type === "task");
      case "system":
        return notifications.filter(
          (n) => n.type === "system" || n.type === "message"
        );
      default:
        return notifications;
    }
  }, [notifications, activeTab]);

  function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* ── Hero Header ── */}
      <section className="relative bg-gradient-to-br from-[#1B6CA8] via-[#155a8a] to-[#0f3f63] pt-10 pb-8">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 20% 50%, #F5A623 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #ffffff 0%, transparent 50%)",
          }}
          aria-hidden="true"
        />
        <div className="container relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 rounded-full bg-[var(--accent)] text-white text-xs font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              <p className="text-white/60 text-sm font-medium" dir="rtl" lang="ur">
                اطلاعات
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 text-sm font-semibold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-2 rounded-lg transition-all duration-200 flex-shrink-0 mt-1"
              >
                <CheckCheck className="w-4 h-4" aria-hidden="true" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mt-6 overflow-x-auto pb-1 scrollbar-hide">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200",
                  activeTab === tab.key
                    ? "bg-[#1A1A2E] text-white border-[#1A1A2E] shadow-[0_2px_8px_rgba(26,26,46,0.4)]"
                    : "bg-white/10 text-white/70 border-white/20 hover:bg-white/20 hover:text-white"
                )}
              >
                {tab.label}
                {tab.key === "unread" && unreadCount > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-white/20 text-white text-[10px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Notification List ── */}
      <section className="container py-6">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center mb-4 shadow-[0_2px_8px_rgba(26,26,46,0.06)]">
                <Bell className="w-8 h-8 text-[var(--muted-foreground)]/40" aria-hidden="true" />
              </div>
              <p className="text-[var(--foreground)] font-semibold text-base mb-1">
                Koi Notification Nahi
              </p>
              <p
                className="text-[var(--muted-foreground)] text-sm mb-1"
                dir="rtl"
                lang="ur"
              >
                کوئی اطلاع نہیں
              </p>
              <p className="text-[var(--muted-foreground)] text-sm">
                {activeTab === "unread"
                  ? "Sab notifications parh li gayi hain."
                  : "Abhi koi notification nahi hai."}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-3"
            >
              {filtered.map((notif) => (
                <NotificationCard
                  key={notif.id}
                  notif={notif}
                  onMarkRead={markRead}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary footer */}
        {filtered.length > 0 && (
          <Reveal delay={0.1}>
            <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between">
              <p className="text-xs text-[var(--muted-foreground)]">
                {filtered.length} notification{filtered.length !== 1 ? "s" : ""} shown
                {unreadCount > 0 && (
                  <span className="ml-2 text-[var(--primary)] font-semibold">
                    · {unreadCount} unread
                  </span>
                )}
              </p>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-[var(--primary)] font-semibold hover:underline"
                >
                  Sab parh liya
                </button>
              )}
            </div>
          </Reveal>
        )}
      </section>
    </main>
  );
}
