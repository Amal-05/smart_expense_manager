import { IncomeData, Auth, generateId } from './data.js';

document.addEventListener('DOMContentLoaded', async function() {
    if (!Auth.isLoggedIn()) {
        window.location.href = 'index.html';
        return;
    }

    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
    
    // Initial Render
    await renderIncome();
    
    // Handle form submission
    document.getElementById('income-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const source = document.getElementById('source').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const date = document.getElementById('date').value;
        const category = document.getElementById('category').value;
        const notes = document.getElementById('notes').value;
        
        if (!source || isNaN(amount) || !date) {
            alert('Please fill in all required fields');
            return;
        }
        
        const incomeObj = {
            id: generateId(),
            source,
            amount,
            date,
            category,
            notes
        };
        
        await IncomeData.add(incomeObj);
        
        this.reset();
        document.getElementById('date').value = today;
        await renderIncome();
    });
});

window.deleteIncome = async function(id) {
    if (confirm('Are you sure you want to delete this income record?')) {
        await IncomeData.remove(id);
        await renderIncome();
    }
};

window.editIncome = async function(id) {
    const data = await IncomeData.getAll();
    const income = data.find(i => i.id === id);
    if (income) {
        document.getElementById('source').value = income.source;
        document.getElementById('amount').value = income.amount;
        document.getElementById('date').value = income.date;
        document.getElementById('category').value = income.category;
        document.getElementById('notes').value = income.notes || '';
        
        await IncomeData.remove(id);
        await renderIncome();
        document.getElementById('income-form').scrollIntoView({ behavior: 'smooth' });
    }
};

async function renderIncome() {
    // Get Data from unified utility
    const incomeRecords = await IncomeData.getAll();
    const totalAmount = await IncomeData.getTotal();
    const thisMonth = await IncomeData.getThisMonthTotal();
    const thisYear = await IncomeData.getThisYearTotal();
    
    // Summary Cards
    document.getElementById('total-amount').textContent = totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2});
    document.getElementById('summary-month').textContent = '₹' + thisMonth.toLocaleString('en-IN', {minimumFractionDigits: 2});
    document.getElementById('summary-year').textContent = '₹' + thisYear.toLocaleString('en-IN', {minimumFractionDigits: 2});
    
    // Average
    const currentMonthNum = new Date().getMonth() + 1; // 1-12
    const avg = thisYear / currentMonthNum;
    document.getElementById('summary-avg').textContent = '₹' + avg.toLocaleString('en-IN', {minimumFractionDigits: 2});

    // Table elements
    const tbody = document.getElementById('income-body');
    const emptyState = document.getElementById('empty-state');
    const table = document.getElementById('income-table');
    
    tbody.innerHTML = '';
    
    if (incomeRecords.length === 0) {
        emptyState.style.display = 'block';
        table.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        table.style.display = 'table';
        
        incomeRecords.forEach(income => {
            const tr = document.createElement('tr');
            const dateObj = new Date(income.date);
            const formattedDate = dateObj.toLocaleDateString('en-IN', {
                year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC'
            });
            
            const catBadge = income.category ? `<span class="category-badge ${income.category}">${income.category.charAt(0).toUpperCase() + income.category.slice(1)}</span>` : '-';
            
            tr.innerHTML = `
                <td>${formattedDate}</td>
                <td>${escapeHtml(income.source)}</td>
                <td>${catBadge}</td>
                <td>₹${income.amount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                <td>${escapeHtml(income.notes) || '-'}</td>
                <td style="white-space:nowrap;">
                    <button class="btn-outline" onclick="editIncome('${income.id}')" style="padding:0.4rem 0.8rem; font-size:0.8rem; border-radius:8px;"><i class="fas fa-edit"></i></button>
                    <button class="btn-danger" onclick="deleteIncome('${income.id}')" style="padding:0.4rem 0.8rem; font-size:0.8rem; border-radius:8px; background: rgba(239, 68, 68, 0.2); color: #fca5a5;"><i class="fas fa-trash"></i></button>
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
