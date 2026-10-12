
# SpendWise — Interactive Budget Tracker

## Project Description

SpendWise is an interactive budgeting application that helps users
manage a monthly budget, record expenses, calculate spending totals,
and monitor their remaining balance.

The application uses HTML, CSS, and JavaScript. It updates the
dashboard dynamically and saves the budget and expenses in the
browser using localStorage.

## Features

- Set and save a monthly budget.
- Add expenses with names, amounts, and categories.
- View all recorded expenses in a table.
- Remove individual expenses.
- Clear all expenses after confirmation.
- Calculate total expenses and remaining balance.
- Receive warnings when spending reaches or exceeds the budget.
- Preserve saved data after refreshing or reopening the browser.

## JavaScript Concepts Used

### 1. Decision Making
Conditional statements validate user input and check whether
spending is within the budget, reaches 80% of the budget, or exceeds it.

### 2. Arrays and Objects
An array named `expenses` stores multiple expense records.
Each record is an object containing an ID, name, amount, and category.

### 3. Loops
`for...of` loops process expense records when calculating totals,
validating saved records, and displaying the expense table.

### 4. DOM Manipulation
JavaScript updates dashboard totals, feedback messages, expense counts,
and table rows using DOM methods.

### 5. Event Handling
`addEventListener()` responds to form submissions and button clicks.
`event.preventDefault()` prevents default form submission behavior.

### 6. Functions
Reusable functions validate, calculate, save, remove, and display data.

### 7. Browser Storage
`localStorage.setItem()` saves the budget and expense array.
`localStorage.getItem()` retrieves the saved data.
JSON methods convert expense arrays to and from strings.

## How to Run

1. Open the project folder in Visual Studio Code.
2. Ensure `index.html`, `style.css`, and `script.js` are saved.
3. Open `index.html` in a browser, preferably using Live Server.
4. Set a monthly budget.
5. Add expenses and observe the dashboard updates.
6. Refresh the browser to test data persistence.

## Conclusion

SpendWise demonstrates how JavaScript can connect user input,
decision making, arrays, loops, calculations, events, DOM
manipulation, and browser storage in one practical application.
