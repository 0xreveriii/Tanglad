"use client";

import { AnimatePresence, motion } from "motion/react";
import { List, Moon, Pause, Plant, Play, Sun, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useStableReducedMotion } from "./motion-primitives";

const links = [
  { href: "#product", label: "Product" },
  { href: "#method", label: "Method" },
  { href: "#principles", label: "Principles" },
];

export function SiteNav() {
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useStableReducedMotion();

  useEffect(() => {
    let nextDark = true;
    let nextMotion: "system" | "full" | "reduced" = "system";

    try {
      const storedTheme = localStorage.getItem("tanglad-theme");
      const storedMotion = localStorage.getItem("tanglad-motion");
      nextDark = storedTheme ? storedTheme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
      nextMotion = storedMotion === "full" || storedMotion === "reduced" ? storedMotion : "system";
    } catch {
      nextDark = true;
    }

    document.documentElement.dataset.theme = nextDark ? "dark" : "light";
    document.documentElement.dataset.motion = nextMotion;
    document.documentElement.style.colorScheme = nextDark ? "dark" : "light";
    setDark(nextDark);
    window.dispatchEvent(new Event("tanglad-motion-change"));
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    document.documentElement.style.colorScheme = next ? "dark" : "light";
    localStorage.setItem("tanglad-theme", next ? "dark" : "light");
  };

  const toggleMotion = () => {
    const next = reduceMotion ? "full" : "reduced";
    document.documentElement.dataset.motion = next;
    localStorage.setItem("tanglad-motion", next);
    window.dispatchEvent(new Event("tanglad-motion-change"));
  };

  return (
    <>
      <motion.header
        className="site-nav"
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <a className="brand" href="#top" aria-label="Tanglad home">
          <span className="brand-mark" aria-hidden="true"><Plant weight="light" /></span>
          <span>Tanglad</span>
        </a>

        <nav className="desktop-links" aria-label="Main navigation">
          {links.map((link) => (
            <a key={link.href} href={link.href}>{link.label}</a>
          ))}
        </nav>

        <div className="nav-actions">
          <button className="icon-button motion-button" onClick={toggleMotion} aria-label={reduceMotion ? "Enable page motion" : "Reduce page motion"} title={reduceMotion ? "Enable motion" : "Reduce motion"}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={reduceMotion ? "play" : "pause"}
                initial={{ opacity: 0, scale: 0.78 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.78 }}
                transition={{ duration: 0.18 }}
              >
                {reduceMotion ? <Play weight="light" /> : <Pause weight="light" />}
              </motion.span>
            </AnimatePresence>
          </button>
          <button className="icon-button" onClick={toggleTheme} aria-label={dark ? "Use light mode" : "Use dark mode"}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={dark ? "sun" : "moon"}
                initial={{ opacity: 0, rotate: -25, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 25, scale: 0.8 }}
                transition={{ duration: 0.18 }}
              >
                {dark ? <Sun weight="light" /> : <Moon weight="light" />}
              </motion.span>
            </AnimatePresence>
          </button>
          <button className="icon-button menu-button" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle navigation" aria-expanded={menuOpen}>
            {menuOpen ? <X weight="light" /> : <List weight="light" />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, scale: 0.96, y: -18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav aria-label="Mobile navigation">
              {links.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + index * 0.06, duration: 0.45 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
