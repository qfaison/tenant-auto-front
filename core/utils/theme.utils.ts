/**
 * Theme utilities for component styling
 * Provides theme-aware styles that read from CSS variables or theme config
 */
import type { CSSProperties } from 'react';
import { LOGIN_CONSTANTS } from './login.constants';

type ThemeMode = 'light' | 'dark';

/**
 * Get login card styles based on theme
 * Only sets background/color/border on root (body inherits via CSS cascade)
 */
export function getLoginCardStyles(theme: ThemeMode): {
  root: CSSProperties;
  body: CSSProperties;
} {
  const isLight = theme === 'light';

  return {
    root: {
      background: isLight ? '#ffffff' : '#1f1f1f',
      color: isLight ? '#171717' : 'rgba(255, 255, 255, 0.85)',
      borderRadius: LOGIN_CONSTANTS.CARD.BORDER_RADIUS,
      border: isLight ? '1px solid #e5e7eb' : '1px solid transparent',
    },
    body: {
      padding: LOGIN_CONSTANTS.CARD.PADDING,
      // Background and color inherit from root, no need to duplicate
    },
  };
}
