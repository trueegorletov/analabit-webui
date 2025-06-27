import { gsap } from 'gsap';

export type Palette = {
  grad: string;
  glow: string;
};

/**
 * Create a short, bright flash glow animation.
 * Returns the timeline so callers can compose / kill it later.
 */
export function flashGlow(element: HTMLElement, palette: Palette) {
  const tl = gsap.timeline();
  // From 0 to flash peak (~23px blur, ~4.5px spread)
  tl.fromTo(
    element,
    { boxShadow: `0 0 0px 0px ${palette.glow}` },
    {
      boxShadow: `0 0 23px 4.5px ${palette.glow}, 0 0 9px 2px rgba(255,255,255,0.18)`,
      duration: 0.7,
      ease: 'power2.out',
    },
  );
  // Optional tiny hold to let the peak register visually
  tl.to(element, { duration: 0.3 });
  return tl;
}

/**
 * Infinite gentle breathing glow (idle state).
 * The timeline yoyo's forever between low- and high-intensity values.
 */
export function idleGlow(
  element: HTMLElement,
  palette: Palette,
  startBlur = 9,
) {
  const minBlur = 9;
  const maxBlur = 14;
  // Constrain incoming startBlur to our min/max range
  const fromBlur = Math.min(Math.max(startBlur, minBlur), maxBlur);

  const buildShadow = (blur: number, spread: number) =>
    `0 0 ${blur}px ${spread}px ${palette.glow}, 0 0 6px 1.5px rgba(255,255,255,0.12)`;

  return gsap.fromTo(
    element,
    {
      boxShadow: buildShadow(fromBlur, 2.5),
    },
    {
      boxShadow: buildShadow(maxBlur, 3),
      duration: gsap.utils.random(8, 12),
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      yoyoEase: true,
    },
  );
}

/**
 * Build a single continuous timeline that
 *   1. flashes to peak
 *   2. eases down to idle-max
 *   3. starts an infinite yoyo between idleMin and idleMax
 * Keeping everything in one timeline avoids property re-initialisation
 * between tweens, eliminating residual jumps.
 */
export function createGlowTimeline(element: HTMLElement, palette: Palette) {
  gsap.killTweensOf(element, 'boxShadow');

  const flashShadow = `0 0 23px 4.5px ${palette.glow}, 0 0 9px 2px rgba(255,255,255,0.18)`;
  const idleMaxShadow = `0 0 14px 3px ${palette.glow}, 0 0 6px 1.5px rgba(255,255,255,0.12)`;
  const idleMinShadow = `0 0 9px 2px ${palette.glow}, 0 0 4px 0.8px rgba(255,255,255,0.08)`;

  const tl = gsap.timeline({ id: '__glowTimeline' });
  tl.fromTo(
    element,
    { boxShadow: '0 0 0px 0px transparent' },
    { boxShadow: flashShadow, duration: 0.7, ease: 'power2.out' },
  );
  // Gentle hold at peak for visual emphasis
  tl.to(element, { duration: 0.25 });
  // Ease down to the idle-max value
  tl.to(element, { boxShadow: idleMaxShadow, duration: 1, ease: 'sine.inOut' });
  // Begin breathing loop directly on the same property
  tl.to(element, {
    boxShadow: idleMinShadow,
    duration: gsap.utils.random(8, 12),
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    yoyoEase: true,
  });

  return tl;
}

// Re-export under previous name for ease of migration
export const flashThenIdle = createGlowTimeline;
