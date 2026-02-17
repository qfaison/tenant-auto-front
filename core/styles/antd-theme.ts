import { ThemeConfig } from 'antd';
import { theme } from 'antd';

/**
 * Ant Design theme configuration
 * Supports both light and dark themes
 */
const { darkAlgorithm, defaultAlgorithm } = theme;

export const getAntdTheme = (isDark: boolean): ThemeConfig => {
  return {
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 6,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      colorBgContainer: isDark ? '#1f1f1f' : '#ffffff',
      colorBgLayout: isDark ? '#141414' : '#fafafa',
      // Text colors
      colorText: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)',
      colorTextSecondary: isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)',
      // Border colors
      colorBorder: isDark ? '#434343' : '#d9d9d9',
      colorBorderSecondary: isDark ? '#303030' : '#f0f0f0',
      // Fill colors for backgrounds
      colorFillAlter: isDark ? 'rgba(255, 255, 255, 0.02)' : '#fafafa',
      colorFillSecondary: isDark ? 'rgba(255, 255, 255, 0.06)' : '#f5f5f5',
      colorFillTertiary: isDark ? 'rgba(255, 255, 255, 0.04)' : '#f0f0f0',
      // Hover colors
      colorBgTextHover: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
      colorBgTextActive: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.15)',
    },
    components: {
      Table: {
        // Header styling
        headerBg: isDark ? '#1d1d1d' : '#fafafa',
        headerColor: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)',
        headerSortActiveBg: isDark ? '#262626' : '#f0f0f0',
        headerSortHoverBg: isDark ? '#303030' : '#f5f5f5',
        // Row styling
        rowHoverBg: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
        rowSelectedBg: isDark ? '#111b26' : '#e6f7ff',
        rowSelectedHoverBg: isDark ? '#112a3c' : '#bae7ff',
        // Border styling
        borderColor: isDark ? '#434343' : '#f0f0f0',
      },
    },
    algorithm: isDark ? darkAlgorithm : defaultAlgorithm,
  };
};

export const getDarkTheme = (): ThemeConfig => getAntdTheme(true);
export const getLightTheme = (): ThemeConfig => getAntdTheme(false);
