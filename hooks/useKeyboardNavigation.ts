import { useCallback } from 'react';

/**
 * Custom hook for keyboard navigation support
 * Provides consistent keyboard event handling for interactive elements
 */

export interface UseKeyboardNavigationProps {
  onActivate: () => void;
  disabled?: boolean;
}

export function useKeyboardNavigation({ onActivate, disabled = false }: UseKeyboardNavigationProps) {
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (disabled) return;
    
    // Handle Enter and Space key activation
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onActivate();
    }
  }, [onActivate, disabled]);

  const handleClick = useCallback(() => {
    if (disabled) return;
    onActivate();
  }, [onActivate, disabled]);

  return {
    onKeyDown: handleKeyDown,
    onClick: handleClick,
    tabIndex: disabled ? -1 : 0,
    'aria-disabled': disabled,
  };
}

/**
 * Hook for focus management in lists and grids
 * Provides arrow key navigation for collections of items
 */
export interface UseFocusNavigationProps {
  itemCount: number;
  currentIndex: number;
  onIndexChange: (index: number) => void;
  orientation?: 'horizontal' | 'vertical' | 'grid';
  gridColumns?: number;
  loop?: boolean;
}

export function useFocusNavigation({
  itemCount,
  currentIndex,
  onIndexChange,
  orientation = 'vertical',
  gridColumns = 1,
  loop = true,
}: UseFocusNavigationProps) {
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    let newIndex = currentIndex;
    
    switch (event.key) {
      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'grid') {
          event.preventDefault();
          if (orientation === 'grid') {
            newIndex = Math.min(currentIndex + gridColumns, itemCount - 1);
          } else {
            newIndex = loop 
              ? (currentIndex + 1) % itemCount
              : Math.min(currentIndex + 1, itemCount - 1);
          }
        }
        break;
        
      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'grid') {
          event.preventDefault();
          if (orientation === 'grid') {
            newIndex = Math.max(currentIndex - gridColumns, 0);
          } else {
            newIndex = loop 
              ? (currentIndex - 1 + itemCount) % itemCount
              : Math.max(currentIndex - 1, 0);
          }
        }
        break;
        
      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'grid') {
          event.preventDefault();
          newIndex = loop 
            ? (currentIndex + 1) % itemCount
            : Math.min(currentIndex + 1, itemCount - 1);
        }
        break;
        
      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'grid') {
          event.preventDefault();
          newIndex = loop 
            ? (currentIndex - 1 + itemCount) % itemCount
            : Math.max(currentIndex - 1, 0);
        }
        break;
        
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
        
      case 'End':
        event.preventDefault();
        newIndex = itemCount - 1;
        break;
        
      default:
        return;
    }
    
    if (newIndex !== currentIndex) {
      onIndexChange(newIndex);
    }
  }, [currentIndex, itemCount, onIndexChange, orientation, gridColumns, loop]);

  return {
    onKeyDown: handleKeyDown,
  };
}

/**
 * Hook for escape key handling (modals, dropdowns, etc.)
 */
export function useEscapeKey(onEscape: () => void, enabled = true) {
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (enabled && event.key === 'Escape') {
      event.preventDefault();
      onEscape();
    }
  }, [onEscape, enabled]);

  return {
    onKeyDown: handleKeyDown,
  };
}

/**
 * Hook for managing focus trapping within a container
 * Useful for modals and dropdowns
 */
export function useFocusTrap(isActive: boolean) {
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!isActive || event.key !== 'Tab') return;

    const container = event.currentTarget as HTMLElement;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  }, [isActive]);

  return {
    onKeyDown: handleKeyDown,
  };
}

/**
 * Utility function to check if an element is focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  const focusableSelectors = [
    'button:not([disabled])',
    '[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ];

  return focusableSelectors.some(selector => element.matches(selector));
}

/**
 * Utility function to get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'button:not([disabled])',
    '[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  return Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[];
}