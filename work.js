document.addEventListener('DOMContentLoaded', function() {
    const expenseForm = document.getElementById('expense-form');
    const budgetForm = document.getElementById('budget-form');
    const expenseList = document.getElementById('expense-list');
    const totalBudgetEl = document.getElementById('total-budget');
    const totalExpensesEl = document.getElementById('total-expenses');
    const remainingBudgetEl = document.getElementById('remaining-budget');
    const ctx = document.getElementById('expenseChart').getContext('2d');

    let totalBudget = 0;
    let totalExpenses = 0;
    let expenses = [];

    const categories = {
        Food: 0,
        Transport: 0,
        Entertainment: 0,
        Bills: 0,
        Others: 0
    };

    let myPieChart;

    expenseForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const description = document.getElementById('description').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;

        if (!isNaN(amount)) {
            addExpense(description, amount, category);
            expenseForm.reset();
        } else {
            alert("Please enter a valid number for the amount.");
        }
    });

    budgetForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const budgetInput = parseFloat(document.getElementById('budget').value);

        if (!isNaN(budgetInput)) {
            totalBudget = budgetInput;
            updateBudgetDisplay();
            budgetForm.reset();
        } else {
            alert("Please enter a valid number for the budget.");
        }
    });

    function addExpense(description, amount, category) {
        const expense = { description, amount, category, date: new Date() };
        expenses.push(expense);
        categories[category] += amount;
        const listItem = document.createElement('li');
        listItem.textContent = `${description}: $${amount.toFixed(2)} (${category})`;
        expenseList.appendChild(listItem);
        totalExpenses += amount;
        updateBudgetDisplay();
        updateChart();
    }

    function updateBudgetDisplay() {
        totalBudgetEl.textContent = totalBudget.toFixed(2);
        totalExpensesEl.textContent = totalExpenses.toFixed(2);
        remainingBudgetEl.textContent = (totalBudget - totalExpenses).toFixed(2);
    }

    function updateChart() {
        const data = {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0', '#9966ff'],
                hoverBackgroundColor: ['#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0', '#9966ff']
            }]
        };

        if (myPieChart) {
            myPieChart.destroy();
        }

        myPieChart = new Chart(ctx, {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                return `${label}: $${value.toFixed(2)}`;
                            }
                        }
                    }
                }
            }
        });
    }
});
