"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type GalalStoreIntroProps = {
  logo?: string | null;
};

export default function GalalStoreIntro({ logo }: GalalStoreIntroProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let current = 0;

    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 5) + 1;

      if (current >= 100) {
        current = 100;
        clearInterval(interval);

        setTimeout(() => {
          setExiting(true);

          setTimeout(() => {
            setVisible(false);
          }, 1200);
        }, 350);
      }

      setProgress(current);
    }, 35);

    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`galal-intro ${exiting ? "galal-intro--exit" : ""}`}
      aria-hidden="true"
    >
      {/* Left curtain */}
      <div className="galal-intro__curtain galal-intro__curtain--left" />

      {/* Right curtain */}
      <div className="galal-intro__curtain galal-intro__curtain--right" />

      {/* Background glow */}
      <div className="galal-intro__glow galal-intro__glow--one" />
      <div className="galal-intro__glow galal-intro__glow--two" />

      {/* Decorative grid */}
      <div className="galal-intro__grid" />

      {/* Main content */}
      <div className="galal-intro__content">
        {/* Sneaker silhouette */}
        <div className="galal-intro__sneaker">
          <div className="galal-intro__sneaker-shadow" />

          <svg
            viewBox="0 0 600 320"
            className="galal-intro__sneaker-svg"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M72 204
                C108 202 143 190 175 169
                L239 125
                C258 112 280 109 300 118
                L365 148
                C391 160 418 170 447 180
                L510 201
                C539 211 556 230 558 250
                C559 263 549 273 535 275
                H91
                C68 275 52 262 52 241
                C52 220 59 209 72 204Z"
              fill="currentColor"
            />

            <path
              d="M174 169
                L239 125
                C258 112 280 109 300 118
                L365 148
                L336 177
                C311 194 283 203 251 202
                L164 195"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d="M72 236
                C160 245 251 247 344 243
                C425 240 493 238 554 246"
              stroke="var(--intro-accent)"
              strokeWidth="6"
              strokeLinecap="round"
            />

            <path
              d="M238 131
                L259 178
                M272 123
                L292 181
                M306 127
                L324 181"
              stroke="var(--intro-accent)"
              strokeWidth="5"
              strokeLinecap="round"
              opacity=".8"
            />
          </svg>
        </div>

        {/* Logo */}
        <div className="galal-intro__logo">
          {logo ? (
            <Image
              src={logo}
              alt="Galal Store"
              width={220}
              height={80}
              priority
              className="galal-intro__logo-image"
            />
          ) : (
            <div className="galal-intro__brand">
              <span>GALAL</span>
              <small>STORE</small>
            </div>
          )}
        </div>

        {/* Brand line */}
        <div className="galal-intro__tagline">
          <span>STEP INTO</span>
          <strong>GREATNESS</strong>
        </div>

        {/* Loading */}
        <div className="galal-intro__loading">
          <div className="galal-intro__loading-top">
            <span>LOADING EXPERIENCE</span>

            <span className="galal-intro__percentage">{progress}%</span>
          </div>

          <div className="galal-intro__progress">
            <div
              className="galal-intro__progress-bar"
              style={{
                transform: `scaleX(${progress / 100})`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom branding */}
      <div className="galal-intro__bottom">
        <span>GALAL STORE</span>
        <span>EST. 2026</span>
      </div>
    </div>
  );
}
