import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        signin: resolve(__dirname, 'sign_in.html'),
        budget: resolve(__dirname, 'budget_overview.html'),
        expense: resolve(__dirname, 'manage_expense.html'),
        income: resolve(__dirname, 'manage_income.html'),
        profile: resolve(__dirname, 'profile.html'),
      },
    },
  },
});
