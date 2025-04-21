import { defineConfig } from "cypress";
import vitePreprocessor from "cypress-vite";
import coverageTask from "@cypress/code-coverage/task.js";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    setupNodeEvents(on, config) {
      on("file:preprocessor", vitePreprocessor());
      coverageTask(on, config);

      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.name === "chrome") {
          launchOptions.args.push("--disable-dev-shm-usage");
        }
        return launchOptions;
      });
      return config;
    },
  },
  env: {
    VITE_API_BASE_URL: "http://localhost:5173",
  },
});
