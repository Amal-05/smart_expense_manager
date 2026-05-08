import { ExpenseData, Auth, generateId } from './data.js';

document.addEventListener('DOMContentLoaded', async function () {
    if (!Auth.isLoggedIn()) {
        window.location.href = 'index.html';
        return;
    }

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;

    await renderExpenses();

    // Main form submit
    document.getElementById('expense-form').addEventListener('submit', addExpense);

    // --- Custom Category Handling ---
    const categorySelect = document.getElementById('category');
    const customCategoryGroup = document.getElementById('custom-category-group');
    const customCategoryInput = document.getElementById('custom-category');

    categorySelect.addEventListener('change', () => {
        if (categorySelect.value === 'add-new') {
            customCategoryGroup.style.display = 'block';
            customCategoryInput.required = true;
        } else {
            customCategoryGroup.style.display = 'none';
            customCategoryInput.required = false;
        }
    });
});

async function addExpense(e) {
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;
    let category = document.getElementById('category').value;
    const notes = document.getElementById('notes').value.trim();

    if (category === 'add-new') {
        const customCategory = document.getElementById('custom-category').value.trim();
        if (customCategory) {
            category = customCategory.toLowerCase().replace(/\s+/g, '-'); 
            const newOption = document.createElement('option');
            newOption.value = category;
            newOption.textContent = customCategory;
            document.getElementById('category').insertBefore(newOption, document.querySelector('#category option[value="add-new"]'));
            document.getElementById('category').value = category;
        } else {
            return alert("Please enter a custom category name");
        }
    }

    if (!title || isNaN(amount) || !date || !category) {
        return alert('Please fill in all required fields');
    }

    const expenseObj = {
        id: generateId(),
        title,
        amount,
        date,
        category,
        notes
    };

    await ExpenseData.add(expenseObj);
    
    await renderExpenses(); 
    document.getElementById('expense-form').reset();
    document.getElementById('date').value = new Date().toISOString().split('T')[0];
    document.getElementById('custom-category-group').style.display = 'none';
}

window.deleteExpense = async function(id) {
    if (confirm('Are you sure you want to delete this expense record?')) {
        await ExpenseData.remove(id);
        await renderExpenses();
    }
}

window.editExpense = async function(id) {
    const data = await ExpenseData.getAll();
    const expense = data.find(i => i.id === id);
    if (expense) {
        document.getElementById('title').value = expense.title;
        document.getElementById('amount').value = expense.amount;
        document.getElementById('date').value = expense.date;
        document.getElementById('category').value = expense.category;
        document.getElementById('notes').value = expense.notes || '';
        
        await ExpenseData.remove(id);
        await renderExpenses();
        document.getElementById('expense-form').scrollIntoView({ behavior: 'smooth' });
    }
}

async function renderExpenses() {
    const expenses = await ExpenseData.getAll();
    const totalAmount = await ExpenseData.getTotal();
    const thisMonth = await ExpenseData.getThisMonthTotal();
    const thisYear = await ExpenseData.getThisYearTotal();

    // Summary Cards
    document.getElementById('total-amount').textContent = totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2});
    document.getElementById('summary-month').textContent = '₹' + thisMonth.toLocaleString('en-IN', {minimumFractionDigits: 2});
    document.getElementById('summary-year').textContent = '₹' + thisYear.toLocaleString('en-IN', {minimumFractionDigits: 2});
    
    // Average
    const currentMonthNum = new Date().getMonth() + 1; // 1-12
    const avg = thisYear / currentMonthNum;
    document.getElementById('summary-avg').textContent = '₹' + avg.toLocaleString('en-IN', {minimumFractionDigits: 2});

    const tbody = document.getElementById('expenses-body');
    const emptyState = document.getElementById('empty-state');
    const table = document.getElementById('expenses-table');
    tbody.innerHTML = '';
    
    if (expenses.length === 0) {
        emptyState.style.display = 'block';
        table.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        table.style.display = 'table';

        expenses.forEach(expense => {
            const tr = document.createElement('tr');
            const formattedDate = new Date(expense.date).toLocaleDateString('en-IN', { timeZone: 'UTC', year: 'numeric', month: 'short', day: 'numeric' });
            
            const catBadge = expense.category ? `<span class="category-badge ${expense.category}">${escapeHtml(expense.category)}</span>` : '-';

            tr.innerHTML = `
                <td>${escapeHtml(expense.title)}</td>
                <td>₹${expense.amount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                <td>${formattedDate}</td>
                <td>${catBadge}</td>
                <td>-</td>
                <td style="white-space:nowrap;">
                    <button class="btn-outline" onclick="editExpense('${expense.id}')" style="padding:0.4rem 0.8rem; font-size:0.8rem; border-radius:8px;"><i class="fas fa-edit"></i></button>
                    <button class="btn-danger" onclick="deleteExpense('${expense.id}')" style="padding:0.4rem 0.8rem; border-radius:8px; font-size:0.8rem; background: rgba(239, 68, 68, 0.2); color: #fca5a5;"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, match => {
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
        return map[match];
    });
}
