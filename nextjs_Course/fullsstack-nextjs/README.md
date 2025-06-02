## Create Project

```bash
pnpm create next-app@latest
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

---

## 📍 ค่า ESLint และ Prettier บน Next.js

1. ติดตั้ง package ที่จำเป็นสำหรับ ESLint และ Prettier

```bash
pnpm add -D eslint-config-next eslint-config-prettier eslint-plugin-prettier prettier prettier-plugin-tailwindcss @typescript-eslint/eslint-plugin
```

```Waarning
pnpm approve-builds
```

2. ทำการสร้างไฟล์การตั้งค่าของ ESLint ในชื่อ `.eslintrc.cjs` หากมีไฟล์การตั้งค่าอื่นของ ESLint อยู่ เช่น .eslintrc, .eslintrc.js หรือ .eslintrc.json ให้ลบทิ้งก่อน

```cjs
const path = require('path');

/** @type {import("eslint").Linter.Config} */
const config = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['postcss.config.mjs'],
  rules: {
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      },
    ],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-misused-promises': [
      2,
      {
        checksVoidReturn: { attributes: false },
      },
    ],
  },
  overrides: [
    {
      extends: [
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: path.join(__dirname, 'tsconfig.json'),
      },
      rules: {
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
      },
    },
    {
      files: ['.eslintrc.cjs'], // 👈 เพิ่มตรงนี้
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
      },
    },
  ],
};

module.exports = config;
```

3. ให้ทำการตั้งค่า Prettier ด้วยการสร้างไฟล์ตั้งค่าชื่อ `prettier.config.cjs`

```cjs
/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').Options} */
module.exports = {
  plugins: ['prettier-plugin-tailwindcss'],
  singleQuote: true,
  trailingComma: 'all',
};
```

4. เปลี่ยนชื่อไฟล์ `next.config.js` เป็น `next.config.mjs` และทำการใส่เนื้อหาต่อไปนี้

```mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['.'],
  },
};

export default nextConfig;
```

5. ทำการเพิ่มไฟล์ตั้งค่าดังกล่าวเข้าไปยัง tsconfig.json เพื่อให้ TypeScript รู้จักไฟล์เหล่านี้ หรือทำการลบ include ทิ้งแล้วเอาด้านล่างไปใส่แทน

```json
"include": [
    "next-env.d.ts",
    ".eslintrc.cjs",
    "prettier.config.mjs",
    "next.config.mjs",
    "postcss.config.js",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ]
```

6. แก้ไขส่วนของ scripts ที่มีชื่อว่า lint ใน package.json ด้วยการเติม --fix ดังนี้

```json
"lint": "next lint --fix"
```

7. ทำการติดตั้ง Extensions ของ VS Code สองตัวคือ Prettier และ ESLint สุดท้ายจึงทำการตั้งค่า VS Code ให้ ESLint ทำการฟอร์แมตให้กับเราด้วยการสร้างไฟล์ `.vscode/settings.json`

```json
{
  "editor.tabSize": 2,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "always"
  },
  "eslint.validate": [
    "javascript",
    "typescript",
    "javascriptreact",
    "typescriptreact"
  ],
  // "[javascript]": {
  //   "editor.formatOnSave": false
  // },
  // "[typescript]": {
  //   "editor.formatOnSave": false
  // },
  // "[javascriptreact]": {
  //   "editor.formatOnSave": false
  // },
  // "[typescriptreact]": {
  //   "editor.formatOnSave": false
  // },

  "files.associations": {
    "*.css": "tailwindcss"
  },
  "files.eol": "\n",
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

8. ไปเปิด auto from ใน extention โดยมี Eslint, prettier ,tailwind และ tailwind fold
9. ใช้คำสั่ง lint

```bash
pnpm lint
```
