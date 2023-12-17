const db = require("../db");
const argon2 = require("argon2");

const renderLogin = (req, res) => {
  req.session.destroy();
  res.render("login");
};

const loginRequest = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    req.session.message = "Please enter email and password";
    res.redirect("/login");
    return;
  }

  const sql = `SELECT * FROM users WHERE email = ?`;
  db.query(sql, [email], async (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      req.session.message = "Account not found";
      return res.redirect("/login");
    }

    if (result.length > 0) {
      const user = result[0];
      try {
        if (await argon2.verify(user.password, password)) {
          req.session.user = user;
          res.redirect("/");
        } else {
          req.session.message = "Incorrect password";
          res.redirect("/login");
        }
      } catch (err) {
        console.error(err);
        res.redirect("/login");
      }
    } else {
      res.redirect("/login");
    }
  });
};

const renderRegister = (req, res) => {
  req.session.destroy();
  res.render("register");
};

const registerRequest = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    if (!name) {
      req.session.message = "Name is required";
    }
    if (!email) {
      req.session.message = "Email is required";
    }
    if (!password) {
      req.session.message = "Password is required";
    }
    return res.redirect("/register");
  }

  try {
    const hashedPassword = await argon2.hash(password);
    const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) throw err;

      req.session.message = "Register success";
      req.session.user = {
        id: result.insertId,
        name,
        email,
      };
      res.redirect("/");
    });
  } catch (err) {
    console.error(err);
    res.redirect("/register");
  }
};

const logoutRequest = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};

module.exports = {
  renderLogin,
  loginRequest,
  renderRegister,
  registerRequest,
  logoutRequest,
};
