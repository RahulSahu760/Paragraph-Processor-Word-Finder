const bcrypt = require("bcrypt");
const db = require("../database");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const registerUser = async (req, res) => {
  try {
    const { name, email, password, dob } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO users (name, email, password, dob) VALUES ($1, $2, $3, $4) RETURNING id, name, email, dob;`;
    const values = [name, email, hashPassword, dob];
    const result = await db.query(query, values);

    const newUser = result.rows[0];
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "An error occurred while registering user" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const query = `SELECT * FROM users WHERE email = $1;`;
    const values = [email];
    const result = await db.query(query, values);

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "An error occurred while logging in" });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token").json({ message: "Logged out successfully" });
};

module.exports = { registerUser, loginUser, logoutUser };
