import cors from "cors";
import express from "express";
import pg from "pg";

const { Pool } = pg;
const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(cors());
app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok" });
  } catch {
    res.status(503).json({ status: "database unavailable" });
  }
});

app.get("/api/employees", async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, first_name, last_name, email, department, job_title, created_at FROM employees ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.post("/api/employees", async (req, res, next) => {
  const fields = ["firstName", "lastName", "email", "department", "jobTitle"];
  const values = fields.map((field) => String(req.body[field] || "").trim());

  if (values.some((value) => !value)) {
    return res.status(400).json({ message: "All fields are required." });
  }
  if (!/^\S+@\S+\.\S+$/.test(values[2])) {
    return res.status(400).json({ message: "Enter a valid email address." });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO employees (first_name, last_name, email, department, job_title)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, first_name, last_name, email, department, job_title, created_at`,
      values
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "An employee with this email already exists." });
    }
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: "An unexpected server error occurred." });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API listening on port ${port}`));
