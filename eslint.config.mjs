import nextVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier/flat";

export default [
  ...nextVitals,
  prettier,
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "contracts/**",
      "public/guard-game/**",
      "src/data/**",
      "src/config/merkletree/guard/shieldProofsTree.ts",
    ],
  },
  {
    rules: {
      "no-console": "warn",
      "react/no-unescaped-entities": "off",
      "jsx-a11y/media-has-caption": "off",
    },
  },
  {
    files: ["scripts/**", "src/lib/logger.ts"],
    rules: { "no-console": "off" },
  },
];
