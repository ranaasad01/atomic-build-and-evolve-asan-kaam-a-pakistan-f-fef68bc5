"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, Shield, CheckCircle, ArrowRight, User, Briefcase, MessageSquare, Banknote, Star, Moon } from 'lucide-react';

type Step = "phone" | "otp" | "role";
type Role = "poster" | "tasker" | null;

const TRUST_BULLETS = [
  "Verified taskers with CNIC checks",
  "Safe in-app messaging — no contact exposure",
  "Transparent PKR pricing — no hidden fees",
];

const TRUST_FEATURES = [
  {
    icon: Shield,
    title: "CNIC Verified Taskers",
    desc: "Every tasker completes identity verification before accepting paid work on the platform.",
  },
  {
    icon: MessageSquare,
    title: "Safe Messaging",
    desc: "Our in-app chat automatically redacts phone numbers, emails, and social handles to protect both parties.",
  },
  {
    icon: Banknote,
    title: "PKR Payments",
    desc: "All bids, budgets, and commissions are shown in Pakistani Rupees with full transparency before you commit.",
  },
];

export default function AuthPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(["" ,"", "", "", "", ""]);
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [countdown, setCountdown] = useState(0);
  const [success, setSuccess] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [otpError, setOtpError] = useState("");
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  function handleSendOtp() {
    const cleaned = phone.replace(/\s/g, "");
    if (!/^3\d{9}$/.test(cleaned)) {
      setPhoneError("Enter a valid Pakistani mobile number (e.g. 3XX XXX XXXX)");
      return;
    }
    setPhoneError("");
    setCountdown(30);
    setStep("otp");
  }

  function handleOtpChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function handleVerifyOtp() {
    const code = otp.join("");
    if (code.length < 6) {
      setOtpError("Please enter all 6 digits.");
      return;
    }
    setOtpError("");
    setStep("role");
  }

  function handleResendOtp() {
    if (countdown > 0) return;
    setOtp(["", "", "", "", "", ""]);
    setCountdown(30);
  }

  function handleGetStarted() {
    if (!selectedRole) return;
    setSuccess(true);
    setTimeout(() => {
      router.push(selectedRole === "poster" ? "/post-task" : "/my-bids-tasker");
    }, 1800);
  }

  const maskedPhone = `+92 ${phone.slice(0, 3)}*** ${phone.slice(-4)}`;

  return (
    <main
      className="min-h-screen flex items-stretch"
      style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
    >
      {/* ── LEFT DECORATIVE PANEL ── */}
      <div
        className="hidden lg:flex lg:w-[45%] xl:w-[42%] flex-col justify-between relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #0D4F8C 0%, #1B6CA8 55%, #1a5f96 100%)",
        }}
      >
        {/* Pakistani geometric pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M40 0L50 20L70 20L55 32L62 52L40 40L18 52L25 32L10 20L30 20Z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "80px 80px",
          }}
          aria-hidden="true"
        />

        {/* Radial glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #F5A623 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        {/* Top: Logo */}
        <div className="relative z-10 p-8 pt-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(245,166,35,0.2)", border: "1.5px solid rgba(245,166,35,0.5)" }}
            >
              <CheckCircle className="w-5 h-5" style={{ color: "#F5A623" }} />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Asan Kaam</span>
          </Link>
        </div>

        {/* Center: Urdu welcome + tagline */}
        <div className="relative z-10 px-8 py-6 flex-1 flex flex-col justify-center">
          {/* Crescent icon */}
          <div className="mb-4">
            <Moon
              className="w-10 h-10"
              style={{ color: "#F5A623", fill: "rgba(245,166,35,0.15)" }}
              aria-hidden="true"
            />
          </div>

          {/* Urdu welcome */}
          <p
            className="text-5xl font-bold text-white mb-2 leading-tight"
            style={{
              fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif",
              direction: "rtl",
              textAlign: "right",
            }}
          >
            خوش آمدید
          </p>

          <h2 className="text-2xl font-bold text-white mt-3 mb-1 tracking-tight">
            Asan Kaam
          </h2>
          <p className="text-white/70 text-sm mb-8 leading-relaxed">
            Pakistan ka local task marketplace — kaam dhundo, kaam karo.
          </p>

          {/* Trust bullets */}
          <ul className="space-y-4">
            {TRUST_BULLETS.map((bullet, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(245,166,35,0.2)", border: "1.5px solid #F5A623" }}
                >
                  <CheckCircle className="w-3 h-3" style={{ color: "#F5A623" }} />
                </span>
                <span className="text-white/85 text-sm leading-relaxed">{bullet}</span>
              </li>
            ))}
          </ul>

          {/* Feature cards */}
          <div className="mt-10 space-y-3">
            {TRUST_FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl p-3"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(245,166,35,0.15)" }}
                  >
                    <Icon className="w-4 h-4" style={{ color: "#F5A623" }} />
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold mb-0.5">{f.title}</p>
                    <p className="text-white/55 text-xs leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom: city badges */}
        <div className="relative z-10 p-8 pb-10">
          <p className="text-white/40 text-xs mb-3 uppercase tracking-widest">Live Cities</p>
          <div className="flex flex-wrap gap-2">
            {["Karachi", "Lahore", "Islamabad", "Rawalpindi"].map((city) => (
              <span
                key={city}
                className="text-xs px-3 py-1 rounded-full text-white/70"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                {city}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: AUTH FORM COLUMN ── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white min-h-screen px-5 py-12">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8 flex flex-col items-center gap-2">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #0D4F8C, #1B6CA8)" }}
          >
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl text-[var(--foreground)] tracking-tight">Asan Kaam</span>
          <p className="text-[var(--muted-foreground)] text-xs text-center">
            Pakistan ka local task marketplace
          </p>
        </div>

        <div className="w-full max-w-md">
          {/* ── SUCCESS STATE ── */}
          {success ? (
            <div className="text-center py-12 px-6">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: "linear-gradient(135deg, #22c55e20, #16a34a20)", border: "2px solid #22c55e" }}
              >
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                Mubarak Ho! 🎉
              </h2>
              <p className="text-[var(--muted-foreground)] text-sm mb-1">
                Your account is ready.
              </p>
              <p className="text-[var(--muted-foreground)] text-sm">
                Taking you to your dashboard...
              </p>
              <div className="mt-6 flex justify-center">
                <div
                  className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin"
                  style={{ borderColor: "#1B6CA8", borderTopColor: "transparent" }}
                />
              </div>
            </div>
          ) : (
            <>
              {/* ── STEP INDICATOR ── */}
              <div className="flex items-center gap-2 mb-8">
                {(["phone", "otp", "role"] as Step[]).map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                      style={{
                        background:
                          step === s
                            ? "#1B6CA8"
                            : (["phone", "otp", "role"].indexOf(step) > i
                              ? "#22c55e"
                              : "#E5E7EB"),
                        color:
                          step === s || ["phone", "otp", "role"].indexOf(step) > i
                            ? "#fff"
                            : "#9CA3AF",
                      }}
                    >
                      {["phone", "otp", "role"].indexOf(step) > i ? (
                        <CheckCircle className="w-3.5 h-3.5" />
                      ) : (
                        i + 1
                      )}
                    </div>
                    {i < 2 && (
                      <div
                        className="h-0.5 w-8 rounded-full transition-all duration-300"
                        style={{
                          background:
                            ["phone", "otp", "role"].indexOf(step) > i
                              ? "#22c55e"
                              : "#E5E7EB",
                        }}
                      />
                    )}
                  </div>
                ))}
                <span className="ml-2 text-xs text-[var(--muted-foreground)] font-medium">
                  {step === "phone" && "Number"}
                  {step === "otp" && "Verify"}
                  {step === "role" && "Role"}
                </span>
              </div>

              {/* ── PHONE STEP ── */}
              {step === "phone" && (
                <div>
                  <div className="mb-6">
                    <h1
                      className="text-2xl font-bold mb-1 tracking-tight"
                      style={{ color: "#1A1A2E" }}
                    >
                      Apna Number Darj Karein
                    </h1>
                    <p className="text-[var(--muted-foreground)] text-sm">
                      Enter your Pakistani mobile number to get started.
                    </p>
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-[var(--foreground)] mb-2 uppercase tracking-wide">
                      Mobile Number
                    </label>
                    <div
                      className="flex items-stretch rounded-xl overflow-hidden"
                      style={{ border: phoneError ? "1.5px solid #C0392B" : "1.5px solid #D6DCE8" }}
                    >
                      {/* +92 prefix badge */}
                      <div
                        className="flex items-center gap-1.5 px-3 py-3 flex-shrink-0 select-none"
                        style={{ background: "#F2F4F7", borderRight: "1.5px solid #D6DCE8" }}
                      >
                        <span className="text-base" aria-label="Pakistani flag">🇵🇰</span>
                        <span className="text-sm font-bold text-[var(--foreground)]">
                          +92
                        </span>
                      </div>
                      <input
                        type="tel"
                        inputMode="numeric"
                        placeholder="3XX XXX XXXX"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value.replace(/[^\d\s]/g, ""));
                          if (phoneError) setPhoneError("");
                        }}
                        onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                        maxLength={11}
                        className="flex-1 px-4 py-3 text-sm font-medium bg-white outline-none placeholder:text-gray-600"
                        style={{ color: "#1A1A2E" }}
                        aria-label="Mobile number"
                        autoComplete="tel"
                      />
                    </div>
                    {phoneError && (
                      <p className="mt-2 text-xs text-[var(--destructive)] flex items-center gap-1">
                        <span>⚠</span> {phoneError}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                      We will send a 6-digit OTP to verify your number.
                    </p>
                  </div>

                  <button
                    onClick={handleSendOtp}
                    className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 active:scale-[0.98] mt-2"
                    style={{ background: "linear-gradient(135deg, #1B6CA8, #0D4F8C)" }}
                  >
                    OTP Bhejein
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-center text-xs text-[var(--muted-foreground)] mt-5">
                    By continuing, you agree to Asan Kaam&apos;s{" "}
                    <Link href="/" className="text-[var(--primary)] hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/" className="text-[var(--primary)] hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
              )}

              {/* ── OTP STEP ── */}
              {step === "otp" && (
                <div>
                  <div className="mb-6">
                    <h1
                      className="text-2xl font-bold mb-1 tracking-tight"
                      style={{ color: "#1A1A2E" }}
                    >
                      OTP Darj Karein
                    </h1>
                    <p className="text-[var(--muted-foreground)] text-sm">
                      6-digit code sent to{" "}
                      <span className="font-semibold text-[var(--foreground)]">
                        {maskedPhone}
                      </span>
                    </p>
                  </div>

                  {/* 6 OTP boxes */}
                  <div className="flex gap-2.5 mb-4 justify-center">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="w-11 h-13 text-center text-lg font-bold rounded-xl outline-none transition-all duration-200"
                        style={{
                          border: digit
                            ? "2px solid #F5A623"
                            : otpError
                            ? "2px solid #C0392B"
                            : "2px solid #D6DCE8",
                          background: digit ? "#FFFBF0" : "#F9FAFB",
                          color: "#1A1A2E",
                          width: "44px",
                          height: "52px",
                        }}
                        aria-label={`OTP digit ${i + 1}`}
                      />
                    ))}
                  </div>

                  {otpError && (
                    <p className="text-center text-xs text-[var(--destructive)] mb-3">
                      ⚠ {otpError}
                    </p>
                  )}

                  {/* Resend countdown */}
                  <div className="text-center mb-5">
                    {countdown > 0 ? (
                      <p className="text-xs text-[var(--muted-foreground)]">
                        Dobara bhejne ke liye intezaar karein:{" "}
                        <span className="font-bold" style={{ color: "#1B6CA8" }}>
                          {countdown}s
                        </span>
                      </p>
                    ) : (
                      <button
                        onClick={handleResendOtp}
                        className="text-xs font-semibold hover:underline transition-colors"
                        style={{ color: "#1B6CA8" }}
                      >
                        OTP Dobara Bhejein
                      </button>
                    )}
                  </div>

                  <button
                    onClick={handleVerifyOtp}
                    className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                    style={{ background: "linear-gradient(135deg, #1B6CA8, #0D4F8C)" }}
                  >
                    Verify Karein
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => { setStep("phone"); setOtp(["", "", "", "", "", ""]); setOtpError(""); }}
                    className="w-full mt-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-gray-50"
                    style={{ color: "#5A6478" }}
                  >
                    Wapas Jaein
                  </button>
                </div>
              )}

              {/* ── ROLE STEP ── */}
              {step === "role" && (
                <div>
                  <div className="mb-6">
                    <h1
                      className="text-2xl font-bold mb-1 tracking-tight"
                      style={{ color: "#1A1A2E" }}
                    >
                      Apna Role Chunein
                    </h1>
                    <p className="text-[var(--muted-foreground)] text-sm">
                      You can switch roles anytime from your settings.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 mb-6">
                    {/* Poster card */}
                    <button
                      onClick={() => setSelectedRole("poster")}
                      className="relative text-left rounded-2xl p-5 transition-all duration-200 hover:shadow-md active:scale-[0.99]"
                      style={{
                        border: selectedRole === "poster"
                          ? "2px solid #F5A623"
                          : "2px solid #D6DCE8",
                        background: selectedRole === "poster" ? "#FFFBF0" : "#FAFAFA",
                      }}
                    >
                      {selectedRole === "poster" && (
                        <span
                          className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ background: "#F5A623" }}
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-white" />
                        </span>
                      )}
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background: selectedRole === "poster"
                              ? "rgba(245,166,35,0.15)"
                              : "rgba(27,108,168,0.08)",
                          }}
                        >
                          <User
                            className="w-5 h-5"
                            style={{ color: selectedRole === "poster" ? "#F5A623" : "#1B6CA8" }}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-base" style={{ color: "#1A1A2E" }}>
                            Kaam Chahiye
                          </p>
                          <p className="text-xs text-[var(--muted-foreground)] font-medium">
                            Poster — I need tasks done
                          </p>
                        </div>
                      </div>
                      <ul className="space-y-1.5">
                        {[
                          "Post tasks for free — no listing fee",
                          "Compare bids from verified taskers",
                          "Pay only when the job is done",
                        ].map((point, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-[var(--muted-foreground)]">
                            <span
                              className="mt-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ background: "rgba(27,108,168,0.12)" }}
                            >
                              <CheckCircle className="w-2.5 h-2.5" style={{ color: "#1B6CA8" }} />
                            </span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </button>

                    {/* Tasker card */}
                    <button
                      onClick={() => setSelectedRole("tasker")}
                      className="relative text-left rounded-2xl p-5 transition-all duration-200 hover:shadow-md active:scale-[0.99]"
                      style={{
                        border: selectedRole === "tasker"
                          ? "2px solid #F5A623"
                          : "2px solid #D6DCE8",
                        background: selectedRole === "tasker" ? "#FFFBF0" : "#FAFAFA",
                      }}
                    >
                      {selectedRole === "tasker" && (
                        <span
                          className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ background: "#F5A623" }}
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-white" />
                        </span>
                      )}
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background: selectedRole === "tasker"
                              ? "rgba(245,166,35,0.15)"
                              : "rgba(27,108,168,0.08)",
                          }}
                        >
                          <Briefcase
                            className="w-5 h-5"
                            style={{ color: selectedRole === "tasker" ? "#F5A623" : "#1B6CA8" }}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-base" style={{ color: "#1A1A2E" }}>
                            Kaam Karna Hai
                          </p>
                          <p className="text-xs text-[var(--muted-foreground)] font-medium">
                            Tasker — I want to earn
                          </p>
                        </div>
                      </div>
                      <ul className="space-y-1.5">
                        {[
                          "Bid on nearby tasks in your city",
                          "Earn PKR with full commission transparency",
                          "Build your verified reputation over time",
                        ].map((point, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-[var(--muted-foreground)]">
                            <span
                              className="mt-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ background: "rgba(27,108,168,0.12)" }}
                            >
                              <CheckCircle className="w-2.5 h-2.5" style={{ color: "#1B6CA8" }} />
                            </span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </button>
                  </div>

                  <button
                    onClick={handleGetStarted}
                    disabled={!selectedRole}
                    className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: "linear-gradient(135deg, #1B6CA8, #0D4F8C)" }}
                  >
                    Shuru Karein
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Bottom trust strip */}
        {!success && (
          <div className="mt-10 w-full max-w-md">
            <div
              className="rounded-xl p-4 flex items-start gap-3"
              style={{ background: "#F2F4F7", border: "1px solid #D6DCE8" }}
            >
              <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#1B6CA8" }} />
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                Your number is only used for verification. We never share it with taskers or posters before a task is accepted.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
