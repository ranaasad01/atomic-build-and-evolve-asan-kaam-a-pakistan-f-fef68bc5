"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, CheckCircle, AlertCircle, Send, ArrowLeft, Search, MoreVertical, Phone, Star } from 'lucide-react';
import { cn } from "@/lib/utils";
import { VerificationStatus } from "@/lib/data";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRedacted?: boolean;
}

interface Conversation {
  id: string;
  participantName: string;
  participantInitials: string;
  participantRole: "poster" | "tasker";
  verificationStatus: VerificationStatus;
  taskTitle: string;
  taskId: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  hasRedactedMessage?: boolean;
  messages: Message[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CURRENT_USER_ID = "me";

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    participantName: "Muhammad Bilal",
    participantInitials: "MB",
    participantRole: "tasker",
    verificationStatus: "verified",
    taskTitle: "Move furniture from DHA to Gulshan",
    taskId: "task-001",
    lastMessage: "I can be there by 9 AM with a helper.",
    lastMessageTime: "10:42 AM",
    unreadCount: 2,
    hasRedactedMessage: false,
    messages: [
      {
        id: "m1",
        senderId: "bilal",
        text: "Assalam o Alaikum! I saw your task for furniture moving. I have experience with this kind of work.",
        timestamp: "9:15 AM",
      },
      {
        id: "m2",
        senderId: CURRENT_USER_ID,
        text: "Walaikum Assalam! Yes, I need 2 helpers and a small truck if possible.",
        timestamp: "9:22 AM",
      },
      {
        id: "m3",
        senderId: "bilal",
        text: "No problem. I have a partner and we can arrange a Suzuki pickup. What floor are you on?",
        timestamp: "9:30 AM",
      },
      {
        id: "m4",
        senderId: CURRENT_USER_ID,
        text: "2nd floor, no elevator. The new place is ground floor so that should be easier.",
        timestamp: "9:35 AM",
      },
      {
        id: "m5",
        senderId: "bilal",
        text: "Understood. We handle this regularly. I can be there by 9 AM with a helper.",
        timestamp: "10:42 AM",
      },
    ],
  },
  {
    id: "conv-2",
    participantName: "Ayesha Siddiqui",
    participantInitials: "AS",
    participantRole: "poster",
    verificationStatus: "verified",
    taskTitle: "Grocery run from Imtiaz Store",
    taskId: "task-002",
    lastMessage: "[Contact info removed for safety]",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    hasRedactedMessage: true,
    messages: [
      {
        id: "m1",
        senderId: CURRENT_USER_ID,
        text: "Hello! I have accepted your grocery task. Please share the list.",
        timestamp: "Yesterday, 2:10 PM",
      },
      {
        id: "m2",
        senderId: "ayesha",
        text: "Great! Here is the list: 2kg atta, 1L milk, eggs (12), bread, and some vegetables.",
        timestamp: "Yesterday, 2:15 PM",
      },
      {
        id: "m3",
        senderId: "ayesha",
        text: "[Contact info removed for safety]",
        timestamp: "Yesterday, 2:16 PM",
        isRedacted: true,
      },
      {
        id: "m4",
        senderId: CURRENT_USER_ID,
        text: "Understood. I will use the in-app address for delivery. On my way!",
        timestamp: "Yesterday, 2:20 PM",
      },
    ],
  },
  {
    id: "conv-3",
    participantName: "Ali Hassan",
    participantInitials: "AH",
    participantRole: "tasker",
    verificationStatus: "submitted",
    taskTitle: "Deep clean 3-bedroom apartment",
    taskId: "task-003",
    lastMessage: "Can we reschedule to Saturday morning?",
    lastMessageTime: "Mon",
    unreadCount: 1,
    hasRedactedMessage: false,
    messages: [
      {
        id: "m1",
        senderId: "ali",
        text: "Hello, I submitted a bid for your cleaning task. I have all my own supplies.",
        timestamp: "Mon, 11:00 AM",
      },
      {
        id: "m2",
        senderId: CURRENT_USER_ID,
        text: "Good. Can you do Friday afternoon?",
        timestamp: "Mon, 11:30 AM",
      },
      {
        id: "m3",
        senderId: "ali",
        text: "Can we reschedule to Saturday morning?",
        timestamp: "Mon, 12:05 PM",
      },
    ],
  },
  {
    id: "conv-4",
    participantName: "Sana Mirza",
    participantInitials: "SM",
    participantRole: "poster",
    verificationStatus: "verified",
    taskTitle: "Fix leaking kitchen tap",
    taskId: "task-004",
    lastMessage: "Thank you! Great work today.",
    lastMessageTime: "Sun",
    unreadCount: 0,
    hasRedactedMessage: false,
    messages: [
      {
        id: "m1",
        senderId: "sana",
        text: "Are you available today for the tap repair?",
        timestamp: "Sun, 8:00 AM",
      },
      {
        id: "m2",
        senderId: CURRENT_USER_ID,
        text: "Yes, I can be there by 10 AM. I will bring the necessary tools.",
        timestamp: "Sun, 8:10 AM",
      },
      {
        id: "m3",
        senderId: "sana",
        text: "Perfect. The address is in the task details.",
        timestamp: "Sun, 8:15 AM",
      },
      {
        id: "m4",
        senderId: CURRENT_USER_ID,
        text: "Done! Both the tap and the flush handle are fixed.",
        timestamp: "Sun, 12:30 PM",
      },
      {
        id: "m5",
        senderId: "sana",
        text: "Thank you! Great work today.",
        timestamp: "Sun, 12:45 PM",
      },
    ],
  },
];

// ─── Helper Components ────────────────────────────────────────────────────────

function VerificationBadge({ status }: { status: VerificationStatus }) {
  if (status === "verified") {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">
        <CheckCircle className="w-2.5 h-2.5" />
        Verified
      </span>
    );
  }
  if (status === "submitted") {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">
        <AlertCircle className="w-2.5 h-2.5" />
        Pending
      </span>
    );
  }
  if (status === "restricted") {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full">
        <AlertCircle className="w-2.5 h-2.5" />
        Restricted
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-gray-700 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded-full">
      Unverified
    </span>
  );
}

function Avatar({ initials, size = "md" }: { initials: string; size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };
  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br from-[#1B6CA8] to-[#155a8a] text-white font-bold flex items-center justify-center flex-shrink-0 shadow-sm",
        sizes[size]
      )}
    >
      {initials}
    </div>
  );
}

// ─── Conversation List Item ───────────────────────────────────────────────────

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
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-3.5 flex items-start gap-3 transition-all duration-150 border-b border-[var(--border)] relative",
        isActive
          ? "bg-[#EBF4FB] border-l-4 border-l-[var(--primary)]"
          : "hover:bg-[var(--background)] border-l-4 border-l-transparent"
      )}
    >
      <div className="relative flex-shrink-0">
        <Avatar initials={conv.participantInitials} size="md" />
        {conv.verificationStatus === "verified" && (
          <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
            <CheckCircle className="w-2.5 h-2.5 text-white" />
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className={cn("text-sm font-semibold truncate", isActive ? "text-[var(--primary)]" : "text-[var(--foreground)]")}>
            {conv.participantName}
          </span>
          <span className="text-[11px] text-[var(--muted-foreground)] flex-shrink-0">
            {conv.lastMessageTime}
          </span>
        </div>

        <p className="text-[11px] text-[var(--muted-foreground)] truncate mb-1">
          {conv.taskTitle}
        </p>

        <div className="flex items-center justify-between gap-2">
          <p
            className={cn(
              "text-xs truncate",
              conv.hasRedactedMessage
                ? "text-amber-600 italic"
                : "text-[var(--muted-foreground)]"
            )}
          >
            {conv.lastMessage}
          </p>
          {conv.unreadCount > 0 && (
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--primary)] text-white text-[10px] font-bold flex items-center justify-center">
              {conv.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Chat Panel ───────────────────────────────────────────────────────────────

function ChatPanel({
  conv,
  onBack,
}: {
  conv: Conversation;
  onBack: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>(conv.messages);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Sync messages when conversation changes
  useEffect(() => {
    setMessages(conv.messages);
    setInputText("");
  }, [conv.id, conv.messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Contact info redaction pattern
  function redactContactInfo(text: string): { text: string; wasRedacted: boolean } {
    const patterns = [
      /(?:\+92|0092|92)?[-\s]?3\d{2}[-\s]?\d{7}/g, // Pakistani phone
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, // email
      /(?:https?:\/\/|www\.)[^\s]+/g, // URLs
      /(?:wa\.me|whatsapp|instagram|facebook|twitter|tiktok)\/[^\s]*/gi, // social
    ];
    let result = text;
    let wasRedacted = false;
    for (const pattern of patterns) {
      if (pattern.test(result)) {
        wasRedacted = true;
        result = result.replace(pattern, "[Contact info removed for safety]");
      }
    }
    return { text: result, wasRedacted };
  }

  function handleSend() {
    const trimmed = inputText.trim();
    if (!trimmed || isSending) return;

    setIsSending(true);
    const { text: redactedText, wasRedacted } = redactContactInfo(trimmed);

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: CURRENT_USER_ID,
      text: redactedText,
      timestamp: "Just now",
      isRedacted: wasRedacted,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
    setTimeout(() => setIsSending(false), 300);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[var(--card)] border-b border-[var(--border)] shadow-sm flex-shrink-0">
        <button
          onClick={onBack}
          className="lg:hidden p-1.5 rounded-lg hover:bg-[var(--background)] transition-colors text-[var(--muted-foreground)]"
          aria-label="Back to conversations"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="relative flex-shrink-0">
          <Avatar initials={conv.participantInitials} size="md" />
          {conv.verificationStatus === "verified" && (
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
              <CheckCircle className="w-2.5 h-2.5 text-white" />
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-[var(--foreground)] text-sm">
              {conv.participantName}
            </span>
            <VerificationBadge status={conv.verificationStatus} />
          </div>
          <p className="text-xs text-[var(--muted-foreground)] truncate">
            Re: {conv.taskTitle}
          </p>
        </div>

        <button
          className="p-1.5 rounded-lg hover:bg-[var(--background)] transition-colors text-[var(--muted-foreground)]"
          aria-label="More options"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[var(--background)]">
        {/* Task context pill */}
        <div className="flex justify-center">
          <span className="text-[11px] text-[var(--muted-foreground)] bg-[var(--card)] border border-[var(--border)] px-3 py-1 rounded-full shadow-sm">
            Task: {conv.taskTitle}
          </span>
        </div>

        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isMine = msg.senderId === CURRENT_USER_ID;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={cn("flex", isMine ? "justify-end" : "justify-start")}
              >
                <div className={cn("max-w-[78%] flex flex-col", isMine ? "items-end" : "items-start")}>
                  {msg.isRedacted ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl px-3.5 py-2.5 shadow-sm">
                      <p className="text-xs text-amber-700 italic flex items-center gap-1.5">
                        <Shield className="w-3 h-3 flex-shrink-0" />
                        [Contact info removed for safety]
                      </p>
                    </div>
                  ) : (
                    <div
                      className={cn(
                        "rounded-2xl px-3.5 py-2.5 shadow-sm",
                        isMine
                          ? "bg-[var(--primary)] text-white rounded-br-sm"
                          : "bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] rounded-bl-sm"
                      )}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  )}
                  <span className="text-[10px] text-[var(--muted-foreground)] mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Safety notice + Input */}
      <div className="flex-shrink-0 bg-[var(--card)] border-t border-[var(--border)]">
        <div className="px-4 pt-2 pb-1">
          <p className="text-[10px] text-[var(--muted-foreground)] flex items-center gap-1">
            <Shield className="w-3 h-3 text-amber-500 flex-shrink-0" />
            Phone numbers and emails are automatically removed for your safety.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 pb-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-[var(--background)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isSending}
            className="w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center flex-shrink-0 hover:bg-[var(--primary-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MessagesPage() {
  const [conversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showChat, setShowChat] = useState(false); // mobile: show chat panel

  const activeConv = conversations.find((c) => c.id === activeConvId) ?? null;

  const filteredConvs = conversations.filter(
    (c) =>
      c.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.taskTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleSelectConv(id: string) {
    setActiveConvId(id);
    setShowChat(true);
  }

  function handleBack() {
    setShowChat(false);
  }

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Safety Banner */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="container">
          <div className="flex items-center gap-2.5 py-2.5">
            <Shield className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <p className="text-xs text-amber-800 font-medium">
              <span className="font-bold">آپ کی معلومات محفوظ ہیں</span>
              {" — "}
              Your contact details are protected in Asan Kaam chat.
            </p>
          </div>
        </div>
      </div>

      <div className="container py-4 md:py-6">
        {/* Page header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[var(--foreground)]">
              Messages
              {totalUnread > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--primary)] text-white text-[10px] font-bold">
                  {totalUnread}
                </span>
              )}
            </h1>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Two-panel layout */}
        <div
          className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(26,26,46,0.08)]"
          style={{ height: "calc(100vh - 220px)", minHeight: 480 }}
        >
          <div className="flex h-full">
            {/* ── Conversation List (left panel) ── */}
            <div
              className={cn(
                "flex flex-col border-r border-[var(--border)] bg-[var(--card)] transition-all duration-200",
                // Mobile: full width unless chat is shown
                showChat ? "hidden lg:flex lg:w-80 xl:w-96" : "flex w-full lg:w-80 xl:w-96"
              )}
            >
              {/* Search */}
              <div className="p-3 border-b border-[var(--border)]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search conversations..."
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg pl-9 pr-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto">
                {filteredConvs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 py-12 px-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-[var(--background)] flex items-center justify-center">
                      <Search className="w-5 h-5 text-[var(--muted-foreground)]" />
                    </div>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      No conversations found.
                    </p>
                  </div>
                ) : (
                  filteredConvs.map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conv={conv}
                      isActive={conv.id === activeConvId}
                      onClick={() => handleSelectConv(conv.id)}
                    />
                  ))
                )}
              </div>
            </div>

            {/* ── Chat Panel (right panel) ── */}
            <div
              className={cn(
                "flex-1 flex flex-col min-w-0",
                // Mobile: only show when chat is active
                showChat ? "flex" : "hidden lg:flex"
              )}
            >
              {activeConv ? (
                <ChatPanel conv={activeConv} onBack={handleBack} />
              ) : (
                /* Empty state for desktop */
                <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#EBF4FB] flex items-center justify-center">
                    <Shield className="w-7 h-7 text-[var(--primary)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--foreground)] mb-1">
                      محفوظ گفتگو — Safe Conversations
                    </h3>
                    <p className="text-sm text-[var(--muted-foreground)] max-w-xs leading-relaxed">
                      Select a conversation to start chatting. All messages are monitored to keep your personal contact details private.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 w-full max-w-xs">
                    {[
                      { icon: Shield, text: "Contact info is automatically redacted" },
                      { icon: CheckCircle, text: "Verified tasker badges shown" },
                      { icon: Star, text: "Rate after task completion" },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-center gap-2.5 bg-[var(--background)] rounded-lg px-3 py-2 border border-[var(--border)]">
                        <Icon className="w-4 h-4 text-[var(--primary)] flex-shrink-0" />
                        <span className="text-xs text-[var(--muted-foreground)]">{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
