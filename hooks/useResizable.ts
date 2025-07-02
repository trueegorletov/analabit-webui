import { useEffect, RefObject } from 'react';

interface UseResizableOptions {
  onSizeChange: (height: number) => void;
  minHeight?: number;
  maxHeight?: number;
}

export function useResizable(
  handleRef: RefObject<HTMLElement>,
  { onSizeChange, minHeight = 100, maxHeight }: UseResizableOptions,
) {
  useEffect(() => {
    const el = handleRef.current;
    if (!el) return;

    let startY = 0;
    let startHeight = 0;
    let isDragging = false;

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      const container = el.parentElement;
      if (!container) return;

      isDragging = true;
      startY = e.clientY;
      startHeight = container.offsetHeight;

      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'ns-resize';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaY = e.clientY - startY;
      const newHeight = startHeight + deltaY;
      const maxAllowed = maxHeight || window.innerHeight - 120;
      const finalHeight = Math.max(minHeight, Math.min(newHeight, maxAllowed));

      onSizeChange(finalHeight);
    };

    const handleMouseUp = () => {
      if (!isDragging) return;

      isDragging = false;
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };

    el.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      el.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleRef, onSizeChange, minHeight, maxHeight]);
} 