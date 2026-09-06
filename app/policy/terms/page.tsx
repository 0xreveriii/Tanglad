import Link from "next/link";

export const metadata = {
  title: "Terms of Use | Tanglad",
  description: "Terms of Use for Tanglad - Collaborative Project Tracker",
};

export default function TermsPage() {
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
              Terms of Use
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
          {/* Left column: Section numbers / navigation */}
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
                "1. Acceptance",
                "2. Description",
                "3. User Accounts",
                "4. Responsibilities",
                "5. Intellectual Property",
                "6. Task Weight",
                "7. Liability",
                "8. Termination",
                "9. Changes",
                "10. Governing Law",
                "11. Contact"
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
                1. Acceptance of Terms
              </h2>
              <p style={{ color: "var(--ink-soft)", margin: 0, lineHeight: "1.8" }}>
                By using Tanglad ("the Service"), you agree to these Terms of Use. If you do not agree, please do not use the Service.
              </p>
            </section>

            <section id="section-2" style={{ paddingBottom: "32px", borderBottom: "1px solid var(--line)", marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", margin: "0 0 8px", fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                2. Description of Service
              </h2>
              <p style={{ color: "var(--ink-soft)", margin: 0, lineHeight: "1.8" }}>
                Tanglad is a collaborative project tracker that helps teams measure task weight, analyze workload distribution, and balance responsibilities across team members. The Service provides tools for task tracking, weighted valuation, workload balancing, and data-driven recommendations.
              </p>
            </section>

            <section id="section-3" style={{ paddingBottom: "32px", borderBottom: "1px solid var(--line)", marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", margin: "0 0 8px", fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                3. User Accounts
              </h2>
              <p style={{ color: "var(--ink-soft)", margin: 0, lineHeight: "1.8" }}>
                To access certain features of the Service, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>
            </section>

            <section id="section-4" style={{ paddingBottom: "32px", borderBottom: "1px solid var(--line)", marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", margin: "0 0 8px", fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                4. User Responsibilities
              </h2>
              <p style={{ color: "var(--ink-soft)", margin: 0, lineHeight: "1.8" }}>
                You are solely responsible for all content, data, and information you submit, post, or display through the Service. You agree not to use the Service for any unlawful purpose or in any way that could damage, disable, overburden, or impair the Service.
              </p>
            </section>

            <section id="section-5" style={{ paddingBottom: "32px", borderBottom: "1px solid var(--line)", marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", margin: "0 0 8px", fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                5. Intellectual Property
              </h2>
              <p style={{ color: "var(--ink-soft)", margin: 0, lineHeight: "1.8" }}>
                All content, features, and functionality of Tanglad, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, and software, are owned by the Tanglad team and are protected by Philippine and international intellectual property laws.
              </p>
            </section>

            <section id="section-6" style={{ paddingBottom: "32px", borderBottom: "1px solid var(--line)", marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", margin: "0 0 8px", fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                6. Task Weight and Recommendations
              </h2>
              <p style={{ color: "var(--ink-soft)", margin: 0, lineHeight: "1.8" }}>
                The task weighting and recommendation features of Tanglad are provided as decision-support tools. They are based on the data you provide and are not intended to replace human judgment. The final assignment of tasks and responsibilities remains at the discretion of the team. Tanglad is not responsible for decisions made based on its recommendations.
              </p>
            </section>

            <section id="section-7" style={{ paddingBottom: "32px", borderBottom: "1px solid var(--line)", marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", margin: "0 0 8px", fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                7. Limitation of Liability
              </h2>
              <p style={{ color: "var(--ink-soft)", margin: 0, lineHeight: "1.8" }}>
                Tanglad is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, error-free, or free of viruses or other harmful components. To the fullest extent permitted by law, we disclaim all liability for any damages arising from the use of the Service.
              </p>
            </section>

            <section id="section-8" style={{ paddingBottom: "32px", borderBottom: "1px solid var(--line)", marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", margin: "0 0 8px", fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                8. Termination
              </h2>
              <p style={{ color: "var(--ink-soft)", margin: 0, lineHeight: "1.8" }}>
                We reserve the right to terminate or suspend your account and access to the Service at our sole discretion, without prior notice, for conduct that we believe violates these Terms or is harmful to other users of the Service, us, or third parties.
              </p>
            </section>

            <section id="section-9" style={{ paddingBottom: "32px", borderBottom: "1px solid var(--line)", marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", margin: "0 0 8px", fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                9. Changes to Terms
              </h2>
              <p style={{ color: "var(--ink-soft)", margin: 0, lineHeight: "1.8" }}>
                We reserve the right to update or modify these Terms at any time without prior notice. The updated Terms will be effective immediately upon posting. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
              </p>
            </section>

            <section id="section-10" style={{ paddingBottom: "32px", borderBottom: "1px solid var(--line)", marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", margin: "0 0 8px", fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                10. Governing Law
              </h2>
              <p style={{ color: "var(--ink-soft)", margin: 0, lineHeight: "1.8" }}>
                These Terms shall be governed by and construed in accordance with the laws of the Republic of the Philippines. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of the Philippines.
              </p>
            </section>

            <section id="section-11" style={{ paddingBottom: "32px", borderBottom: "1px solid var(--line)", marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", margin: "0 0 8px", fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                11. Contact Information
              </h2>
              <p style={{ color: "var(--ink-soft)", margin: 0, lineHeight: "1.8" }}>
                For questions about these Terms, please contact us at:{" "}
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