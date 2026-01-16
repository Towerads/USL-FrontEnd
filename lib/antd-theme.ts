import type { ThemeConfig } from 'antd';

export const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: '#1677ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1677ff',
    colorTextBase: '#000000',
    colorTextSecondary: '#999999',
    colorBgBase: '#F5F5F5',
    colorBgContainer: '#FFFFFF',
    colorBorder: '#E6E6E6',
    colorBorderSecondary: '#E6E6E6',
    borderRadius: 12,
    fontSize: 15,
    fontFamily: 'var(--font-nunito), "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    lineHeight: 1.6,
    controlHeight: 44,
  },
  components: {
    Card: {
      borderRadiusLG: 16,
      borderRadius: 16,
      paddingLG: 20,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    },
    Button: {
      borderRadius: 12,
      controlHeight: 44,
      fontWeight: 500,
      primaryShadow: '0 2px 0 rgba(255, 204, 0, 0.1)',
    },
    Input: {
      borderRadius: 12,
      controlHeight: 44,
    },
    Badge: {
      borderRadiusSM: 8,
    },
    Statistic: {
      contentFontSize: 32,
      titleFontSize: 14,
    },
    Tabs: {
      borderRadius: 12,
    },
  },
};

export const darkTheme: ThemeConfig = {
  token: {
    colorPrimary: '#1677ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1677ff',
    colorTextBase: '#FFFFFF',
    colorTextSecondary: '#999999',
    colorBgBase: '#0A0A0A',
    colorBgContainer: '#1A1A1A',
    colorBorder: '#3A3A3A',
    colorBorderSecondary: '#3A3A3A',
    borderRadius: 12,
    fontSize: 15,
    fontFamily: 'var(--font-nunito), "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    lineHeight: 1.6,
    controlHeight: 44,
  },
  components: {
    Card: {
      borderRadiusLG: 16,
      borderRadius: 16,
      paddingLG: 20,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
    },
    Button: {
      borderRadius: 12,
      controlHeight: 44,
      fontWeight: 500,
      primaryShadow: '0 2px 0 rgba(255, 204, 0, 0.2)',
    },
    Input: {
      borderRadius: 12,
      controlHeight: 44,
    },
    Badge: {
      borderRadiusSM: 8,
    },
    Statistic: {
      contentFontSize: 32,
      titleFontSize: 14,
    },
    Tabs: {
      borderRadius: 12,
    },
  },
};
