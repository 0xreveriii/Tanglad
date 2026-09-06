import Link from "next/link";

export const metadata = {
  title: "Cookie Policy | Tanglad",
  description: "Cookie Policy for Tanglad - Collaborative Project Tracker",
};

export default function CookiesPage() {
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
              Cookie Policy
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
                "1. What Are Cookies",
                "2. How We Use Cookies",
                "3. Types of Cookies",
                "4. Third-Party Cookies",
                "5. Your Preferences",
                "6. Cookie Duration",
                "7. Policy Changes",
                "8. Contact"
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
                1. What Are Cookies
              </h2>
              <p style={{ color: "var(--ink-soft)", margin: 0, lineHeight: "1.8" }}>
                Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work more efficiently, enhance user experience, and provide information to website owners.
              </p>
            </section>

            <section id="section-2" style={{ paddingBottom: "32px", borderBottom: "1px solid var(--line)", marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", margin: "0 0 8px", fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                2. How We Use Cookies
              </h2>
              <p style={{ color: "var(--ink-soft)", margin: "0 0 8px", lineHeight: "1.8" }}>
                Tanglad uses cookies for the following purposes:
              </p>
              <ul style={{ color: "var(--ink-soft)", paddingLeft: "24px", lineHeight: "1.8", margin: 0 }}>
                <li><strong>Authentication:</strong> To recognize you when you log in and keep you signed in.</li>
                <li><strong>Preferences:</strong> To remember your settings and preferences (e.g., dark mode, language).</li>
                <li><strong>Performance:</strong> To analyze how users interact with the Service and improve performance.</li>
                <li><strong>Security:</strong> To protect against fraud and unauthorized access.</li>
              </ul>
            </section>

            <section id="section-3" style={{ paddingBottom: "32px", borderBottom: "1px solid var(--line)", marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", margin: "0 0 8px", fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                3. Types of Cookies We Use
              </h2>
              
              <h3 style={{ fontSize: "16px", margin: "16px 0 4px", fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                Essential Cookies
              </h3>
              <p style={{ color: "var(--ink-soft)", margin: "0 0 12px", lineHeight: "1.8" }}>
                These cookies are necessary for the Service to function properly. They enable core functionality such as authentication, security, and session management. You cannot opt out of these cookies as they are required for the Service to work.
              </p>

              <h3 style={{ fontSize: "16px", margin: "16px 0 4px", fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                Preference Cookies
              </h3>
              <p style={{ color: "var(--ink-soft)", margin: "0 0 12px", lineHeight: "1.8" }}>
                These cookies allow us to remember your choices and preferences, such as your preferred language, theme (dark/light mode), and other customizations. This helps us provide a personalized experience.
              </p>

              <h3 style={{ fontSize: "16px", margin: "16px 0 4px", fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                Analytics Cookies
              </h3>
              <p style={{ color: "var(--ink-soft)", margin: 0, lineHeight: "1.8" }}>
                These cookies help us understand how users interact with Tanglad. We use this information to improve the Service, identify popular features, and optimize user experience. We use aggregated data that does not personally identify you.
              </p>
            </section>

            <section id="section-4" style={{ paddingBottom: "32px", borderBottom: "1px solid var(--line)", marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", margin: "0 0 8px", fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                4. Third-Party Cookies
              </h2>
              <p style={{ color: "var(--ink-soft)", margin: 0, lineHeight: "1.8" }}>
                Tanglad does not currently use third-party cookies for advertising or tracking purposes. If we integrate third-party services in the future, we will update this policy accordingly and provide you with choices to control those cookies.
              </p>
            </section>

            <section id="section-5" style={{ paddingBottom: "32px", borderBottom: "1px solid var(--line)", marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", margin: "0 0 8px", fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                5. Your Cookie Preferences
              </h2>
              <p style={{ color: "var(--ink-soft)", margin: "0 0 8px", lineHeight: "1.8" }}>
                You can control and manage your cookie preferences in the following ways:
              </p>
              <ul style={{ color: "var(--ink-soft)", paddingLeft: "24px", lineHeight: "1.8", margin: 0 }}>
                <li><strong>Browser Settings:</strong> Most web browsers allow you to manage cookie settings. You can block or delete cookies by adjusting your browser settings.</li>
                <li><strong>Cookie Banner:</strong> When you first visit Tanglad, you will see a cookie banner that allows you to accept or decline non-essential cookies.</li>
                <li><strong>Preferences Dashboard:</strong> You can manage your cookie preferences at any time through your account settings.</li>
              </ul>
            </section>

            <section id="section-6" style={{ paddingBottom: "32px", borderBottom: "1px solid var(--line)", marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", margin: "0 0 8px", fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                6. Duration of Cookies
              </h2>
              <p style={{ color: "var(--ink-soft)", margin: "0 0 8px", lineHeight: "1.8" }}>
                Cookies on Tanglad are classified as either:
              </p>
              <ul style={{ color: "var(--ink-soft)", paddingLeft: "24px", lineHeight: "1.8", margin: 0 }}>
                <li><strong>Session Cookies:</strong> Temporary cookies that are deleted when you close your browser.</li>
                <li><strong>Persistent Cookies:</strong> Remain on your device for a set period or until you delete them.</li>
              </ul>
            </section>

            <section id="section-7" style={{ paddingBottom: "32px", borderBottom: "1px solid var(--line)", marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", margin: "0 0 8px", fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                7. Changes to This Policy
              </h2>
              <p style={{ color: "var(--ink-soft)", margin: 0, lineHeight: "1.8" }}>
                We may update this Cookie Policy from time to time to reflect changes in technology, legal requirements, or how we operate the Service. We encourage you to review this policy periodically. The "Last updated" date at the top of this page indicates when the policy was last revised.
              </p>
            </section>

            <section id="section-8" style={{ paddingBottom: "32px", borderBottom: "1px solid var(--line)", marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", margin: "0 0 8px", fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                8. Contact Us
              </h2>
              <p style={{ color: "var(--ink-soft)", margin: 0, lineHeight: "1.8" }}>
                If you have any questions about our use of cookies or this Cookie Policy, please contact us at:{" "}
                <a 
                  href="mailto:support@tanglad.com" 
                  style={{ color: "var(--accent)", textDecoration: "underline" }}
                >
                  support@tanglad.com
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