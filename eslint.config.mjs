import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Tambahkan aturan override di bawah ini
  {
    rules: {
      "no-unused-vars": "off", // Nonaktifkan warning untuk variabel tidak terpakai
      // kamu bisa tambahkan lainnya juga
      // "react-hooks/exhaustive-deps": "off",
    },
  },
];
