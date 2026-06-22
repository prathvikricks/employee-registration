const form = document.querySelector("#employee-form");
const message = document.querySelector("#message");
const list = document.querySelector("#employee-list");
const count = document.querySelector("#count");

function displayMessage(text, type = "") {
  message.textContent = text;
  message.className = type;
}

function addCell(row, text) {
  const cell = document.createElement("td");
  cell.textContent = text;
  row.append(cell);
}

async function loadEmployees() {
  try {
    const response = await fetch("/api/employees");
    if (!response.ok) throw new Error();
    const employees = await response.json();
    list.replaceChildren();
    employees.forEach((employee) => {
      const row = document.createElement("tr");
      addCell(row, `${employee.first_name} ${employee.last_name}`);
      addCell(row, employee.email);
      addCell(row, employee.department);
      addCell(row, employee.job_title);
      list.append(row);
    });
    count.textContent = `${employees.length} total`;
  } catch {
    displayMessage("Could not load employees. Check that the API is running.", "error");
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = form.querySelector("button");
  button.disabled = true;
  displayMessage("Saving…");
  try {
    const response = await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form)))
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    form.reset();
    displayMessage("Employee registered.", "success");
    loadEmployees();
  } catch (error) {
    displayMessage(error.message || "Registration failed.", "error");
  } finally {
    button.disabled = false;
  }
});

loadEmployees();
