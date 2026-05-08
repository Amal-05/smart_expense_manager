import { IncomeData, ExpenseData, Auth } from './data.js';

document.addEventListener('DOMContentLoaded', async function () {
  if (!Auth.isLoggedIn()) {
    window.location.href = 'index.html';
    return;
  }

  const budgetUsageRing = document.querySelector('.progress-ring-value');
  const progressText = document.querySelector('.progress-text');
  const subtext = document.querySelector('.subtext');
  const circumference = 2 * Math.PI * 40; // r=40
  budgetUsageRing.style.strokeDasharray = `0 ${circumference}`;

  const monthPicker = document.getElementById('monthPicker');
  
  // Set default to current month (YYYY-MM)
  const today = new Date();
  const currentMonthStr = today.toISOString().slice(0, 7);
  monthPicker.value = currentMonthStr;

  async function loadBudgetData(selectedYYYYMM) {
    const [yearStr, monthStr] = selectedYYYYMM.split('-');
    const targetYear = parseInt(yearStr);
    const targetMonth = parseInt(monthStr) - 1; // 0-11

    // Filter income and expenses for this month/year
    const incomes = await IncomeData.getAll();
    const expenses = await ExpenseData.getAll();

    const monthIncome = incomes.reduce((sum, item) => {
      const d = new Date(item.date);
      if (d.getFullYear() === targetYear && d.getMonth() === targetMonth) {
        return sum + parseFloat(item.amount);
      }
      return sum;
    }, 0);

    const monthExpense = expenses.reduce((sum, item) => {
      const d = new Date(item.date);
      if (d.getFullYear() === targetYear && d.getMonth() === targetMonth) {
        return sum + parseFloat(item.amount);
      }
      return sum;
    }, 0);

    const remaining = monthIncome - monthExpense;

    // Update HTML Cards
    document.getElementById('budget-income').textContent = monthIncome.toLocaleString('en-IN', {minimumFractionDigits: 2});
    document.getElementById('budget-expenses').textContent = monthExpense.toLocaleString('en-IN', {minimumFractionDigits: 2});
    
    const remainingEl = document.getElementById('budget-remaining');
    remainingEl.textContent = remaining.toLocaleString('en-IN', {minimumFractionDigits: 2});
    if (remaining < 0) {
      remainingEl.style.color = '#EF4444'; // Red if overspent
    } else {
      remainingEl.style.color = 'var(--text-primary)';
    }

    // Update Progress Ring
    updateProgress(monthExpense, monthIncome);
  }

  function updateProgress(used, budget) {
    if (budget <= 0) {
      progressText.textContent = used > 0 ? "OVER" : "0%";
      subtext.textContent = `₹${used.toLocaleString('en-IN')} of ₹0`;
      budgetUsageRing.style.strokeDasharray = `0 ${circumference}`;
      return;
    }

    const percent = Math.min((used / budget) * 100, 100); 
    const offset = (percent / 100) * circumference;

    // Set stroke color dynamically
    budgetUsageRing.style.stroke = percent >= 100 ? '#EF4444' : 'url(#gradient)';
    budgetUsageRing.style.strokeDasharray = `${offset} ${circumference}`;
    progressText.textContent = `${Math.round(percent)}%`;
    subtext.textContent = `₹${used.toLocaleString('en-IN')} of ₹${budget.toLocaleString('en-IN')}`;
  }

  monthPicker.addEventListener('change', function () {
    loadBudgetData(this.value);
  });

  // Initial load
  await loadBudgetData(monthPicker.value);
});
