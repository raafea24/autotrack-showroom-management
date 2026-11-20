const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET must be set before starting the server.');
}

app.use(cors());
app.use(express.json());

// Register public users as active customers.
app.post('/register', async (req, res) => {
  const { fname, lname, username, password, email } = req.body;

  if (!fname || !lname || !username || !password || !email) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  db.query(
    'SELECT * FROM user WHERE username = ? OR email = ?',
    [username, email],
    async (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      if (results.length > 0) {
        return res.status(400).json({ message: 'Username or email already exists' });
      }

      const hashed = await bcrypt.hash(password, 10);
      db.query(
        'INSERT INTO user (fname, lname, username, password, email, role, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [fname, lname, username, hashed, email, 'customer', 'active'],
        (err) => {
          if (err) return res.status(500).json({ message: 'Registration failed' });
          res.status(201).json({ message: 'Registered successfully' });
        }
      );
    }
  );
});

// ✅ Login Route with role in JWT and response
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  db.query('SELECT * FROM user WHERE username = ?', [username], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      role: user.role,
    });
  });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
