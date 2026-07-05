const nextJest = require("next/jest");
const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const custom = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
  testMatch: [
    "**/__tests__/**/*.test.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
  ],
  // docs/learning은 학습 연습이라 "일부러 실패"하는 exercises가 있다.
  // 팀 CI(npm test)가 깨지지 않도록 제외. 연습 검사는 전용 config로 돌린다:
  // npx jest --config docs/learning/react/jest.config.js
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "<rootDir>/docs/"],
};
module.exports = createJestConfig(custom);
