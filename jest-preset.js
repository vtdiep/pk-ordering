module.exports = {
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": ".",
    "moduleDirectories": ["node_modules"],
    "moduleNameMapper": {
      "^src/(.*)$": "<rootDir>/src/$1"
    },
    "testEnvironment": "node",
    "testRegex": ".spec.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    }
  }