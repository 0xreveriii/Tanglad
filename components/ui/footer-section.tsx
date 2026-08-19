import { ArrowUp, Plant } from "@phosphor-icons/react/dist/ssr";

const explore = [
  { href: "#product", label: "Product" },
  { href: "#method", label: "Method" },
  { href: "#principles", label: "Principles" },
];

const purpose = [
  { href: "#product", label: "Task weight" },
  { href: "#method", label: "Workload balance" },
  { href: "#principles", label: "Team decision" },
];

export function TangladFooter() {
  return (
    <footer className="tanglad-footer">
      <div className="footer-mosaic" aria-hidden="true">
        {Array.from({ length: 54 }, (_, index) => <i key={index} style={{ opacity: 0.04 + ((index * 13) % 9) * 0.012 }} />)}
      </div>
      <div className="page-frame footer-main">
        <div className="footer-identity">
          <a className="footer-wordmark" href="#top">Tanglad<Plant weight="light" /></a>
          <span className="footer-kicker">Collaborative project tracker</span>
          <p>Measure contribution with context, reveal workload imbalance, and guide fairer team decisions.</p>
        </div>

        <div className="footer-column">
          <h3>Explore</h3>
          <nav aria-label="Footer navigation">
            {explore.map((item) => <a href={item.href} key={item.label}>{item.label}</a>)}
          </nav>
        </div>

        <div className="footer-column">
          <h3>Purpose</h3>
          <nav aria-label="Tanglad purpose">
            {purpose.map((item) => <a href={item.href} key={item.label}>{item.label}</a>)}
          </nav>
        </div>

        <div className="footer-statement">
          <strong>Fair work<br /><span>has weight.</span></strong>
          <span className="footer-plant"><Plant weight="light" /></span>
        </div>
      </div>
      <div className="page-frame footer-bottom">
        <p>Built for fair collaborative work.</p>
        <a href="#top">Back to top <span><ArrowUp weight="light" /></span></a>
      </div>
    </footer>
  );
}
