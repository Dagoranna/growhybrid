import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.icywizard.sproutsoflife",
  appName: "SproutsOfLife",
  webDir: "out",
  server: {
    url: "https://floppy-melons-tickle.loca.lt",
    cleartext: true,
  },
};

export default config;
