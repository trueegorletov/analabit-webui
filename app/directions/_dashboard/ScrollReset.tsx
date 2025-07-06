'use client';

import { useEffect } from 'react';

/**
 * Component that ensures the page starts at the top and disables browser scroll restoration
 * This fixes the issue where the directions page opens scrolled to the same position as the main page
 */
export default function ScrollReset() {
    useEffect(() => {
        // Scroll to top immediately
        window.scrollTo(0, 0);

        // Disable browser scroll restoration to prevent interference with Next.js navigation
        if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        // Also force scroll to top after a brief delay in case of layout shifts
        const timeoutId = setTimeout(() => {
            window.scrollTo(0, 0);
        }, 50);

        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

    return null; // This component doesn't render anything
}
