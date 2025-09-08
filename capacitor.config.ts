import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.icywizard.sproutsoflife",
  appName: "SproutsOfLife",
  webDir: "out",
  server: {
    url: "https://growhybrid.vercel.app",
    cleartext: true,
  },
};

export default config;
