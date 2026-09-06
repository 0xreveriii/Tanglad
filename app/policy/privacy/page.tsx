import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Tanglad",
  description: "Privacy Policy for Tanglad - Collaborative Project Tracker",
};

export default function PrivacyPage() {
  return (
    <main style={{ 
      background: "var(--page)", 
      color: "var(--ink)",
      minHeight: "100vh",
      paddingTop: "120px",
      paddingBottom: "80px"
    }}>
      <div className="page-frame">
        {/* Header */}
        <Link 
          href="/" 
          style={{ 
            color: "var(--accent)", 
            fontSize: "14px",
            fontWeight: 500,
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            transition: "color 0.2s"
          }}
        >
          ← Back to home
        </Link>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          marginTop: "32px",
          marginBottom: "48px",
          paddingBottom: "32px",
          borderBottom: "2px solid var(--line)"
        }}>
          <div>
            <h1 style={{ 
              fontSize: "clamp(36px, 4vw, 48px)", 
              margin: 0,
              fontWeight: 600,
              letterSpacing: "-0.04em",
              fontFamily: "var(--font-display)",
              color: "var(--ink)"
            }}>
              Privacy Policy
            </h1>
          </div>
          <div style={{ 
            alignSelf: "flex-end",
            textAlign: "right",
            color: "var(--ink-soft)",
            fontSize: "14px"
          }}>
            <p style={{ margin: 0 }}>Effective: August 30, 2026</p>
            <p style={{ margin: "4px 0 0" }}>Last updated: August 31, 2026</p>
          </div>
        </div>

        {/* Content */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "48px",
          maxWidth: "960px"
        }}>
          {/* Left column: Section navigation */}
          <div style={{ position: "sticky", top: "120px", alignSelf: "start" }}>
            <p style={{ 
              fontSize: "12px", 
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--ink-soft)",
              margin: "0 0 16px"
            }}>
              Sections
            </p>
            <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {[
                "1. Information Collected",
                "2. How We Use Data",
                "3. Data Storage",
                "4. Data Retention",
                "5. Information Sharing",
                "6. Your Rights",
                "7. Cookies",
                "8. Children's Privacy",
                "9. Policy Changes",
                "10. Contact"
              ].map((item) => (
                <a 
                  key={item}
                  href={`#section-${item.split(".")[0]}`}
                  style={{
                    fontSize: "13px",
                    color: "var(--ink-soft)",
                    textDecoration: "none",
                    padding: "4px 0",
                    borderBottom: "1px solid transparent",
                    transition: "color 0.2s, border-color 0.2s"
                  }}
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>

          {/* Right column: Content */}
          <div>
            <section id="section-1" style={{ paddingBottom: "32px", borderBottom: "1px solid var(--line)", marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", margin: "0 0 8px", fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                1. Information We Collect
              </h2>
              <p style={{ color: "var(--ink-soft)", margin: "0 0 8px", lineHeight: "1.8" }}>
                We collect information you provide directly when you create an account, use the Service, or communicate with us. This may include:
              </p>
              <ul style={{ color: "var(--ink-soft)", paddingLeft: "24px", lineHeight: "1.8", margin: 0 }}>
                <li><strong>Account Information:</strong> Name, email address, password, and other registration details.</li>
                <li><strong>Project Data:</strong> Tasks, assignments, weights, comments, and other project-related content.</li>
                <li><strong>Usage Information:</strong> How you interact with the Service, including features used and actions taken.</li>
                <li><strong>Communications:</strong> Messages, feedback, and support requests you send to us.</li>
              </ul>
            </section>

            <section id="section-2" style={{ paddingBottom: "32px", borderBottom: "1px solid var(--line)", marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", margin: "0 0 8px", fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                2. How We Use Your Information
              </h2>
              <p style={{ color: "var(--ink-soft)", margin: "0 0 8px", lineHeight: "1.8" }}>
                We use the information we collect to:
              </p>
              <ul style={{ color: "var(--ink-soft)", paddingLeft: "24px", lineHeight: "1.8", margin: 0 }}>
                <li>Provide, maintain, and improve the Service.</li>
                <li>Process transactions and manage your account.</li>
                <li>Analyze task weight and workload distribution.</li>
                <li>Generate recommendations for task balancing.</li>
                <li>Communicate with you about updates, features, and support.</li>
                <li>Monitor and analyze usage trends to improve user experience.</li>
              </ul>
            </section>

            <section id="section-3" style={{ paddingBottom: "32px", borderBottom: "1px solid var(--line)", marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", margin: "0 0 8px", fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                3. Data Storage and Security
              </h2>
              <p style={{ color: "var(--ink-soft)", margin: 0, lineHeight: "1.8" }}>
                We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. Your data is stored on secure servers and we use encryption for data transmission.
              </p>
            </section>

            <section id="section-4" style={{ paddingBottom: "32px", borderBottom: "1px solid var(--line)", marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", margin: "0 0 8px", fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                4. Data Retention
              </h2>
              <p style={{ color: "var(--ink-soft)", margin: 0, lineHeight: "1.8" }}>
                We retain your personal information for as long as your account is active or as needed to provide the Service. If you delete your account, we will delete or anonymize your personal information within a reasonable timeframe, unless we are required to retain it for legal or legitimate business purposes.
              </p>
            </section>

            <section id="section-5" style={{ paddingBottom: "32px", borderBottom: "1px solid var(--line)", marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", margin: "0 0 8px", fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                5. Information Sharing
              </h2>
              <p style={{ color: "var(--ink-soft)", margin: "0 0 8px", lineHeight: "1.8" }}>
                We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
              </p>
              <ul style={{ color: "var(--ink-soft)", paddingLeft: "24px", lineHeight: "1.8", margin: 0 }}>
                <li><strong>With Team Members:</strong> Your project data is visible to other members of your team as necessary for collaboration.</li>
                <li><strong>With Service Providers:</strong> We may share data with trusted third-party service providers who assist us in operating the Service.</li>
                <li><strong>For Legal Reasons:</strong> We may disclose information if required by law or to protect rights, property, or safety.</li>
              </ul>
            </section>

            <section id="section-6" style={{ paddingBottom: "32px", borderBottom: "1px solid var(--line)", marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", margin: "0 0 8px", fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                6. Your Rights and Choices
              </h2>
              <p style={{ color: "var(--ink-soft)", margin: "0 0 8px", lineHeight: "1.8" }}>
                You have the right to:
              </p>
              <ul style={{ color: "var(--ink-soft)", paddingLeft: "24px", lineHeight: "1.8", margin: "0 0 8px" }}>
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you.</li>
                <li><strong>Update:</strong> Correct or update your personal information.</li>
                <li><strong>Delete:</strong> Request deletion of your personal information and account.</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications.</li>
              </ul>
              <p style={{ color: "var(--ink-soft)", margin: 0, lineHeight: "1.8" }}>
                To exercise these rights, please contact us using the information below.
              </p>
            </section>

            <section id="section-7" style={{ paddingBottom: "32px", borderBottom: "1px solid var(--line)", marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", margin: "0 0 8px", fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                7. Cookies and Tracking
              </h2>
              <p style={{ color: "var(--ink-soft)", margin: 0, lineHeight: "1.8" }}>
                We use cookies and similar tracking technologies to enhance your experience on Tanglad. Cookies help us remember your preferences, analyze usage patterns, and improve the Service. For more information, please see our{" "}
                <a 
                  href="/policy/cookies" 
                  style={{ color: "var(--accent)", textDecoration: "underline" }}
                >
                  Cookie Policy
                </a>.
              </p>
            </section>

            <section id="section-8" style={{ paddingBottom: "32px", borderBottom: "1px solid var(--line)", marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", margin: "0 0 8px", fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                8. Children's Privacy
              </h2>
              <p style={{ color: "var(--ink-soft)", margin: 0, lineHeight: "1.8" }}>
                Tanglad is not intended for use by individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete it.
              </p>
            </section>

            <section id="section-9" style={{ paddingBottom: "32px", borderBottom: "1px solid var(--line)", marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", margin: "0 0 8px", fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                9. Changes to This Policy
              </h2>
              <p style={{ color: "var(--ink-soft)", margin: 0, lineHeight: "1.8" }}>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically for any changes.
              </p>
            </section>

            <section id="section-10" style={{ paddingBottom: "32px", borderBottom: "1px solid var(--line)", marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", margin: "0 0 8px", fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                10. Contact Us
              </h2>
              <p style={{ color: "var(--ink-soft)", margin: 0, lineHeight: "1.8" }}>
                If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us at:{" "}
                <a 
                  href="mailto:privacy@tanglad.com" 
                  style={{ color: "var(--accent)", textDecoration: "underline" }}
                >
                  privacy@tanglad.com
                </a>
              </p>
            </section>

            {/* Footer */}
            <div style={{ 
              marginTop: "48px", 
              paddingTop: "24px", 
              borderTop: "2px solid var(--line)",
              color: "var(--ink-soft)",
              fontSize: "14px"
            }}>
              © {new Date().getFullYear()} Tanglad. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}