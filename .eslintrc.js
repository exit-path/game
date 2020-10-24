module.exports = {
  root: true,
  extends: "react-app",
  parser: "@typescript-eslint/parser",
  plugins: ["react", "@typescript-eslint"],
  env: {
    browser: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  overrides: [
    {
      files: ["game/**/*.ts"],
      rules: {
        eqeqeq: "off",
        "import/first": "off",
        "no-fallthrough": "off",
        "no-new-object": "off",
        "@typescript-eslint/no-useless-constructor": "off",
        "@typescript-eslint/no-array-constructor": "off",
      },
    },
  ],
  rules: {
    "react/jsx-uses-vars": "warn",
    "react/jsx-uses-react": "warn",
  },
};
