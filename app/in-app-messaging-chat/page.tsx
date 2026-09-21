"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Send, Shield, AlertTriangle, ChevronLeft, Search, MoreVertical, CheckCheck, Check, Phone, Flag, Star, MapPin, Clock, Paperclip, Smile } from 'lucide-react';
import { cn } from "@/lib/utils";
import { formatPKR, VerificationStatus } from "@/lib/data";

// ─── Types ───────────────────────────────────────────────────────────────────

type MessageStatus = "sent" | "delivered" | "read";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: MessageStatus;
  isRedacted?: boolean;
  redactedReason?: string;
}

interface Conversation {
  id: string;
  taskId: string;
  taskTitle: string;
  taskBudgetPkr: number;
  taskArea: string;
  otherPartyId: string;
  otherPartyName: string;
  otherPartyInitials: string;
  otherPartyVerification: VerificationStatus;
  otherPartyRating: number;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CURRENT_USER_ID = "me";

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    taskId: "task-001",
    taskTitle: "Furniture move DHA to Gulshan",
    taskBudgetPkr: 3500,
    taskArea: "DHA Phase 5, Karachi",
    otherPartyId: "tasker-001",
    otherPartyName: "Muhammad Bilal",
    otherPartyInitials: "MB",
    otherPartyVerification: "verified",
    otherPartyRating: 4.8,
    lastMessage: "I can be there by 9 AM, inshallah.",
    lastMessageTime: "10:42 AM",
    unreadCount: 2,
    messages: [
      {
        id: "m1",
        senderId: "tasker-001",
        text: "Assalam o Alaikum! I saw your task for furniture moving. I have experience with this kind of work.",
        timestamp: "10:30 AM",
        status: "read",
      },
      {
        id: "m2",
        senderId: CURRENT_USER_ID,
        text: "Walaikum Assalam! Yes, I need 2 helpers for moving a sofa, bed frame, and wardrobe.",
        timestamp: "10:33 AM",
        status: "read",
      },
      {
        id: "m3",
        senderId: "tasker-001",
        text: "No problem. I will bring a helper. We can finish in 3 to 4 hours easily.",
        timestamp: "10:35 AM",
        status: "read",
      },
      {
        id: "m4",
        senderId: CURRENT_USER_ID,
        text: "Great. What time can you come on Saturday?",
        timestamp: "10:38 AM",
        status: "read",
      },
      {
        id: "m5",
        senderId: "tasker-001",
        text: "My number is 0312-XXXXXXX, call me directly.",
        timestamp: "10:40 AM",
        status: "read",
        isRedacted: true,
        redactedReason: "Phone number removed for your safety. Please use in-app messaging.",
      },
      {
        id: "m6",
        senderId: "tasker-001",
        text: "I can be there by 9 AM, inshallah.",
        timestamp: "10:42 AM",
        status: "delivered",
      },
    ],
  },
  {
    id: "conv-2",
    taskId: "task-002",
    taskTitle: "Grocery run from Imtiaz Store",
    taskBudgetPkr: 600,
    taskArea: "Gulshan-e-Iqbal, Karachi",
    otherPartyId: "tasker-002",
    otherPartyName: "Ali Hassan",
    otherPartyInitials: "AH",
    otherPartyVerification: "verified",
    otherPartyRating: 4.5,
    lastMessage: "List mil gayi, main nikal raha hoon.",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    messages: [
      {
        id: "m1",
        senderId: "tasker-002",
        text: "Assalam o Alaikum! Grocery list share kar dein please.",
        timestamp: "2:10 PM",
        status: "read",
      },
      {
        id: "m2",
        senderId: CURRENT_USER_ID,
        text: "List bhej di hai. Imtiaz Super Store, Gulshan branch se lena hai.",
        timestamp: "2:15 PM",
        status: "read",
      },
      {
        id: "m3",
        senderId: "tasker-002",
        text: "List mil gayi, main nikal raha hoon.",
        timestamp: "2:18 PM",
        status: "read",
      },
    ],
  },
  {
    id: "conv-3",
    taskId: "task-003",
    taskTitle: "NADRA queue standing F-8",
    taskBudgetPkr: 800,
    taskArea: "F-8, Islamabad",
    otherPartyId: "poster-003",
    otherPartyName: "Sana Mirza",
    otherPartyInitials: "SM",
    otherPartyVerification: "unverified",
    otherPartyRating: 0,
    lastMessage: "Token number kya mila?",
    lastMessageTime: "Mon",
    unreadCount: 1,
    messages: [
      {
        id: "m1",
        senderId: CURRENT_USER_ID,
        text: "Main NADRA office pahunch gaya hoon. Queue mein hoon.",
        timestamp: "8:05 AM",
        status: "read",
      },
      {
        id: "m2",
        senderId: "poster-003",
        text: "Token number kya mila?",
        timestamp: "8:30 AM",
        status: "delivered",
      },
    ],
  },
  {
    id: "conv-4",
    taskId: "task-004",
    taskTitle: "Laptop cleanup and antivirus",
    taskBudgetPkr: 1200,
    taskArea: "Saddar, Rawalpindi",
    otherPartyId: "tasker-004",
    otherPartyName: "Usman Farooq",
    otherPartyInitials: "UF",
    otherPartyVerification: "submitted",
    otherPartyRating: 4.2,
    lastMessage: "Kaam ho gaya, please confirm karein.",
    lastMessageTime: "Sun",
    unreadCount: 0,
    messages: [
      {
        id: "m1",
        senderId: "tasker-004",
        text: "Laptop ki cleaning aur antivirus install ho gayi. Sab theek hai.",
        timestamp: "4:00 PM",
        status: "read",
      },
      {
        id: "m2",
        senderId: "tasker-004",
        text: "Kaam ho gaya, please confirm karein.",
        timestamp: "4:05 PM",
        status: "read",
      },
    ],
  },
];

// ─── Contact info redaction ───────────────────────────────────────────────────

const PHONE_PATTERNS = [
  /\b0?3\d{2}[-\s]?\d{7}\b/g,
  /\+92[-\s]?3\d{2}[-\s]?\d{7}\b/g,
  /\b03\d{9}\b/g,
];
const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const URL_PATTERN = /https?:\/\/[^\s]+|www\.[^\s]+/g;
const SOCIAL_PATTERN =
  /\b(whatsapp|instagram|facebook|twitter|telegram|snapchat|tiktok)\b/gi;

function detectContactInfo(text: string): boolean {
  return (
    PHONE_PATTERNS.some((p) => p.test(text)) ||
    EMAIL_PATTERN.test(text) ||
    URL_PATTERN.test(text) ||
    SOCIAL_PATTERN.test(text)
  );
}

// ─── Helper components ────────────────────────────────────────────────────────

function VerificationBadge({ status }: { status: VerificationStatus }) {
  if (status === "verified") {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">
        <Shield className="w-2.5 h-2.5" />
        Verified
      </span>
    );
  }
  if (status === "submitted") {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">
        <Clock className="w-2.5 h-2.5" />
        Pending
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-gray-700 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded-full">
      Unverified
    </span>
  );
}

function MessageStatusIcon({ status }: { status: MessageStatus }) {
  if (status === "read") return <CheckCheck className="w-3.5 h-3.5 text-[var(--accent)]" />;
  if (status === "delivered") return <CheckCheck className="w-3.5 h-3.5 text-white/60" />;
  return <Check className="w-3.5 h-3.5 text-white/60" />;
}

function Avatar({
  initials,
  size = "md",
  online = false,
}: {
  initials: string;
  size?: "sm" | "md" | "lg";
  online?: boolean;
}) {
  const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : size === "lg" ? "w-12 h-12 text-base" : "w-10 h-10 text-sm";
  return (
    <div className="relative flex-shrink-0">
      <div
        className={cn(
          sizeClass,
          "rounded-full bg-gradient-to-br from-[var(--primary)] to-[#0f3f63] flex items-center justify-center font-bold text-white shadow-sm"
        )}
      >
        {initials}
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function InAppMessagingChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string | null>("conv-1");
  const [inputText, setInputText] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [warningText, setWarningText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileList, setShowMobileList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId) ?? null;

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages.length]);

  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (!activeConvId) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId ? { ...c, unreadCount: 0 } : c
      )
    );
  }, [activeConvId]);

  const handleSelectConversation = useCallback((id: string) => {
    setActiveConvId(id);
    setShowMobileList(false);
    setShowWarning(false);
    setInputText("");
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      setInputText(val);
      if (detectContactInfo(val)) {
        setWarningText(
          "براہ کرم ذاتی رابطہ معلومات شیئر نہ کریں۔ Please avoid sharing phone numbers, emails, or social handles."
        );
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    },
    []
  );

  const handleSend = useCallback(() => {
    if (!inputText.trim() || !activeConvId) return;

    const isContactInfo = detectContactInfo(inputText);
    const newMessage: Message = {
      id: `m-${Date.now()}`,
      senderId: CURRENT_USER_ID,
      text: inputText.trim(),
      timestamp: "Just now",
      status: "sent",
      isRedacted: isContactInfo,
      redactedReason: isContactInfo
        ? "Contact information was removed to keep both parties safe."
        : undefined,
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? {
              ...c,
              messages: [...c.messages, newMessage],
              lastMessage: isContactInfo ? "[Message redacted]" : inputText.trim(),
              lastMessageTime: "Just now",
            }
          : c
      )
    );
    setInputText("");
    setShowWarning(false);
  }, [inputText, activeConvId]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const filteredConversations = conversations.filter((c) =>
    c.otherPartyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.taskTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* ── Page Header ── */}
      <div className="bg-[var(--card)] border-b border-[var(--border)] sticky top-0 z-30">
        <div className="container">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              {/* Mobile back button */}
              {!showMobileList && (
                <button
                  onClick={() => setShowMobileList(true)}
                  className="lg:hidden p-1.5 rounded-lg hover:bg-[var(--background)] transition-colors"
                  aria-label="Back to conversations"
                >
                  <ChevronLeft className="w-5 h-5 text-[var(--foreground)]" />
                </button>
              )}
              <div>
                <h1 className="font-bold text-[var(--foreground)] text-base leading-tight">
                  پیغامات
                  <span className="ml-2 text-sm font-normal text-[var(--muted-foreground)]">Messages</span>
                </h1>
                {totalUnread > 0 && (
                  <p className="text-xs text-[var(--primary)] font-medium">
                    {totalUnread} unread
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium px-2.5 py-1 rounded-full">
                <Shield className="w-3 h-3" />
                <span>آپ کی معلومات محفوظ ہیں</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Two-panel layout ── */}
      <div className="container py-4">
        <div className="flex gap-4 h-[calc(100vh-8rem)]">

          {/* ── LEFT: Conversation List ── */}
          <div
            className={cn(
              "flex flex-col bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-[0_2px_8px_rgba(26,26,46,0.06)] overflow-hidden",
              "w-full lg:w-80 xl:w-96 flex-shrink-0",
              // Mobile: show/hide based on state
              showMobileList ? "flex" : "hidden lg:flex"
            )}
          >
            {/* Search */}
            <div className="p-3 border-b border-[var(--border)]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                <input
                  type="text"
                  placeholder="تلاش کریں... Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[var(--background)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all placeholder:text-[var(--muted-foreground)]"
                />
              </div>
            </div>

            {/* Conversation items */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-[var(--background)] flex items-center justify-center">
                    <Search className="w-5 h-5 text-[var(--muted-foreground)]" />
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)]">کوئی گفتگو نہیں ملی</p>
                  <p className="text-xs text-[var(--muted-foreground)]">No conversations found</p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={cn(
                      "w-full text-left px-4 py-3.5 border-b border-[var(--border)] transition-all duration-150 hover:bg-[var(--background)] group",
                      activeConvId === conv.id
                        ? "bg-blue-50 border-l-4 border-l-[var(--primary)]"
                        : "border-l-4 border-l-transparent"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar
                        initials={conv.otherPartyInitials}
                        online={conv.id === "conv-1"}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-semibold text-sm text-[var(--foreground)] truncate">
                            {conv.otherPartyName}
                          </span>
                          <span className="text-[10px] text-[var(--muted-foreground)] flex-shrink-0 ml-2">
                            {conv.lastMessageTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <VerificationBadge status={conv.otherPartyVerification} />
                          {conv.otherPartyRating > 0 && (
                            <span className="flex items-center gap-0.5 text-[10px] text-amber-600 font-medium">
                              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                              {conv.otherPartyRating}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[var(--muted-foreground)] truncate mb-1">
                          {conv.taskTitle}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-[var(--muted-foreground)] truncate flex-1">
                            {conv.lastMessage}
                          </p>
                          {conv.unreadCount > 0 && (
                            <span className="ml-2 flex-shrink-0 w-5 h-5 rounded-full bg-[var(--primary)] text-white text-[10px] font-bold flex items-center justify-center">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* ── RIGHT: Chat Panel ── */}
          <div
            className={cn(
              "flex-1 flex flex-col bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-[0_2px_8px_rgba(26,26,46,0.06)] overflow-hidden min-w-0",
              showMobileList ? "hidden lg:flex" : "flex"
            )}
          >
            {activeConv ? (
              <>
                {/* Chat header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--card)]">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar initials={activeConv.otherPartyInitials} online={activeConv.id === "conv-1"} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-[var(--foreground)] text-sm">
                          {activeConv.otherPartyName}
                        </span>
                        <VerificationBadge status={activeConv.otherPartyVerification} />
                        {activeConv.otherPartyRating > 0 && (
                          <span className="flex items-center gap-0.5 text-xs text-amber-600 font-medium">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {activeConv.otherPartyRating}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {activeConv.taskArea}
                        </span>
                        <span className="text-xs font-semibold text-[var(--primary)]">
                          {formatPKR(activeConv.taskBudgetPkr)}
                        </span>
                        <Link
                          href={`/task/${activeConv.taskId}`}
                          className="text-xs text-[var(--primary)] hover:underline truncate max-w-[140px]"
                        >
                          {activeConv.taskTitle}
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      className="p-2 rounded-xl hover:bg-[var(--background)] transition-colors text-[var(--muted-foreground)] hover:text-red-600"
                      title="Report conversation"
                      aria-label="Report"
                    >
                      <Flag className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 rounded-xl hover:bg-[var(--background)] transition-colors text-[var(--muted-foreground)]"
                      aria-label="More options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Safety banner */}
                <div className="mx-4 mt-3 mb-1 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
                  <Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-amber-800">آپ کی معلومات محفوظ ہیں</p>
                    <p className="text-[11px] text-amber-700 leading-relaxed">
                      Phone numbers, emails, and social handles are automatically removed from messages to protect both parties. Stay safe — keep all communication in-app.
                    </p>
                  </div>
                </div>

                {/* Messages area */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                  <AnimatePresence initial={false}>
                    {activeConv.messages.map((msg) => {
                      const isMine = msg.senderId === CURRENT_USER_ID;
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className={cn(
                            "flex",
                            isMine ? "justify-end" : "justify-start"
                          )}
                        >
                          {!isMine && (
                            <Avatar initials={activeConv.otherPartyInitials} size="sm" />
                          )}
                          <div
                            className={cn(
                              "max-w-[72%] ml-2 mr-2",
                              isMine ? "ml-auto mr-0" : "ml-2 mr-auto"
                            )}
                          >
                            {msg.isRedacted ? (
                              <div className="bg-amber-50 border border-amber-200 rounded-2xl px-3.5 py-2.5">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                                  <span className="text-[10px] font-semibold text-amber-700 uppercase tracking-wide">
                                    Redacted
                                  </span>
                                </div>
                                <p className="text-xs italic text-amber-700 leading-relaxed">
                                  {msg.redactedReason}
                                </p>
                              </div>
                            ) : (
                              <div
                                className={cn(
                                  "rounded-2xl px-3.5 py-2.5 shadow-sm",
                                  isMine
                                    ? "bg-[var(--primary)] text-white rounded-br-sm"
                                    : "bg-white border border-[var(--border)] text-[var(--foreground)] rounded-bl-sm"
                                )}
                              >
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                              </div>
                            )}
                            <div
                              className={cn(
                                "flex items-center gap-1 mt-1",
                                isMine ? "justify-end" : "justify-start"
                              )}
                            >
                              <span className="text-[10px] text-[var(--muted-foreground)]">
                                {msg.timestamp}
                              </span>
                              {isMine && !msg.isRedacted && (
                                <MessageStatusIcon status={msg.status} />
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                {/* Warning banner */}
                <AnimatePresence>
                  {showWarning && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mx-4 mb-2"
                    >
                      <div className="flex items-start gap-2 bg-amber-50 border border-amber-300 rounded-xl px-3 py-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-amber-800">
                            رابطہ معلومات شیئر نہ کریں
                          </p>
                          <p className="text-[11px] text-amber-700">
                            {warningText}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Input area */}
                <div className="px-4 pb-4 pt-2 border-t border-[var(--border)] bg-[var(--card)]">
                  <div className="flex items-end gap-2">
                    <div className="flex-1 relative">
                      <textarea
                        ref={inputRef}
                        value={inputText}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="پیغام لکھیں... Type a message"
                        rows={1}
                        className="w-full resize-none bg-[var(--background)] border border-[var(--border)] rounded-2xl px-4 py-3 pr-10 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all leading-relaxed max-h-32 overflow-y-auto"
                        style={{ minHeight: "44px" }}
                      />
                      <button
                        className="absolute right-3 bottom-3 text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
                        aria-label="Attach file"
                        type="button"
                      >
                        <Paperclip className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={handleSend}
                      disabled={!inputText.trim()}
                      className={cn(
                        "flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200",
                        inputText.trim()
                          ? "bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-md hover:shadow-lg"
                          : "bg-[var(--border)] text-[var(--muted-foreground)] cursor-not-allowed"
                      )}
                      aria-label="Send message"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[10px] text-[var(--muted-foreground)] mt-2 text-center">
                    <Shield className="w-3 h-3 inline mr-1 text-[var(--primary)]" />
                    Contact info is automatically removed. Keep communication in-app for your safety.
                  </p>
                </div>
              </>
            ) : (
              /* Empty state */
              <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[var(--background)] border border-[var(--border)] flex items-center justify-center">
                  <Phone className="w-7 h-7 text-[var(--muted-foreground)]" />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--foreground)] mb-1">گفتگو منتخب کریں</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Select a conversation to start messaging
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
                  <Shield className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <p className="text-xs text-amber-700">
                    آپ کی معلومات محفوظ ہیں — Your information is protected
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
