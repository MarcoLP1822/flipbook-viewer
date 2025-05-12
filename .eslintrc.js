/**
 * @file ESLint configuration for the CRM Flipbook Viewer monorepo.
 *       Applies to all packages: backend (Node), frontend (React/Next), shared, etc.
 *
 * Purpose:
 * - Enforce code quality and consistency
 * - Support TypeScript, React, and Node environments
 * - Integrate Prettier for formatting
 *
 * @see https://typescript-eslint.io/, https://prettier.io/
 */

module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: ['./tsconfig.json'],
      tsconfigRootDir: __dirname,
      sourceType: 'module',
      ecmaVersion: 2022,
    },
    env: {
      browser: true,
      node: true,
      es6: true,
    },
    plugins: [
      '@typescript-eslint',
      'react',
      'react-hooks',
      'jsx-a11y',
      'prettier'
    ],
    extends: [
      'eslint:recommended',                       // Basic ESLint recommended rules
      'plugin:@typescript-eslint/recommended',    // TypeScript-specific rules
      'plugin:react/recommended',                 // React best practices
      'plugin:react-hooks/recommended',           // Hooks rules
      'plugin:jsx-a11y/recommended',              // Accessibility checks
      'plugin:prettier/recommended'               // Integrates Prettier into ESLint
    ],
    settings: {
      react: {
        version: 'detect'                         // Automatically detect React version
      }
    },
    rules: {
      'prettier/prettier': 'error',               // Report formatting issues as errors
      // You can customize or disable specific rules below:
      '@typescript-eslint/explicit-module-boundary-types': 'off'
    },
    overrides: [
      {
        files: ['*.ts', '*.tsx'],
        rules: {
          // Place TS-specific overrides here
        }
      },
      {
        files: ['*.js'],
        rules: {
          '@typescript-eslint/no-var-requires': 'off'
        }
      }
    ]
  };
  