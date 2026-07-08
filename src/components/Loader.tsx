"use client";

/**
 * Site loader — a precast panel being craned onto a stack, with a mono
 * progress counter. The percentage is tied to real readiness signals
 * (webfonts + WebGL context) rather than a fake timer, with an ambient
 * drift so the counter always moves, and a hard 4.5 s ceiling so it can
 * never strand the visitor. Exits with a panel-lift wipe.
 *
 * Respects prefers-reduced-motion: static mark, quick fade, no crane loop.
 */

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useScrollPhases } from "@/lib/useScrollPhases";

const MIN_SHOW_MS = 1400; // long enough to register, short enough to respect
const MAX_WAIT_MS = 6000; // room for shader warm-up, but never hold the page hostage

export function Loader() {
  const [gone, setGone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Freeze the page behind the loader.
    document.documentElement.classList.add("is-loading");
    const unlock = () => document.documentElement.classList.remove("is-loading");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const state = { v: 0 };
    let exited = false;
    let finished = false;
    let watchdog: ReturnType<typeof setTimeout> | undefined;

    const render = () => {
      if (counterRef.current)
        counterRef.current.textContent = String(Math.round(state.v)).padStart(2, "0");
      if (barRef.current) barRef.current.style.transform = `scaleX(${state.v / 100})`;
    };

    // The single, unconditional end state: kill anything still animating,
    // unlock scroll, hand the render loop back to the hero, unmount. Every
    // exit path funnels here, and the watchdog can always force it.
    const complete = () => {
      if (finished) return;
      finished = true;
      exited = true;
      clearTimeout(watchdog);
      gsap.killTweensOf([state, root, innerRef.current]);
      unlock();
      useScrollPhases.getState().setLoaderDone(true);
      setGone(true);
    };

    // Hidden tabs get no rAF, so GSAP can't run — if the page was opened in
    // a background tab, complete the load silently and skip the choreography.
    const instantExit = () => {
      if (exited) return;
      state.v = 100;
      render();
      complete();
    };

    const exit = () => {
      if (exited) return;
      if (document.hidden) return instantExit();
      exited = true;
      if (reduced) {
        gsap.to(root, {
          autoAlpha: 0,
          duration: 0.35,
          ease: "power1.out",
          onComplete: complete,
        });
        return;
      }
      // Panel-lift wipe: content settles out, then the whole sheet cranes up.
      const tl = gsap.timeline({ onComplete: complete });
      tl.to(innerRef.current, { autoAlpha: 0, y: -26, duration: 0.45, ease: "power2.in" });
      tl.to(root, { yPercent: -100, duration: 0.85, ease: "power3.inOut" }, "-=0.08");
    };

    if (reduced) {
      state.v = 100;
      render();
      const t = setTimeout(exit, 500);
      watchdog = setTimeout(complete, 2500); // fade stalled? remove anyway
      return () => {
        clearTimeout(t);
        clearTimeout(watchdog);
        unlock();
      };
    }

    // Ambient drift keeps the counter honest-feeling while signals arrive.
    const drift = gsap.to(state, {
      v: 84,
      duration: 2.4,
      ease: "power2.out",
      onUpdate: render,
    });

    // Real readiness: webfonts + a warmed 3D pipeline + minimum display
    // time, capped by MAX_WAIT so a slow GPU never blocks entry.
    const started = performance.now();
    const finish = () => {
      drift.kill();
      if (document.hidden) return instantExit();
      // Watchdog: from the moment we're ready, the loader has this long to
      // choreograph itself off screen — after that it is removed no matter
      // what stalled (setTimeout survives rAF starvation; GSAP doesn't).
      watchdog = setTimeout(complete, 4500);
      const wait = Math.max(0, MIN_SHOW_MS - (performance.now() - started));
      gsap.delayedCall(wait / 1000, () => {
        gsap.to(state, {
          v: 100,
          duration: 0.5,
          ease: "power2.inOut",
          onUpdate: render,
          onComplete: exit,
        });
      });
    };

    const sceneReady = new Promise<void>((resolve) => {
      if (useScrollPhases.getState().sceneReady) return resolve();
      const unsub = useScrollPhases.subscribe((s) => {
        if (s.sceneReady) {
          unsub();
          resolve();
        }
      });
    });
    const cap = new Promise<void>((r) => setTimeout(r, MAX_WAIT_MS));

    let cancelled = false;
    Promise.race([Promise.all([document.fonts.ready, sceneReady]), cap]).then(() => {
      if (!cancelled) finish();
    });

    return () => {
      cancelled = true;
      clearTimeout(watchdog);
      drift.kill();
      unlock();
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={rootRef} className="site-loader" role="status" aria-label="Loading Bhaarat Precast">
      <div className="site-loader-grid" aria-hidden />
      <div ref={innerRef} className="site-loader-inner">
        {/* Tower crane erecting a precast building, one panel per trip:
            the trolley runs out along the jib, the cable lowers the panel
            onto the stack, releases, retracts and returns for the next. */}
        <svg
          className="loader-mark"
          viewBox="0 0 260 170"
          fill="none"
          aria-hidden
          role="presentation"
        >
          {/* site */}
          <path className="cl-ground" d="M8 152 H252" />
          <rect className="cl-pad" x="164" y="149" width="48" height="3.5" rx="1" />

          {/* tower crane */}
          <g className="cl-crane">
            <rect className="cl-mast" x="44" y="30" width="10" height="118" />
            <path
              className="cl-brace"
              d="M44 148 L54 134 L44 120 L54 106 L44 92 L54 78 L44 64 L54 50 L44 36"
            />
            <rect className="cl-base" x="36" y="148" width="26" height="5" rx="1" />
            <rect className="cl-jib" x="38" y="26" width="182" height="4.5" rx="1" />
            <rect className="cl-jib" x="14" y="26" width="24" height="4.5" rx="1" />
            <rect className="cl-weight" x="15" y="32" width="13" height="11" rx="1" />
            <path className="cl-tie" d="M49 12 L21 26 M49 12 L130 26 M49 12 L216 26" />
            <path className="cl-cap" d="M44 30 L49 12 L54 30" />
            <circle className="cl-beacon" cx="49" cy="9" r="2.2" />
          </g>

          {/* carrier: trolley + cable + hook + slung panel (X follows trolley) */}
          <g className="cl-carrier">
            <rect className="cl-trolley" x="-7" y="30.5" width="14" height="7" rx="1.5" />
            <rect className="cl-cable" x="-0.8" y="37" width="1.6" height="10" />
            <rect className="cl-hook" x="-2.5" y="46.5" width="5" height="3.5" rx="0.8" />
            <g className="cl-lift">
              <path className="cl-sling" d="M0 49 L-13 55 M0 49 L13 55" />
              <rect className="cl-carry-panel" x="-16" y="55" width="32" height="11" rx="1.5" />
            </g>
          </g>

          {/* the building, assembled panel by panel */}
          <rect className="cl-placed cl-placed-1" x="171" y="138" width="34" height="11" rx="1.5" />
          <rect className="cl-placed cl-placed-2" x="171" y="125" width="34" height="11" rx="1.5" />
          <rect className="cl-placed cl-placed-3" x="171" y="112" width="34" height="11" rx="1.5" />
        </svg>

        <p className="loader-wordmark">
          Bhaarat<span>Precast</span>
        </p>
        <p className="loader-eyebrow">Precast Concrete · Preparing the site</p>

        <div className="loader-progress" aria-hidden>
          <span className="loader-track">
            <span ref={barRef} className="loader-fill" />
          </span>
          <span className="loader-count">
            <span ref={counterRef}>00</span>
            <span className="loader-pct">%</span>
          </span>
        </div>
      </div>
    </div>
  );
}
