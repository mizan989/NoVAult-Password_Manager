import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Server,
  KeyRound,
  FileCheck2,
  Database,
  UserX,
  Mail,
  ArrowLeft,
  ChevronRight,
  Printer,
  ExternalLink,
  Info,
  CheckCircle2,
} from "lucide-react";

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState<string>("summary");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    { id: "summary", title: "1. Executive Summary & Zero-Knowledge" },
    { id: "information-collected", title: "2. Information We Collect" },
    { id: "encryption-mechanics", title: "3. Cryptographic Architecture" },
    { id: "how-we-use-data", title: "4. How We Use Your Information" },
    { id: "cookies-storage", title: "5. Cookies & Local Storage" },
    { id: "third-parties", title: "6. Third-Party Services" },
    { id: "data-retention", title: "7. Data Retention & Deletion" },
    { id: "user-rights", title: "8. Your Privacy Rights (GDPR & CCPA)" },
    { id: "security-measures", title: "9. Technical Security Measures" },
    { id: "changes", title: "10. Policy Updates" },
    { id: "contact", title: "11. Contact & Inquiries" },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-vault-bg text-slate-900 selection:bg-blue-500 selection:text-white flex flex-col">
      {/* Top Floating Glass Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="font-heading text-lg font-bold tracking-tight text-slate-900">
              No<span className="text-vault-accent">VA</span>ult
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              aria-label="Print Policy"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-subtle hover:bg-slate-50 transition-colors"
            >
              <Printer className="h-3.5 w-3.5 text-slate-500" />
              <span>Print</span>
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-subtle hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </Link>
            <Link
              to="/register"
              className="hidden md:inline-flex items-center gap-1.5 rounded-xl bg-vault-accent px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-vault-accentHover transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Document Content */}
      <main className="flex-1 py-10 sm:py-14 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          {/* Header Banner */}
          <div className="mb-10 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-blue-700 mb-3">
              <FileCheck2 className="h-3.5 w-3.5" />
              <span>Legal & Transparency</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Privacy Policy
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
              At NoVAult, we believe that your private credentials, passwords, and sensitive notes belong strictly to you. Our architecture is built upon mathematical zero-knowledge privacy — meaning we cannot read, decrypt, or monetize your encrypted vault data.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 border-b border-slate-200 pb-6">
              <span><strong>Effective Date:</strong> August 20, 2026</span>
              <span>•</span>
              <span><strong>Last Updated:</strong> August 2026</span>
              <span>•</span>
              <span><strong>Applicability:</strong> Global (GDPR / CCPA compliant)</span>
            </div>
          </div>

          {/* Quick Highlight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 to-white p-5 shadow-card">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white mb-3 shadow-glow">
                <EyeOff className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-slate-900">Zero-Knowledge Architecture</h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Your Master Password never leaves your device in a form that allows server-side decryption. Plaintext passwords never touch our databases.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white p-5 shadow-card">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white mb-3 shadow-glowEmerald">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-slate-900">AES-256-GCM + Argon2id</h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Vault entries are encrypted with fresh random IVs and authenticated tags using industry standard cryptographic primitives.
              </p>
            </div>

            <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/50 to-white p-5 shadow-card">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white mb-3 shadow-sm">
                <UserX className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-slate-900">No Ads & No Data Brokering</h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                We do not sell, rent, or trade your personal data or metadata to third-party advertisers, data brokers, or analytics syndicates.
              </p>
            </div>
          </div>

          {/* Policy Body + Sticky Navigation Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Table of Contents - Desktop Sticky Sidebar */}
            <aside className="hidden lg:block lg:col-span-4">
              <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Contents
                </h4>
                <nav className="space-y-1">
                  {sections.map((sec) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      onClick={() => setActiveSection(sec.id)}
                      className={`block rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                        activeSection === sec.id
                          ? "bg-blue-50 text-blue-600 font-semibold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      {sec.title}
                    </a>
                  ))}
                </nav>

                <div className="mt-6 border-t border-slate-100 pt-4">
                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 text-slate-600">
                    <p className="text-[11px] leading-relaxed">
                      Questions regarding our cryptography or privacy guarantees?
                    </p>
                    <a
                      href="mailto:privacy@novault.app"
                      className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      <span>Contact Security Team</span>
                    </a>
                  </div>
                </div>
              </div>
            </aside>

            {/* Policy Sections */}
            <article className="lg:col-span-8 space-y-12 text-slate-700 leading-relaxed">
              {/* Section 1 */}
              <section id="summary" className="scroll-mt-24">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5 mb-3">
                  <ShieldCheck className="h-6 w-6 text-blue-600 shrink-0" />
                  <span>1. Executive Summary & Zero-Knowledge Principle</span>
                </h2>
                <p className="text-sm text-slate-600 mb-3">
                  NoVAult is designed from the ground up as a <strong>Zero-Knowledge Digital Vault</strong>. "Zero-Knowledge" means that the systems, databases, and engineers powering NoVAult have zero technical ability to view, decipher, or extract the plaintext contents of your passwords, secure notes, or credentials.
                </p>
                <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 text-xs text-blue-950 flex items-start gap-3 my-4">
                  <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold block mb-0.5">The Zero-Knowledge Guarantee:</strong>
                    Even in the hypothetical event of a subpoena, technical breach, or database leak, your vault items remain mathematically secure encrypted ciphertext blobs without your private Master Password.
                  </div>
                </div>
              </section>

              {/* Section 2 */}
              <section id="information-collected" className="scroll-mt-24">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5 mb-3">
                  <Database className="h-6 w-6 text-blue-600 shrink-0" />
                  <span>2. Information We Collect</span>
                </h2>
                <p className="text-sm text-slate-600 mb-4">
                  We limit the collection of personal information strictly to what is necessary to authenticate your account and store your encrypted payload:
                </p>
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <h4 className="font-semibold text-slate-900 mb-1">A. Account Information</h4>
                    <p className="text-slate-600 text-xs">
                      When you register via email or Google OAuth, we store your email address, unique account identifier (User ID), and created timestamps. If you authenticate with Google, we store your Google ID to verify subsequent logins.
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <h4 className="font-semibold text-slate-900 mb-1">B. Cryptographic Metadata (Non-Reversible)</h4>
                    <p className="text-slate-600 text-xs">
                      To verify your Master Password and derive keys securely, we store a cryptographic per-user salt and a one-way Argon2id hash of your Master Password. We do not store your plaintext Master Password anywhere.
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <h4 className="font-semibold text-slate-900 mb-1">C. Encrypted Vault Payload</h4>
                    <p className="text-slate-600 text-xs">
                      Each vault item is stored as an encrypted ciphertext string alongside its initialization vector (IV) and authentication tag. We also store item metadata (e.g., whether it is a password or note, category tag, favourite status, and version timestamps).
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <h4 className="font-semibold text-slate-900 mb-1">D. Operational & Security Logs</h4>
                    <p className="text-slate-600 text-xs">
                      For rate limiting, brute-force protection, and fraud prevention, we temporarily process IP addresses and request timestamps via in-memory rate limiters.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section id="encryption-mechanics" className="scroll-mt-24">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5 mb-3">
                  <KeyRound className="h-6 w-6 text-blue-600 shrink-0" />
                  <span>3. Cryptographic Architecture</span>
                </h2>
                <p className="text-sm text-slate-600 mb-4">
                  NoVAult adheres to modern, battle-tested cryptographic standards:
                </p>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 font-mono text-xs text-slate-800 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span><strong>Key Derivation:</strong> Argon2id with high memory cost and iterations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span><strong>Payload Encryption:</strong> AES-256-GCM (Galois/Counter Mode with 128-bit authentication tag)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span><strong>Vector Freshness:</strong> Unique cryptographically random 12-byte IV per encryption operation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span><strong>Transport Security:</strong> Strict HTTPS with TLS 1.3 encryption in transit</span>
                  </div>
                </div>
              </section>

              {/* Section 4 */}
              <section id="how-we-use-data" className="scroll-mt-24">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5 mb-3">
                  <Server className="h-6 w-6 text-blue-600 shrink-0" />
                  <span>4. How We Use Your Information</span>
                </h2>
                <p className="text-sm text-slate-600 mb-3">
                  We use the information we hold solely to:
                </p>
                <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 space-y-1.5">
                  <li>Authenticate your identity and manage your active vault session.</li>
                  <li>Store, synchronize, and serve your encrypted vault entries across your devices.</li>
                  <li>Deliver critical account notifications (e.g., OTP verification codes or security alerts).</li>
                  <li>Detect and prevent malicious activity, brute-force attacks, and denial-of-service attempts.</li>
                </ul>
              </section>

              {/* Section 5 */}
              <section id="cookies-storage" className="scroll-mt-24">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5 mb-3">
                  <Lock className="h-6 w-6 text-blue-600 shrink-0" />
                  <span>5. Cookies & Local Storage</span>
                </h2>
                <p className="text-sm text-slate-600 mb-3">
                  We do not use advertising, marketing, or behavioral tracking cookies. Our use of storage is strictly functional:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-slate-200 bg-white p-3.5">
                    <h5 className="font-semibold text-slate-900 mb-1">HTTP-Only Session Cookies</h5>
                    <p className="text-slate-600">
                      Stores short-lived access and refresh JWTs securely. These cookies are marked `HttpOnly`, `SameSite=Lax`, and `Secure` to prevent unauthorized JavaScript access (XSS defense).
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-3.5">
                    <h5 className="font-semibold text-slate-900 mb-1">Memory & Session State</h5>
                    <p className="text-slate-600">
                      Master Password keys are kept strictly in volatile browser memory for the duration of your unlocked session and cleared immediately upon lock or logout.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 6 */}
              <section id="third-parties" className="scroll-mt-24">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5 mb-3">
                  <ExternalLink className="h-6 w-6 text-blue-600 shrink-0" />
                  <span>6. Third-Party Service Providers</span>
                </h2>
                <p className="text-sm text-slate-600 mb-3">
                  To operate our infrastructure, we integrate with trusted third-party providers bound by rigorous data protection standards:
                </p>
                <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 space-y-2">
                  <li>
                    <strong>Google Identity Services (OAuth):</strong> Used for secure single sign-on authentication when you choose to log in with Google.
                  </li>
                  <li>
                    <strong>Resend:</strong> Used to dispatch transactional one-time passwords (OTP) and security notices.
                  </li>
                  <li>
                    <strong>MongoDB Atlas:</strong> Managed cloud database where your encrypted ciphertext records are securely hosted with encryption-at-rest.
                  </li>
                </ul>
              </section>

              {/* Section 7 */}
              <section id="data-retention" className="scroll-mt-24">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5 mb-3">
                  <UserX className="h-6 w-6 text-blue-600 shrink-0" />
                  <span>7. Data Retention & Account Deletion</span>
                </h2>
                <p className="text-sm text-slate-600 mb-3">
                  You retain complete sovereignty over your data:
                </p>
                <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 space-y-1.5">
                  <li>You may delete individual vault entries or entire categories at any time from your dashboard.</li>
                  <li>You may request complete account deletion. Upon deletion, your user record, cryptographic salts, and all encrypted vault entries are permanently and irreversibly purged from our active databases.</li>
                </ul>
              </section>

              {/* Section 8 */}
              <section id="user-rights" className="scroll-mt-24">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5 mb-3">
                  <FileCheck2 className="h-6 w-6 text-blue-600 shrink-0" />
                  <span>8. Your Privacy Rights (GDPR & CCPA)</span>
                </h2>
                <p className="text-sm text-slate-600 mb-3">
                  Depending on your jurisdiction, you are entitled to specific data protection rights under regulations such as the EU General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-slate-900 block mb-0.5">Right to Access & Portability</strong>
                    <span className="text-slate-600">Export your encrypted or decrypted vault items at any time.</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-slate-900 block mb-0.5">Right to Rectification</strong>
                    <span className="text-slate-600">Update account email or vault data directly from the application.</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-slate-900 block mb-0.5">Right to Erasure (To Be Forgotten)</strong>
                    <span className="text-slate-600">Request permanent deletion of all stored records without delay.</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-slate-900 block mb-0.5">Non-Discrimination</strong>
                    <span className="text-slate-600">We will never discriminate against you for exercising your privacy rights.</span>
                  </div>
                </div>
              </section>

              {/* Section 9 */}
              <section id="security-measures" className="scroll-mt-24">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5 mb-3">
                  <ShieldCheck className="h-6 w-6 text-blue-600 shrink-0" />
                  <span>9. Technical & Organizational Security Measures</span>
                </h2>
                <p className="text-sm text-slate-600 mb-3">
                  In addition to client-side encryption, NoVAult maintains strict operational security:
                </p>
                <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 space-y-1.5">
                  <li>Automatic session timeout lock to protect unattended workstations.</li>
                  <li>Automated clipboard wiping utilities when copying sensitive credentials.</li>
                  <li>Rate-limiting on all authentication and unlock endpoints to mitigate online dictionary attacks.</li>
                </ul>
              </section>

              {/* Section 10 */}
              <section id="changes" className="scroll-mt-24">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5 mb-3">
                  <FileCheck2 className="h-6 w-6 text-blue-600 shrink-0" />
                  <span>10. Changes to This Privacy Policy</span>
                </h2>
                <p className="text-sm text-slate-600">
                  We may periodically update this Privacy Policy to reflect technical or regulatory improvements. Any modifications will be posted on this page with an updated "Effective Date". Continued use of NoVAult signifies your acknowledgment of the updated terms.
                </p>
              </section>

              {/* Section 11 */}
              <section id="contact" className="scroll-mt-24">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5 mb-3">
                  <Mail className="h-6 w-6 text-blue-600 shrink-0" />
                  <span>11. Contact & Security Inquiries</span>
                </h2>
                <p className="text-sm text-slate-600 mb-4">
                  If you have questions, feedback, or security inquiries regarding this policy or our cryptographic design, please reach out directly:
                </p>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card max-w-md">
                  <h4 className="font-semibold text-slate-900 text-sm">NoVAult Security & Privacy Team</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Developer & Maintainer: Md Mizan
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="font-medium text-slate-700">Project Repository:</span>
                    <a
                      href="https://github.com/mizan989/novault"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      <span>github.com/mizan989/novault</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </section>
            </article>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-6 text-slate-500 text-xs mt-auto">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-slate-800">NoVAult</span>
            <span className="text-slate-300">•</span>
            <span>Zero-Knowledge Password Manager</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <Link to="/terms" className="hover:text-blue-600 transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-blue-600 font-semibold">
              Privacy Policy
            </Link>
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
