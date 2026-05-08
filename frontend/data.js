// data.js - Centralized Data Management with Backend API

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getAuthHeaders() {
    const token = localStorage.getItem('se_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// --- Income Methods ---
export const IncomeData = {
    getAll: async function() {
        try {
            const res = await fetch(`${API_URL}/finance/incomes`, { headers: getAuthHeaders() });
            if (!res.ok) throw new Error('Failed to fetch incomes');
            return await res.json();
        } catch (err) {
            console.error(err);
            return [];
        }
    },
    add: async function(incomeObj) {
        try {
            const res = await fetch(`${API_URL}/finance/incomes`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(incomeObj)
            });
            if (!res.ok) throw new Error('Failed to add income');
            return await res.json();
        } catch (err) {
            console.error(err);
        }
    },
    remove: async function(id) {
        try {
            const res = await fetch(`${API_URL}/finance/incomes/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (!res.ok) throw new Error('Failed to delete income');
            return await res.json();
        } catch (err) {
            console.error(err);
        }
    },
    getTotal: async function() {
        const data = await this.getAll();
        return data.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    },
    getThisMonthTotal: async function() {
        const data = await this.getAll();
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        return data.reduce((sum, item) => {
            const itemDate = new Date(item.date);
            if (itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear) {
                return sum + parseFloat(item.amount);
            }
            return sum;
        }, 0);
    },
    getThisYearTotal: async function() {
        const data = await this.getAll();
        const currentYear = new Date().getFullYear();
        
        return data.reduce((sum, item) => {
            const itemDate = new Date(item.date);
            if (itemDate.getFullYear() === currentYear) {
                return sum + parseFloat(item.amount);
            }
            return sum;
        }, 0);
    }
};

// --- Expense Methods ---
export const ExpenseData = {
    getAll: async function() {
        try {
            const res = await fetch(`${API_URL}/finance/expenses`, { headers: getAuthHeaders() });
            if (!res.ok) throw new Error('Failed to fetch expenses');
            return await res.json();
        } catch (err) {
            console.error(err);
            return [];
        }
    },
    add: async function(expenseObj) {
        try {
            const res = await fetch(`${API_URL}/finance/expenses`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(expenseObj)
            });
            if (!res.ok) throw new Error('Failed to add expense');
            return await res.json();
        } catch (err) {
            console.error(err);
        }
    },
    remove: async function(id) {
        try {
            const res = await fetch(`${API_URL}/finance/expenses/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (!res.ok) throw new Error('Failed to delete expense');
            return await res.json();
        } catch (err) {
            console.error(err);
        }
    },
    getTotal: async function() {
        const data = await this.getAll();
        return data.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    },
    getThisMonthTotal: async function() {
        const data = await this.getAll();
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        return data.reduce((sum, item) => {
            const itemDate = new Date(item.date);
            if (itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear) {
                return sum + parseFloat(item.amount);
            }
            return sum;
        }, 0);
    },
    getThisYearTotal: async function() {
         const data = await this.getAll();
        const currentYear = new Date().getFullYear();
        
        return data.reduce((sum, item) => {
            const itemDate = new Date(item.date);
            if (itemDate.getFullYear() === currentYear) {
                return sum + parseFloat(item.amount);
            }
            return sum;
        }, 0);
    }
};

// --- Authentication & Profile ---
export const Auth = {
    login: async function(username, password) {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        localStorage.setItem('se_token', data.token);
        return data;
    },
    register: async function(userData) {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');
        localStorage.setItem('se_token', data.token);
        return data;
    },
    logout: function() {
        localStorage.removeItem('se_token');
        window.location.href = 'index.html';
    },
    isLoggedIn: function() {
        return !!localStorage.getItem('se_token');
    }
};

// Utility
export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Make globally available so existing inline scripts don't break immediately
window.IncomeData = IncomeData;
window.ExpenseData = ExpenseData;
window.Auth = Auth;
window.generateId = generateId;
