import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tienda.app',
  appName: 'tiendaVasquez',
  webDir: 'dist',
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
  server: {
    androidScheme: "http"
  }
};

export default config;
