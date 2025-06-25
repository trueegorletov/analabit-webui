import { gsap } from 'gsap'

export type Palette = {
  grad: string
  glow: string
}

export type GlowIntensity = 'normal' | 'flash'

/**
 * Apply a glowing box-shadow animation to any HTMLElement.
 * Existing boxShadow tweens are killed before the new one is started.
 *
 * @param element – Target element that should glow
 * @param palette – Palette object containing a `glow` rgba color
 * @param intensity – 'flash' for strong short glow, 'normal' for gentle looping glow
 */
export function applyGlow (element: HTMLElement | null, palette: Palette, intensity: GlowIntensity = 'normal') {
  if (!element) return

  // Remove any previous glow tweens on this element to avoid stacking
  gsap.killTweensOf(element, 'boxShadow')

  if (intensity === 'flash') {
    // Flash: ~5–10% less intense than previous (was 24px/5px → now 22px/4px)
    gsap.fromTo(element,
      { boxShadow: `0 0 0px 0px ${palette.glow}` },
      {
        boxShadow: `0 0 22px 4px ${palette.glow}, 0 0 9px 2px rgba(255, 255, 255, 0.18)`,
        duration: 0.7,
        ease: 'power2.out'
      }
    )
    return
  }

  // Idle glow: 60-80% less intense than flash, but smoothly animating like tag buttons
  const baseBlur = 8 // 22px * 0.36 ≈ 8
  const maxBlur = 12 // ≈ 55% less than flash peak
  gsap.fromTo(element,
    {
      boxShadow: `0 0 ${baseBlur}px 1px ${palette.glow}, 0 0 4px 0.5px rgba(255, 255, 255, 0.08)`
    },
    {
      boxShadow: `0 0 ${maxBlur}px 2px ${palette.glow}, 0 0 6px 1px rgba(255, 255, 255, 0.1)`,
      duration: gsap.utils.random(6, 10),
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: gsap.utils.random(0, 2)
    }
  )
} 