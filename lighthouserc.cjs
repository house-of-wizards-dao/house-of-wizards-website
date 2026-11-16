module.exports = {
  ci: {
    collect: {
      startServerCommand: "pnpm start --port 3101",
      startServerReadyPattern: "Ready",
      url: ["http://127.0.0.1:3101/", "http://127.0.0.1:3101/marketplace"],
      numberOfRuns: 3,
      settings: {
        onlyCategories: ["performance", "accessibility"],
        chromeFlags: "--headless --no-sandbox --disable-gpu",
      },
    },
    assert: {
      assertions: {
        "categories:performance": [
          "error",
          { minScore: 0.8, aggregationMethod: "median" },
        ],
        "categories:accessibility": [
          "error",
          { minScore: 0.9, aggregationMethod: "median" },
        ],
        "largest-contentful-paint": [
          "warn",
          { maxNumericValue: 2500, aggregationMethod: "median" },
        ],
        "total-blocking-time": [
          "error",
          { maxNumericValue: 500, aggregationMethod: "median" },
        ],
        "cumulative-layout-shift": [
          "error",
          { maxNumericValue: 0.1, aggregationMethod: "median" },
        ],
      },
    },
    upload: { target: "filesystem", outputDir: ".lighthouseci/reports" },
  },
};
