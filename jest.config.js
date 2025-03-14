module.exports = {
  testEnvironment: "node",
  rootDir: "src/",
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  testPathIgnorePatterns: ["/node_modules/"],
  verbose: false,
  preset: "ts-jest",
  moduleDirectories: ["node_modules", "src"],
};
