import { CapacitorConfig } from '@capacitor/cli';
 
const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'photoBook',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    }
  },
};
 
export = config;

