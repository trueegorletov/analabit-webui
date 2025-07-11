'use client';

import { useCallback, useEffect, useRef } from 'react';

interface UsePaginationObserverOptions extends IntersectionObserverInit {
    enabled?: boolean;
    debounceMs?: number;
}

interface UsePaginationObserverReturn {
    sentinelRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Custom hook for implementing intersection observer-based pagination
 * Triggers onIntersect callback when the sentinel element becomes visible
 */
export function usePaginationObserver(
    onIntersect: () => void,
    options: UsePaginationObserverOptions = {},
): UsePaginationObserverReturn {
    const {
        enabled = true,
        debounceMs = 300,
        rootMargin = '100px',
        threshold = 0.1,
        ...intersectionOptions
    } = options;

    const sentinelRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastIntersectTimeRef = useRef<number>(0);

    // Memoized intersection callback with throttling/debouncing
    const handleIntersection = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [entry] = entries;

            if (!entry.isIntersecting || !enabled) {
                return;
            }

            const now = Date.now();
            const timeSinceLastIntersect = now - lastIntersectTimeRef.current;

            // Prevent rapid successive calls
            if (timeSinceLastIntersect < debounceMs) {
                // Clear existing timeout and set a new one
                if (debounceTimeoutRef.current) {
                    clearTimeout(debounceTimeoutRef.current);
                }

                debounceTimeoutRef.current = setTimeout(() => {
                    lastIntersectTimeRef.current = Date.now();
                    onIntersect();
                }, debounceMs - timeSinceLastIntersect);

                return;
            }

            // Call immediately if enough time has passed
            lastIntersectTimeRef.current = now;
            onIntersect();
        },
        [onIntersect, enabled, debounceMs],
    );

    // Set up intersection observer
    useEffect(() => {
        // Check if IntersectionObserver is supported
        if (typeof IntersectionObserver === 'undefined' || !enabled) {
            return;
        }

        const sentinel = sentinelRef.current;
        if (!sentinel) {
            return;
        }

        // Create observer with provided options
        const observer = new IntersectionObserver(handleIntersection, {
            rootMargin,
            threshold,
            ...intersectionOptions,
        });

        observer.observe(sentinel);
        observerRef.current = observer;

        return () => {
            observer.disconnect();
            observerRef.current = null;

            // Clear any pending debounce timeout
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
                debounceTimeoutRef.current = null;
            }
        };
    }, [handleIntersection, enabled, rootMargin, threshold, intersectionOptions]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, []);

    return {
        sentinelRef,
    };
}
