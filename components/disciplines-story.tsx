"use client";

import { CirclesFour, Code, Flask, GraduationCap, PenNib, UsersThree } from "@phosphor-icons/react";
import { Reveal } from "./motion-primitives";

const disciplines = [
  { name: "Developers", icon: Code },
  { name: "Researchers", icon: Flask },
  { name: "Designers", icon: CirclesFour },
  { name: "Writers", icon: PenNib },
  { name: "Students", icon: GraduationCap },
  { name: "Team leads", icon: UsersThree },
];

export function DisciplinesStory() {
  return (
    <section className="disciplines-story">
      <div className="disciplines-sticky page-frame">
        <Reveal className="disciplines-copy">
          <h2>One system.<br />Every discipline.</h2>
          <p>Technical and non-technical contributions belong in the same conversation. Tanglad values both without forcing teams into role-specific workflows.</p>
        </Reveal>

        <Reveal className="discipline-field" delay={0.08}>
          <div className="discipline-ring ring-outer" />
          <div className="discipline-ring ring-inner" />
          <div className="discipline-core">
            <span>Role-agnostic</span><strong>by design</strong>
          </div>
          <div className="discipline-chips">
            {disciplines.map((discipline, index) => {
              const Icon = discipline.icon;
              return (
                <div className={"discipline-chip chip-" + (index + 1)} key={discipline.name}>
                  <Icon weight="light" />
                  <span>{discipline.name}</span>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
      <span className="section-dissolve" aria-hidden="true" />
    </section>
  );
}
