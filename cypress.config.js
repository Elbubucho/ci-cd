const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {},
  },
  env: {
    apiUrl: "http://localhost:8000",
  },
});
