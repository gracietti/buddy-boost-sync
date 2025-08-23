import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c0d077463bb8462b961d60c1e59a0f48',
  appName: 'FitTogether',
  webDir: 'dist',
  server: {
    url: 'https://c0d07746-3bb8-462b-961d-60c1e59a0f48.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;