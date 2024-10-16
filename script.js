// Select Elements
const addExpenseButton = document.getElementById('addExpenseButton');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const expenseList = document.getElementById('expenseList');
const totalExpenseDisplay = document.getElementById('totalExpense');
const expenseChartCanvas = document.getElementById('expenseChart');

// Initialize total expense and categories
let totalExpense = 0;
let expenseCategories = {
    Food: 0,
    Transport: 0,
    Entertainment: 0,
    Other: 0
};

// Initialize Chart.js pie chart
let expenseChart = new Chart(expenseChartCanvas, {
    type: 'pie',
    data: {
        labels: ['Food', 'Transport', 'Entertainment', 'Other'],
        datasets: [{
            label: 'Expense Categories',
            data: [0, 0, 0, 0], // Initial data
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
        }]
    },
    options: {
        responsive: true
    }
});

// Add event listener to the button
addExpenseButton.addEventListener('click', function() {
    const description = descriptionInput.value;
    const amount = parseFloat(amountInput.value);
    const category = categoryInput.value;

    // Validate the input
    if (description === "" || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid description and amount');
        return;
    }

    // Create a new expense item
    const expenseItem = document.createElement('li');
    expenseItem.innerHTML = `
        ${description} - $<span>${amount.toFixed(2)}</span> (${category})
        <button class="remove-btn">Remove</button>
    `;

    // Append the new item to the list
    expenseList.appendChild(expenseItem);

    // Update the total expense
    totalExpense += amount;
    totalExpenseDisplay.textContent = totalExpense.toFixed(2);

    // Update category data
    expenseCategories[category] += amount;
    updateChart();

    // Clear the input fields
    descriptionInput.value = '';
    amountInput.value = '';

    // Add event listener to the remove button
    const removeButton = expenseItem.querySelector('.remove-btn');
    removeButton.addEventListener('click', function() {
        // Remove the expense from the total
        const amountToRemove = parseFloat(expenseItem.querySelector('span').textContent);
        const categoryToRemove = category; // use category from scope

        totalExpense -= amountToRemove;
        totalExpenseDisplay.textContent = totalExpense.toFixed(2);

        // Update category data
        expenseCategories[categoryToRemove] -= amountToRemove;
        updateChart();

        // Remove the expense item from the list
        expenseItem.remove();
    });
});

// Function to update the chart
function updateChart() {
    expenseChart.data.datasets[0].data = [
        expenseCategories.Food,
        expenseCategories.Transport,
        expenseCategories.Entertainment,
        expenseCategories.Other
    ];
    expenseChart.update();
}
