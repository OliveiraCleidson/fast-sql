module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['eslint-plugin-import', '@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "internal",
          "external",
          "sibling",
          "index",
          "object",
          "type",
          "parent",
        ],
        pathGroups: [
          {
            pattern: "~/**",
            group: "sibling"
          }
        ],
        "newlines-between": "always",
      }
    ],
    "indent": "off",
    "import/no-cycle": "error",
    "import/no-default-export": "error",
    "import/no-deprecated": "warn",
    "prettier/prettier": ["error", {
      "singleQuote": true,
      "trailingComma": "all",
      "tabWidth": 2
    }],
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off"
  },
};
