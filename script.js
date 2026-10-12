
"use strict";

// 1. Select HTML elements.
const budgetForm = document.getElementById("budgetForm");
const budgetInput = document.getElementById("budgetInput");
const expenseForm = document.getElementById("expenseForm");
const expenseNameInput = document.getElementById("expenseName");
const expenseAmountInput = document.getElementById("expenseAmount");
const expenseCategoryInput = document.getElementById("expenseCategory");

const budgetDisplay = document.getElementById("budgetDisplay");
const totalDisplay = document.getElementById("totalDisplay");
const balanceDisplay = document.getElementById("balanceDisplay");
const expenseTableBody = document.getElementById("expenseTableBody");
const expenseCount = document.getElementById("expenseCount");
const feedback = document.getElementById("feedback");
const clearButton = document.getElementById("clearButton");

// 2. Define localStorage keys and default data.
const BUDGET_KEY = "spendwiseBudget";
const EXPENSES_KEY = "spendwiseExpenses";
const DEFAULT_BUDGET = 10000;

// 3. Load saved data safely.
function loadBudget() {
    try {
        const savedBudget = localStorage.getItem(BUDGET_KEY);

        if (savedBudget === null) {
            return DEFAULT_BUDGET;
        }

        const budget = Number(savedBudget);

        if (Number.isFinite(budget) && budget > 0) {
            return budget;
        }

        return DEFAULT_BUDGET;
    } catch (error) {
        console.error("Could not load budget:", error);
        return DEFAULT_BUDGET;
    }
}

function loadExpenses() {
    try {
        const savedExpenses = localStorage.getItem(EXPENSES_KEY);

        if (savedExpenses === null) {
            return [];
        }

        const records = JSON.parse(savedExpenses);

        if (!Array.isArray(records)) {
            return [];
        }

        // Use a loop to validate saved records.
        const validRecords = [];

        for (const expense of records) {
            if (
                expense !== null &&
                typeof expense === "object" &&
                Number.isSafeInteger(expense.id) &&
                expense.id > 0 &&
                typeof expense.name === "string" &&
                expense.name.trim() !== "" &&
                typeof expense.category === "string" &&
                typeof expense.amount === "number" &&
                Number.isFinite(expense.amount) &&
                expense.amount > 0
            ) {
                validRecords.push(expense);
            }
        }

        return validRecords;
    } catch (error) {
        console.error("Could not load expenses:", error);
        return [];
    }
}

let budget = loadBudget();
let expenses = loadExpenses();

let nextId = expenses.reduce(function(maxId, expense) {
    return Math.max(maxId, expense.id);
}, 0) + 1;

// 4. Save data to localStorage.
function saveData() {
    try {
        localStorage.setItem(BUDGET_KEY, String(budget));
        localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
        return true;
    } catch (error) {
        console.error("Could not save SpendWise data:", error);
        showFeedback(
            "Your changes could not be saved in this browser.",
            "error"
        );
        return false;
    }
}

// 5. Format currency.
function formatMoney(amount) {
    return "KSh " + amount.toLocaleString("en-KE", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}

// 6. Display feedback using conditional styling.
function showFeedback(text, type = "") {
    feedback.textContent = text;
    feedback.className = type;
}

// 7. Calculate total expenses using a loop.
function calculateTotalExpenses() {
    let total = 0;

    for (const expense of expenses) {
        total += expense.amount;
    }

    return total;
}

// 8. Make decisions based on the budget.
function updateBudgetMessage(total, remaining) {
    if (total > budget) {
        showFeedback(
            "Warning: You have exceeded your budget by " +
            formatMoney(total - budget) + ".",
            "error"
        );
    } else if (total === budget) {
        showFeedback(
            "You have used your entire budget.",
            "error"
        );
    } else if (budget > 0 && total >= budget * 0.8) {
        showFeedback(
            "Caution: You have used at least 80% of your budget. " +
            formatMoney(remaining) + " remains.",
            "error"
        );
    } else {
        showFeedback(
            "Your spending is within budget. Keep it up!",
            "success"
        );
    }
}

// 9. Update multiple dashboard elements.
function updateDashboard() {
    const total = calculateTotalExpenses();
    const remaining = budget - total;

    budgetDisplay.textContent = formatMoney(budget);
    totalDisplay.textContent = formatMoney(total);
    balanceDisplay.textContent = formatMoney(remaining);

    if (remaining < 0) {
        balanceDisplay.className = "over-budget";
    } else {
        balanceDisplay.className = "within-budget";
    }

    expenseCount.textContent =
        "You have " + expenses.length +
        (expenses.length === 1 ? " expense." : " expenses.");

    updateBudgetMessage(total, remaining);
}

// 10. Display expense records using a loop.
function renderExpenses() {
    expenseTableBody.replaceChildren();

    if (expenses.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 4;
        cell.textContent = "No expenses added yet.";

        row.appendChild(cell);
        expenseTableBody.appendChild(row);
        return;
    }

    for (const expense of expenses) {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        const categoryCell = document.createElement("td");
        const amountCell = document.createElement("td");
        const actionCell = document.createElement("td");

        nameCell.textContent = expense.name;
        categoryCell.textContent = expense.category;
        amountCell.textContent = formatMoney(expense.amount);

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.textContent = "Remove";
        removeButton.className = "remove-button";
        removeButton.setAttribute(
            "aria-label",
            "Remove " + expense.name
        );

        removeButton.addEventListener("click", function() {
            removeExpense(expense.id);
        });

        actionCell.appendChild(removeButton);

        row.append(
            nameCell,
            categoryCell,
            amountCell,
            actionCell
        );

        expenseTableBody.appendChild(row);
    }
}

// 11. Add a new expense.
expenseForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = expenseNameInput.value.trim();
    const amountText = expenseAmountInput.value;
    const amount = Number(amountText);
    const category = expenseCategoryInput.value;

    if (name === "") {
        showFeedback("Please enter an expense name.", "error");
        return;
    }

    if (
        amountText.trim() === "" ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {
        showFeedback(
            "Enter an expense amount greater than zero.",
            "error"
        );
        return;
    }

    if (category === "") {
        showFeedback("Please select an expense category.", "error");
        return;
    }

    expenses.push({
        id: nextId++,
        name: name,
        amount: amount,
        category: category
    });

    saveData();
    renderExpenses();
    updateDashboard();

    expenseForm.reset();
});

// 12. Save a new monthly budget.
budgetForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const amountText = budgetInput.value;
    const newBudget = Number(amountText);

    if (
        amountText.trim() === "" ||
        !Number.isFinite(newBudget) ||
        newBudget <= 0
    ) {
        showFeedback(
            "Your monthly budget must be greater than zero.",
            "error"
        );
        return;
    }

    budget = newBudget;

    if (saveData()) {
        showFeedback("Monthly budget saved successfully.", "success");
    }

    updateDashboard();
});

// 13. Remove one expense.
function removeExpense(id) {
    expenses = expenses.filter(function(expense) {
        return expense.id !== id;
    });

    saveData();
    renderExpenses();
    updateDashboard();
}

// 14. Clear all expenses.
clearButton.addEventListener("click", function() {
    if (expenses.length === 0) {
        showFeedback("There are no expenses to clear.", "error");
        return;
    }

    const confirmed = window.confirm(
        "Are you sure you want to delete all expenses?"
    );

    if (!confirmed) {
        return;
    }

    expenses = [];

    saveData();
    renderExpenses();
    updateDashboard();

    showFeedback("All expenses have been cleared.", "success");
});

// 15. Display saved data when the page opens.
budgetInput.value = String(budget);

renderExpenses();
updateDashboard();
