import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  AlertTriangle,
  KeyRound,
  Scale,
  FileText,
  Ban,
  RefreshCw,
  HelpCircle,
  ArrowLeft,
  Printer,
  ExternalLink,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function TermsAndConditions() {
  const [activeSection, setActiveSection] = useState<string>("agreement");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    { id: "agreement", title: "1. Acceptance of Terms" },
    { id: "zero-knowledge-disclaimer", title: "2. Zero-Knowledge & Master Password Responsibility" },
    { id: "account-eligibility", title: "3. Account Eligibility & Access" },
    { id: "acceptable-use", title: "4. Acceptable Use Policy" },
    { id: "intellectual-property", title: "5. Intellectual Property & Open Source" },
    { id: "service-availability", title: "6. Service Availability & Modifications" },
    { id: "disclaimer-warranties", title: "7. Disclaimer of Warranties" },
    { id: "limitation-liability", title: "8. Limitation of Liability" },
    { id: "indemnification", title: "9. Indemnification" },
    { id: "termination", title: "10. Termination & Data Deletion" },
    { id: "governing-law", title: "11. Governing Law & Dispute Resolution" },
    { id: "contact", title: "12. Contact & Notices" },
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
              aria-label="Print Terms"
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
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold text-indigo-700 mb-3">
              <Scale className="h-3.5 w-3.5" />
              <span>Terms of Service</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Terms & Conditions
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
              Please read these Terms and Conditions carefully before using NoVAult. These terms govern your access to and use of NoVAult's zero-knowledge password management and encrypted digital vault services.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 border-b border-slate-200 pb-6">
              <span><strong>Effective Date:</strong> August 20, 2026</span>
              <span>•</span>
              <span><strong>Last Revised:</strong> August 2026</span>
              <span>•</span>
              <span><strong>Version:</strong> 1.0</span>
            </div>
          </div>

          {/* Critical Master Password Notice Callout */}
          <div className="mb-10 rounded-2xl border border-amber-200 bg-amber-50/90 p-5 sm:p-6 shadow-subtle">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-600 text-white shadow-sm">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                <h3 className="font-heading text-base font-bold text-amber-950 mb-1">
                  CRITICAL NOTICE: Zero-Knowledge Master Password Architecture
                </h3>
                <p className="mb-2">
                  NoVAult operates on a strict <strong>Zero-Knowledge security architecture</strong>. Your Master Password is known only to you and is never stored in unhashed form on our servers.
                </p>
                <p className="font-semibold text-amber-900">
                  ⚠️ IF YOU LOSE YOUR MASTER PASSWORD, NOBODY AT NOVAULT CAN RECOVER, RESET, OR DECRYPT YOUR VAULT DATA. ALL ENCRYPTED RECORDS WILL BE PERMANENTLY UNRECOVERABLE.
                </p>
              </div>
            </div>
          </div>

          {/* Terms Body + Sticky Navigation Layout */}
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
                      Need clarity on legal agreements or terms?
                    </p>
                    <Link
                      to="/privacy"
                      className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                    >
                      <span>Read Privacy Policy</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </aside>

            {/* Terms Sections */}
            <article className="lg:col-span-8 space-y-12 text-slate-700 leading-relaxed">
              {/* Section 1 */}
              <section id="agreement" className="scroll-mt-24">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5 mb-3">
                  <FileText className="h-6 w-6 text-blue-600 shrink-0" />
                  <span>1. Acceptance of Terms</span>
                </h2>
                <p className="text-sm text-slate-600 mb-3">
                  By accessing, creating an account, or otherwise using the NoVAult platform (novault.vercel.app or associated web applications and APIs), you signify your agreement to be legally bound by these Terms and Conditions and our <Link to="/privacy" className="text-blue-600 underline font-medium">Privacy Policy</Link>.
                </p>
                <p className="text-sm text-slate-600">
                  If you do not agree to all terms and conditions stated herein, you must immediately discontinue use of the platform and delete your account.
                </p>
              </section>

              {/* Section 2 */}
              <section id="zero-knowledge-disclaimer" className="scroll-mt-24">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5 mb-3">
                  <KeyRound className="h-6 w-6 text-blue-600 shrink-0" />
                  <span>2. Zero-Knowledge & Master Password Responsibility</span>
                </h2>
                <p className="text-sm text-slate-600 mb-3">
                  NoVAult utilizes cryptographic primitives including <strong>Argon2id</strong> and <strong>AES-256-GCM</strong>. By design:
                </p>
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="p-4 bg-white rounded-xl border border-slate-200">
                    <strong className="text-slate-900 block mb-1">Sole Custody:</strong>
                    <span className="text-slate-600">
                      You are exclusively responsible for creating a strong Master Password and maintaining its confidentiality.
                    </span>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-slate-200">
                    <strong className="text-slate-900 block mb-1">No Password Reset Mechanism:</strong>
                    <span className="text-slate-600">
                      NoVAult does not hold decryption keys or plaintext Master Passwords. We are technically incapable of resetting your Master Password or retrieving your data if you forget it.
                    </span>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-slate-200">
                    <strong className="text-slate-900 block mb-1">Device Security:</strong>
                    <span className="text-slate-600">
                      You are responsible for ensuring that the devices used to access NoVAult are free from keyloggers, malware, or unauthorized physical access.
                    </span>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section id="account-eligibility" className="scroll-mt-24">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5 mb-3">
                  <CheckCircle2 className="h-6 w-6 text-blue-600 shrink-0" />
                  <span>3. Account Eligibility & Access</span>
                </h2>
                <p className="text-sm text-slate-600 mb-3">
                  You must be at least 13 years old (or the applicable age of digital consent in your jurisdiction) to register an account with NoVAult. When registering, you agree to:
                </p>
                <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 space-y-1.5">
                  <li>Provide a valid, accessible email address or authenticate through a verified Google account.</li>
                  <li>Maintain accurate account contact details for security and OTP dispatch.</li>
                  <li>Notify us immediately if you suspect unauthorized access to your account credentials.</li>
                </ul>
              </section>

              {/* Section 4 */}
              <section id="acceptable-use" className="scroll-mt-24">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5 mb-3">
                  <Ban className="h-6 w-6 text-blue-600 shrink-0" />
                  <span>4. Acceptable Use Policy</span>
                </h2>
                <p className="text-sm text-slate-600 mb-3">
                  You agree to use NoVAult solely for lawful personal and organizational credential storage. You explicitly agree NOT to:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-slate-900 block mb-0.5">Denial of Service</strong>
                    <span className="text-slate-600">Interfere with server infrastructure, conduct DDoS attacks, or abuse API rate limits.</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-slate-900 block mb-0.5">Unauthorized Probing</strong>
                    <span className="text-slate-600">Attempt to exploit, scan, or probe vulnerabilities outside of authorized bug bounty scopes.</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-slate-900 block mb-0.5">Illicit Payloads</strong>
                    <span className="text-slate-600">Store or transmit materials violating applicable regional or international laws.</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-slate-900 block mb-0.5">Account Impersonation</strong>
                    <span className="text-slate-600">Impersonate any individual, entity, or misrepresent affiliation with NoVAult.</span>
                  </div>
                </div>
              </section>

              {/* Section 5 */}
              <section id="intellectual-property" className="scroll-mt-24">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5 mb-3">
                  <ShieldCheck className="h-6 w-6 text-blue-600 shrink-0" />
                  <span>5. Intellectual Property & Open Source</span>
                </h2>
                <p className="text-sm text-slate-600 mb-3">
                  The NoVAult platform architecture, user interfaces, documentation, and codebase are created by Md Mizan. Where portions of NoVAult are released under open-source licenses (such as MIT), the provisions of that license govern your use of the source code.
                </p>
                <p className="text-sm text-slate-600">
                  Your encrypted vault entries, private notes, and custom items remain solely your property. We claim no ownership, title, or interest over user data.
                </p>
              </section>

              {/* Section 6 */}
              <section id="service-availability" className="scroll-mt-24">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5 mb-3">
                  <RefreshCw className="h-6 w-6 text-blue-600 shrink-0" />
                  <span>6. Service Availability & Modifications</span>
                </h2>
                <p className="text-sm text-slate-600 mb-3">
                  While we strive for high uptime and continuous reliability:
                </p>
                <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 space-y-1.5">
                  <li>NoVAult is provided on an "as is" and "as available" basis.</li>
                  <li>We may update, alter, or temporarily suspend features for scheduled maintenance or security enhancements.</li>
                  <li>We recommend maintaining secure, offline backups of your mission-critical credentials.</li>
                </ul>
              </section>

              {/* Section 7 */}
              <section id="disclaimer-warranties" className="scroll-mt-24">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5 mb-3">
                  <Scale className="h-6 w-6 text-blue-600 shrink-0" />
                  <span>7. Disclaimer of Warranties</span>
                </h2>
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-700 leading-relaxed uppercase">
                  TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, NOVAULT DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT GUARANTEE THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR ENTIRELY IMMUNE FROM THIRD-PARTY ATTACKS.
                </div>
              </section>

              {/* Section 8 */}
              <section id="limitation-liability" className="scroll-mt-24">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5 mb-3">
                  <AlertTriangle className="h-6 w-6 text-blue-600 shrink-0" />
                  <span>8. Limitation of Liability</span>
                </h2>
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-700 leading-relaxed uppercase">
                  UNDER NO CIRCUMSTANCES SHALL NOVAULT, ITS DEVELOPERS, OR CONTRIBUTORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF DATA, REPUTATION, PROFITS, OR ACCESS RESULTING FROM FORGOTTEN MASTER PASSWORDS, CLIENT MALWARE, OR THIRD-PARTY OUTAGES.
                </div>
              </section>

              {/* Section 9 */}
              <section id="indemnification" className="scroll-mt-24">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5 mb-3">
                  <Lock className="h-6 w-6 text-blue-600 shrink-0" />
                  <span>9. Indemnification</span>
                </h2>
                <p className="text-sm text-slate-600">
                  You agree to defend, indemnify, and hold harmless NoVAult and its maintainers from and against any claims, damages, liabilities, and expenses arising out of your violation of these Terms or misuse of the platform.
                </p>
              </section>

              {/* Section 10 */}
              <section id="termination" className="scroll-mt-24">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5 mb-3">
                  <Ban className="h-6 w-6 text-blue-600 shrink-0" />
                  <span>10. Termination & Account Deletion</span>
                </h2>
                <p className="text-sm text-slate-600 mb-3">
                  You may terminate your account at any time via your dashboard settings or by requesting account erasure.
                </p>
                <p className="text-sm text-slate-600">
                  We reserve the right to suspend or terminate accounts that violate our Acceptable Use Policy, engage in fraud, or abuse our infrastructure.
                </p>
              </section>

              {/* Section 11 */}
              <section id="governing-law" className="scroll-mt-24">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5 mb-3">
                  <Scale className="h-6 w-6 text-blue-600 shrink-0" />
                  <span>11. Governing Law & Dispute Resolution</span>
                </h2>
                <p className="text-sm text-slate-600">
                  These terms shall be governed by and construed in accordance with applicable laws, without regard to its conflict of law principles. Any dispute arising under these Terms shall be resolved primarily through good-faith informal consultation.
                </p>
              </section>

              {/* Section 12 */}
              <section id="contact" className="scroll-mt-24">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5 mb-3">
                  <HelpCircle className="h-6 w-6 text-blue-600 shrink-0" />
                  <span>12. Contact & Legal Notices</span>
                </h2>
                <p className="text-sm text-slate-600 mb-4">
                  For legal inquiries, questions about these Terms, or licensing information, please contact:
                </p>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card max-w-md">
                  <h4 className="font-semibold text-slate-900 text-sm">NoVAult Legal & Compliance</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Project Creator: Md Mizan
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="font-medium text-slate-700">Open Source Repository:</span>
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
            <span>Zero-Knowledge Digital Vault</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <Link to="/privacy" className="hover:text-blue-600 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-blue-600 font-semibold">
              Terms of Service
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
