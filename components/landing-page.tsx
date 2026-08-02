import { ClosingExperience } from "./closing-experience";
import { DisciplinesStory } from "./disciplines-story";
import { EffortComparison } from "./effort-comparison";
import { GuidanceExperience } from "./guidance-experience";
import { HeroExperience } from "./hero-experience";
import { Reveal, ScrollSection } from "./motion-primitives";
import { SiteNav } from "./site-nav";
import { WeightStory } from "./weight-story";
import { TangladFooter } from "./ui/footer-section";

const factors = [
  { name: "Complexity", detail: "How difficult is the work?", span: "factor-wide" },
  { name: "Time demand", detail: "What does it realistically require?", span: "" },
  { name: "Skill demand", detail: "What expertise does it call for?", span: "" },
  { name: "Project impact", detail: "How much does the outcome affect?", span: "factor-wide factor-accent" },
];

export function LandingPage() {
  return (
    <>
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <main id="main-content">
      <SiteNav />
      <HeroExperience />

      <EffortComparison />

      <ScrollSection className="factors-section">
        <div className="page-frame">
          <Reveal className="section-heading">
            <h2>More context. A truer measure.</h2>
            <p>Tanglad turns the shape of a task into a shared weight that technical and non-technical teams can understand.</p>
          </Reveal>
          <div className="factor-grid">
            {factors.map((factor, index) => (
              <Reveal className={`factor-shell ${factor.span}`} delay={index * 0.06} key={factor.name}>
                <div className="factor-card">
                  <span className="factor-index">0{index + 1}</span>
                  <div>
                    <h3>{factor.name}</h3>
                    <p>{factor.detail}</p>
                  </div>
                  <span className="factor-stem" aria-hidden="true" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </ScrollSection>

      <WeightStory />

      <DisciplinesStory />

      <GuidanceExperience />

      <ScrollSection className="outcome-section">
        <div className="page-frame outcome-layout">
          <Reveal className="outcome-intro">
            <h2>Built for the work teams actually do.</h2>
            <p>Every completion adds context to a clearer picture of contribution.</p>
            <div className="outcome-signal" aria-hidden="true">
              <span className="outcome-signal-label">Contribution signal</span>
              <div className="outcome-signal-bars">
                {Array.from({ length: 12 }, (_, index) => <i key={index} />)}
              </div>
              <div className="outcome-signal-key">
                <span>Completed</span>
                <strong>Work carried</strong>
              </div>
            </div>
          </Reveal>
          <div className="outcome-list">
            <Reveal className="outcome-item" delay={0.05}>
              <strong>See contribution clearly.</strong>
              <p>Compare cumulative task weight instead of simple completion counts.</p>
            </Reveal>
            <Reveal className="outcome-item" delay={0.1}>
              <strong>Catch imbalance earlier.</strong>
              <p>Identify overload and underuse before they become frustration or burnout.</p>
            </Reveal>
            <Reveal className="outcome-item" delay={0.15}>
              <strong>Discuss work with evidence.</strong>
              <p>Give teams a clearer basis for assignment decisions and contribution reviews.</p>
            </Reveal>
          </div>
        </div>
      </ScrollSection>

      <ClosingExperience />

      <TangladFooter />
    </main>
    </>
  );
}
