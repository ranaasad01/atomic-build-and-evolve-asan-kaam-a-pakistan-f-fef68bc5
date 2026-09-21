"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Search, Shield, AlertCircle, CheckCheck, Check, Clock, ChevronRight, Star, MapPin, Lock, Info, X, Phone } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { APP_NAME, VerificationStatus } from "@/lib/data";
type getVerificationColor = any;
const getVerificationColor: any = [];
type getVerificationLabel = any;
const getVerificationLabel: any = [];

// ─── Types ───────────────────────────────────────────────────────────────────

interface LocalChatMessage {
  id: string;
  senderId: string;
  text: string;
  sentAt: string;
  isRead: boolean;
  isRedacted?: boolean;
  redactedReason?: string;
}

interface Conversation {
  id: string;
  taskId: string;
  taskTitle: string;
  taskBudgetPkr: number;
  otherUserId: string;
  otherUserName: string;
  otherUserRole: "poster" | "tasker";
  otherUserVerification: VerificationStatus;
  otherUserRating: number;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  taskStatus: string;
  messages: LocalChatMessage[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatPkr = (amount: number) =>
  `Rs ${amount.toLocaleString("en-PK")}`;

const formatTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit", hour12: true });
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return d.toLocaleDateString("en-PK", { day: "numeric", month: "short" });
};

// Contact-info redaction patterns
const REDACT_PATTERNS = [
  { pattern: /(\+92|0092|03)\d{9,10}/g, reason: "phone number" },
  { pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, reason: "email address" },
  { pattern: /https?:\/\/[^\s]+/g, reason: "external link" },
  { pattern: /wa\.me\/[^\s]+/gi, reason: "WhatsApp link" },
  { pattern: /@[a-zA-Z0-9_.]+/g, reason: "social handle" },
  {
    pattern: /\b(zero|one|two|three|four|five|six|seven|eight|nine)\s*(zero|one|two|three|four|five|six|seven|eight|nine)/gi,
    reason: "number evasion",
  },
];

function redactMessage(text: string): { text: string; wasRedacted: boolean; reason?: string } {
  let result = text;
  let wasRedacted = false;
  let reason: string | undefined;
  for (const { pattern, reason: r } of REDACT_PATTERNS) {
    if (pattern.test(result)) {
      result = result.replace(pattern, "[redacted]");
      wasRedacted = true;
      reason = r;
    }
    pattern.lastIndex = 0;
  }
  return { text: result, wasRedacted, reason };
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CURRENT_USER_ID = "user_poster_1";

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv_1",
    taskId: "task_001",
    taskTitle: "Grocery pickup from Imtiaz, DHA Phase 6",
    taskBudgetPkr: 800,
    otherUserId: "tasker_ali",
    otherUserName: "Ali Hassan",
    otherUserRole: "tasker",
    otherUserVerification: "verified",
    otherUserRating: 4.8,
    lastMessage: "I can be there by 11 AM, shall I confirm?",
    lastMessageAt: new Date(Date.now() - 5 * 60000).toISOString(),
    unreadCount: 2,
    taskStatus: "bid_received",
    messages: [
      {
        id: "m1",
        senderId: "tasker_ali",
        text: "Assalam o Alaikum! I saw your task for grocery pickup. I live nearby in DHA Phase 5.",
        sentAt: new Date(Date.now() - 35 * 60000).toISOString(),
        isRead: true,
      },
      {
        id: "m2",
        senderId: CURRENT_USER_ID,
        text: "Walaikum Assalam! Yes, I need someone to pick up a list of items from Imtiaz. The list is about 15-20 items.",
        sentAt: new Date(Date.now() - 30 * 60000).toISOString(),
        isRead: true,
      },
      {
        id: "m3",
        senderId: "tasker_ali",
        text: "No problem at all. I have a bike so delivery will be quick. My bid is Rs 750 including transport.",
        sentAt: new Date(Date.now() - 25 * 60000).toISOString(),
        isRead: true,
      },
      {
        id: "m4",
        senderId: CURRENT_USER_ID,
        text: "That sounds good. Can you do it before noon?",
        sentAt: new Date(Date.now() - 20 * 60000).toISOString(),
        isRead: true,
      },
      {
        id: "m5",
        senderId: "tasker_ali",
        text: "I can be there by 11 AM, shall I confirm?",
        sentAt: new Date(Date.now() - 5 * 60000).toISOString(),
        isRead: false,
      },
    ],
  },
  {
    id: "conv_2",
    taskId: "task_002",
    taskTitle: "Fix leaking kitchen tap — Gulshan-e-Iqbal",
    taskBudgetPkr: 1500,
    otherUserId: "tasker_kamran",
    otherUserName: "Kamran Plumber",
    otherUserRole: "tasker",
    otherUserVerification: "verified",
    otherUserRating: 4.6,
    lastMessage: "Parts will cost extra, around Rs 300-400 depending on tap model.",
    lastMessageAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    unreadCount: 0,
    taskStatus: "assigned",
    messages: [
      {
        id: "m6",
        senderId: "tasker_kamran",
        text: "Salam! I am an experienced plumber with 8 years of work. I can fix your tap today.",
        sentAt: new Date(Date.now() - 5 * 3600000).toISOString(),
        isRead: true,
      },
      {
        id: "m7",
        senderId: CURRENT_USER_ID,
        text: "Great, what time can you come? I am available after 2 PM.",
        sentAt: new Date(Date.now() - 4 * 3600000).toISOString(),
        isRead: true,
      },
      {
        id: "m8",
        senderId: "tasker_kamran",
        text: "Parts will cost extra, around Rs 300-400 depending on tap model.",
        sentAt: new Date(Date.now() - 2 * 3600000).toISOString(),
        isRead: true,
      },
    ],
  },
  {
    id: "conv_3",
    taskId: "task_003",
    taskTitle: "Help setting up new laptop and install software",
    taskBudgetPkr: 2000,
    otherUserId: "tasker_sara",
    otherUserName: "Sara Tech",
    otherUserRole: "tasker",
    otherUserVerification: "submitted",
    otherUserRating: 4.3,
    lastMessage: "Which software do you need installed? Office, antivirus?",
    lastMessageAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    unreadCount: 1,
    taskStatus: "open",
    messages: [
      {
        id: "m9",
        senderId: "tasker_sara",
        text: "Hi! I can help with laptop setup. I have experience with Windows 10 and 11.",
        sentAt: new Date(Date.now() - 1 * 86400000 - 3600000).toISOString(),
        isRead: true,
      },
      {
        id: "m10",
        senderId: CURRENT_USER_ID,
        text: "Perfect. I need full setup including drivers and some software.",
        sentAt: new Date(Date.now() - 1 * 86400000 - 1800000).toISOString(),
        isRead: true,
      },
      {
        id: "m11",
        senderId: "tasker_sara",
        text: "Which software do you need installed? Office, antivirus?",
        sentAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        isRead: false,
      },
    ],
  },
  {
    id: "conv_4",
    taskId: "task_004",
    taskTitle: "Stand in queue at NADRA office — F-8 Islamabad",
    taskBudgetPkr: 600,
    otherUserId: "tasker_bilal",
    otherUserName: "Bilal Qureshi",
    otherUserRole: "tasker",
    otherUserVerification: "unverified",
    otherUserRating: 0,
    lastMessage: "I am available tomorrow morning from 8 AM.",
    lastMessageAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    unreadCount: 0,
    taskStatus: "open",
    messages: [
      {
        id: "m12",
        senderId: "tasker_bilal",
        text: "I am available tomorrow morning from 8 AM.",
        sentAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        isRead: true,
      },
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function VerificationBadge({ status }: { status: VerificationStatus }) {
  const color = getVerificationColor(status);
  const label = getVerificationLabel(status);
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${color}`}
    >
      <Shield className="w-3 h-3" />
      {label}
    </span>
  );
}

function StarRating({ rating }: { rating: number }) {
  if (rating === 0) return <span className="text-xs text-[var(--muted-foreground)]">No reviews yet</span>;
  return (
    <span className="inline-flex items-center gap-1 text-xs text-amber-500 font-medium">
      <Star className="w-3 h-3 fill-amber-400 stroke-amber-500" />
      {rating.toFixed(1)}
    </span>
  );
}

function RedactionNotice({ reason }: { reason?: string }) {
  return (
    <div className="flex items-center gap-1.5 mt-1 text-xs text-amber-600 dark:text-amber-400">
      <Shield className="w-3 h-3 flex-shrink-0" />
      <span>Contact info ({reason}) removed for your safety</span>
    </div>
  );
}

function MessageBubble({
  msg,
  isMine,
}: {
  msg: LocalChatMessage;
  isMine: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex ${isMine ? "justify-end" : "justify-start"} mb-3`}
    >
      <div className={`max-w-[75%] ${isMine ? "items-end" : "items-start"} flex flex-col`}>
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
            isMine
              ? "bg-[var(--brand-primary)] text-white rounded-br-sm"
              : "bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] rounded-bl-sm"
          } ${msg.isRedacted ? "opacity-80" : ""}`}
        >
          {msg.text}
        </div>
        {msg.isRedacted && <RedactionNotice reason={msg.redactedReason} />}
        <div className={`flex items-center gap-1 mt-1 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
          <span className="text-[10px] text-[var(--muted-foreground)]">{formatTime(msg.sentAt)}</span>
          {isMine && (
            msg.isRead
              ? <CheckCheck className="w-3 h-3 text-[var(--brand-primary)]" />
              : <Check className="w-3 h-3 text-[var(--muted-foreground)]" />
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ConversationItem({
  conv,
  isActive,
  onClick,
}: {
  conv: Conversation;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 border-b border-[var(--border)] transition-colors duration-150 ${
        isActive
          ? "bg-[var(--brand-primary)]/8 border-l-2 border-l-[var(--brand-primary)]"
          : "hover:bg-[var(--muted)]/50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--brand-primary)]/30 to-[var(--brand-primary)]/10 flex items-center justify-center text-[var(--brand-primary)] font-bold text-sm border border-[var(--brand-primary)]/20">
            {conv.otherUserName.charAt(0)}
          </div>
          {conv.otherUserVerification === "verified" && (
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
              <Shield className="w-2.5 h-2.5 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <span className="font-semibold text-sm text-[var(--foreground)] truncate">{conv.otherUserName}</span>
            <span className="text-[10px] text-[var(--muted-foreground)] flex-shrink-0 ml-2">
              {formatDate(conv.lastMessageAt)}
            </span>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] truncate mb-1">{conv.taskTitle}</p>
          <div className="flex items-center justify-between">
            <p className="text-xs text-[var(--foreground)]/70 truncate flex-1">{conv.lastMessage}</p>
            {conv.unreadCount > 0 && (
              <span className="ml-2 flex-shrink-0 w-5 h-5 bg-[var(--brand-primary)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {conv.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function InAppMessagingChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string | null>(MOCK_CONVERSATIONS[0].id);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSafetyInfo, setShowSafetyInfo] = useState(false);
  const [redactionWarning, setRedactionWarning] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId) ?? null;

  const filteredConvs = conversations.filter(
    (c) =>
      c.otherUserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.taskTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConvId, activeConv?.messages.length]);

  // Mark messages as read when opening a conversation
  useEffect(() => {
    if (!activeConvId) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? {
              ...c,
              unreadCount: 0,
              messages: c.messages.map((m) => ({ ...m, isRead: true })),
            }
          : c
      )
    );
  }, [activeConvId]);

  const handleSend = useCallback(() => {
    const trimmed = inputText.trim();
    if (!trimmed || !activeConvId) return;

    const { text: processedText, wasRedacted, reason } = redactMessage(trimmed);

    if (wasRedacted) {
      setRedactionWarning(
        `Your message contained a ${reason} which was removed. Sharing contact info outside ${APP_NAME} violates our safety policy.`
      );
      setTimeout(() => setRedactionWarning(null), 6000);
    }

    const newMsg: LocalChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: CURRENT_USER_ID,
      text: processedText,
      sentAt: new Date().toISOString(),
      isRead: false,
      isRedacted: wasRedacted,
      redactedReason: reason,
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? {
              ...c,
              messages: [...c.messages, newMsg],
              lastMessage: processedText,
              lastMessageAt: newMsg.sentAt,
            }
          : c
      )
    );
    setInputText("");
    inputRef.current?.focus();
  }, [inputText, activeConvId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Page Header */}
      <Reveal>
        <div className="border-b border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
                  Messages
                </h1>
                <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
                  Coordinate with taskers and posters — all conversations are monitored for safety
                </p>
              </div>
              <div className="flex items-center gap-3">
                {totalUnread > 0 && (
                  <span className="px-3 py-1 bg-[var(--brand-primary)] text-white text-xs font-bold rounded-full">
                    {totalUnread} unread
                  </span>
                )}
                <button
                  onClick={() => setShowSafetyInfo((v) => !v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs text-[var(--muted-foreground)] hover:bg-[var(--muted)]/50 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-500" />
                  Safety Info
                </button>
              </div>
            </div>

            {/* Safety Info Banner */}
            <AnimatePresence>
              {showSafetyInfo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-1">
                          {APP_NAME} Contact Safety Policy
                        </p>
                        <ul className="text-xs text-emerald-700 dark:text-emerald-400 space-y-1">
                          <li>• Phone numbers (03xx, +92xx) are automatically removed from messages</li>
                          <li>• Email addresses, WhatsApp links, and social handles are blocked</li>
                          <li>• Number-word evasion (e.g. "zero three...") is detected and redacted</li>
                          <li>• All coordination happens inside {APP_NAME} to protect both parties</li>
                          <li>• Disputes are only supported for tasks completed through the platform</li>
                        </ul>
                      </div>
                      <button onClick={() => setShowSafetyInfo(false)} className="ml-auto text-emerald-600 hover:text-emerald-800">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Reveal>

      {/* Main Chat Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Reveal>
          <div className="flex h-[calc(100vh-260px)] min-h-[500px] rounded-2xl border border-[var(--border)] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06),0_16px_48px_-12px_rgba(0,0,0,0.1)] bg-[var(--card)]">

            {/* Sidebar — Conversation List */}
            <div className="w-80 flex-shrink-0 border-r border-[var(--border)] flex flex-col bg-[var(--background)]">
              {/* Search */}
              <div className="p-3 border-b border-[var(--border)]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-[var(--muted)]/40 border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)]/50 transition-all"
                  />
                </div>
              </div>

              {/* Conversation Items */}
              <div className="flex-1 overflow-y-auto">
                {filteredConvs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-6">
                    <Search className="w-8 h-8 text-[var(--muted-foreground)] mb-2" />
                    <p className="text-sm text-[var(--muted-foreground)]">No conversations found</p>
                  </div>
                ) : (
                  filteredConvs.map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conv={conv}
                      isActive={conv.id === activeConvId}
                      onClick={() => setActiveConvId(conv.id)}
                    />
                  ))
                )}
              </div>

              {/* Safety Footer */}
              <div className="p-3 border-t border-[var(--border)] bg-[var(--muted)]/30">
                <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                  <Lock className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                  <span>Contact info is automatically protected</span>
                </div>
              </div>
            </div>

            {/* Chat Area */}
            {activeConv ? (
              <div className="flex-1 flex flex-col min-w-0">
                {/* Chat Header */}
                <div className="px-5 py-3.5 border-b border-[var(--border)] bg-[var(--card)] flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--brand-primary)]/30 to-[var(--brand-primary)]/10 flex items-center justify-center text-[var(--brand-primary)] font-bold text-sm border border-[var(--brand-primary)]/20">
                        {activeConv.otherUserName.charAt(0)}
                      </div>
                      {activeConv.otherUserVerification === "verified" && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                          <Shield className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[var(--foreground)]">
                          {activeConv.otherUserName}
                        </span>
                        <VerificationBadge status={activeConv.otherUserVerification} />
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <StarRating rating={activeConv.otherUserRating} />
                        <span className="text-[var(--muted-foreground)] text-xs">•</span>
                        <span className="text-xs text-[var(--muted-foreground)] capitalize">
                          {activeConv.otherUserRole}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Task Info */}
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:block text-right">
                      <p className="text-xs font-medium text-[var(--foreground)] truncate max-w-[180px]">
                        {activeConv.taskTitle}
                      </p>
                      <div className="flex items-center gap-2 justify-end mt-0.5">
                        <span className="text-xs text-[var(--brand-primary)] font-semibold">
                          {formatPkr(activeConv.taskBudgetPkr)}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] capitalize">
                          {activeConv.taskStatus.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)]" />
                  </div>
                </div>

                {/* Redaction Warning */}
                <AnimatePresence>
                  {redactionWarning && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="mx-4 mt-3 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-2"
                    >
                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700 dark:text-amber-400">{redactionWarning}</p>
                      <button onClick={() => setRedactionWarning(null)} className="ml-auto text-amber-600">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
                  {/* Date separator */}
                  <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-[var(--border)]" />
                    <span className="text-[10px] text-[var(--muted-foreground)] px-2">
                      {formatDate(activeConv.messages[0]?.sentAt ?? new Date().toISOString())}
                    </span>
                    <div className="flex-1 h-px bg-[var(--border)]" />
                  </div>

                  {activeConv.messages.map((msg) => (
                    <MessageBubble
                      key={msg.id}
                      msg={msg}
                      isMine={msg.senderId === CURRENT_USER_ID}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Safety Reminder */}
                <div className="px-5 py-2 bg-[var(--muted)]/20 border-t border-[var(--border)] flex items-center gap-2">
                  <Phone className="w-3 h-3 text-[var(--muted-foreground)]" />
                  <p className="text-[10px] text-[var(--muted-foreground)]">
                    Phone numbers, emails, and external links are automatically removed from messages.
                  </p>
                </div>

                {/* Input Area */}
                <div className="px-4 py-3 border-t border-[var(--border)] bg-[var(--card)] flex-shrink-0">
                  <div className="flex items-end gap-3">
                    <div className="flex-1 relative">
                      <textarea
                        ref={inputRef}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
                        rows={1}
                        className="w-full px-4 py-3 text-sm bg-[var(--muted)]/40 border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)]/50 transition-all resize-none leading-relaxed"
                        style={{ minHeight: "44px", maxHeight: "120px" }}
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSend}
                      disabled={!inputText.trim()}
                      className="flex-shrink-0 w-11 h-11 bg-[var(--brand-primary)] text-white rounded-xl flex items-center justify-center shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                    >
                      <Send className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            ) : (
              /* Empty State */
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
                <div className="w-16 h-16 rounded-2xl bg-[var(--brand-primary)]/10 flex items-center justify-center mb-4">
                  <Send className="w-8 h-8 text-[var(--brand-primary)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">Select a conversation</h3>
                <p className="text-sm text-[var(--muted-foreground)] max-w-xs">
                  Choose a conversation from the left to start messaging. All chats are protected by {APP_NAME} safety filters.
                </p>
              </div>
            )}
          </div>
        </Reveal>

        {/* Info Cards Row */}
        <Reveal delay={0.1}>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6"
          >
            {[
              {
                icon: Shield,
                title: "Contact Protection",
                desc: "Phone numbers, emails, and social handles are automatically stripped from every message.",
                color: "text-emerald-500",
                bg: "bg-emerald-500/10",
              },
              {
                icon: Lock,
                title: "Platform-Only Coordination",
                desc: "All task coordination stays inside Asan Kaam so disputes can be fairly resolved.",
                color: "text-blue-500",
                bg: "bg-blue-500/10",
              },
              {
                icon: Info,
                title: "Evasion Detection",
                desc: "Number-word tricks like 'zero three...' are detected and blocked automatically.",
                color: "text-amber-500",
                bg: "bg-amber-500/10",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                variants={fadeInUp}
                whileHover={{ y: -2 }}
                className="flex items-start gap-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]"
              >
                <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center flex-shrink-0`}>
                  <card.icon className={`w-4.5 h-4.5 ${card.color}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)] mb-0.5">{card.title}</p>
                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Reveal>
      </div>
    </div>
  );
}