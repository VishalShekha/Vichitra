const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "mydb",
  password: "root",
  port: 32773,
});

app.post("/api/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    const userExists = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
      username,
      hashedPassword,
    ]);

    res.json({ message: "User created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    const user = result.rows[0];
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    res.json({ message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Example: table name is `passwords`
// Columns: id (serial), website (text), username (text), password (text)

app.get("/api/passwords", async (req, res) => {
  const result = await pool.query("SELECT * FROM passwords ORDER BY id");
  res.json(result.rows);
});

app.post("/api/passwords", async (req, res) => {
  const { website, username, password } = req.body;
  await pool.query(
    "INSERT INTO passwords (website, username, password) VALUES ($1, $2, $3)",
    [website, username, password]
  );
  res.status(201).json({ message: "Password entry added" });
});

app.put("/api/passwords/:id", async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;
  await pool.query(
    "UPDATE passwords SET username = $1, password = $2 WHERE id = $3",
    [username, password, id]
  );
  res.json({ message: "Password entry updated" });
});

app.delete("/api/passwords/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM passwords WHERE id = $1", [id]);
  res.json({ message: "Password entry deleted" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
