document.addEventListener("DOMContentLoaded", function() {
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const categoryInput = document.getElementById('category');
    const addExpenseButton = document.getElementById('addExpenseButton');
    const expenseList = document.getElementById('expenseList');
    const totalExpenseDisplay = document.getElementById('totalExpense');
    const weeklyExpenseDisplay = document.getElementById('weeklyExpense');
    const monthlyExpenseDisplay = document.getElementById('monthlyExpense');
    const expenseChart = document.getElementById('expenseChart').getContext('2d');

    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    let chart;
    let isEditMode = false;
    let editId = null;

    // Function to add or update an expense
    function addOrUpdateExpense(description, amount, category) {
        if (isEditMode) {
            // Update existing expense
            expenses = expenses.map(expense => {
                if (expense.id === editId) {
                    return { ...expense, description, amount: parseFloat(amount), category };
                }
                return expense;
            });
            isEditMode = false;
            editId = null;
            addExpenseButton.textContent = 'Add Expense';  // Reset button text
        } else {
            // Add new expense
            const expense = {
                id: Date.now(),
                description,
                amount: parseFloat(amount),
                category,
                date: new Date()
            };
            expenses.push(expense);
        }

        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderExpenses();
        updateTotals();
        updateChart();
    }

    // Function to delete an expense
    function deleteExpense(id) {
        expenses = expenses.filter(expense => expense.id !== id);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderExpenses();
        updateTotals();
        updateChart();
    }

    // Function to edit an existing expense
    function editExpense(id) {
        const expense = expenses.find(exp => exp.id === id);
        if (expense) {
            descriptionInput.value = expense.description;
            amountInput.value = expense.amount;
            categoryInput.value = expense.category;
            isEditMode = true;
            editId = id;
            addExpenseButton.textContent = 'Update Expense';  // Change button text during edit
        }
    }

    // Function to render expenses to the DOM
    function renderExpenses() {
        expenseList.innerHTML = '';
        expenses.forEach(expense => {
            const li = document.createElement('li');
            li.classList.add('expense-item');
            li.innerHTML = `
                ${expense.description} - ₹${expense.amount.toFixed(2)} (${expense.category})
                <button class="edit-btn" data-id="${expense.id}">Edit</button>
                <button class="delete-btn" data-id="${expense.id}">Delete</button>
            `;
            expenseList.appendChild(li);
        });

        // Add event listeners to Edit and Delete buttons
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                editExpense(id);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                deleteExpense(id);
            });
        });
    }

    // Function to calculate and update total, weekly, and monthly expenses
    function updateTotals() {
        const now = new Date();
        const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);

        const weeklyExpense = expenses.reduce((sum, expense) => {
            const expenseDate = new Date(expense.date);
            const diffDays = Math.floor((now - expenseDate) / (1000 * 60 * 60 * 24));
            return diffDays < 7 ? sum + expense.amount : sum;
        }, 0);

        const monthlyExpense = expenses.reduce((sum, expense) => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === now.getMonth() ? sum + expense.amount : sum;
        }, 0);

        totalExpenseDisplay.textContent = totalExpense.toFixed(2);
        weeklyExpenseDisplay.textContent = weeklyExpense.toFixed(2);
        monthlyExpenseDisplay.textContent = monthlyExpense.toFixed(2);
    }

    // Function to update the Chart.js chart
    function updateChart() {
        const categories = ['Food', 'Transport', 'Entertainment', 'Other'];
        const categorySums = categories.map(category => {
            return expenses
                .filter(expense => expense.category === category)
                .reduce((sum, expense) => sum + expense.amount, 0);
        });

        if (chart) chart.destroy();  // Clear the existing chart
        chart = new Chart(expenseChart, {
            type: 'pie',
            data: {
                labels: categories,
                datasets: [{
                    data: categorySums,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
                }]
            }
        });
    }

    // Load data from local storage and initialize the display
    function init() {
        renderExpenses();
        updateTotals();
        updateChart();
    }

    // Event listener for adding/updating a new expense
    addExpenseButton.addEventListener('click', function() {
        const description = descriptionInput.value;
        const amount = amountInput.value;
        const category = categoryInput.value;

        if (description && amount && category) {
            addOrUpdateExpense(description, amount, category);
            descriptionInput.value = '';
            amountInput.value = '';
            categoryInput.value = 'Food';
        }
    });

    // Initialize the app
    init();
});
