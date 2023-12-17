const express = require("express");
const session = require("express-session");
const { auth } = require("./middleware/auth");
const router = require("./routes/web");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  res.locals.message = req.session.message;
  next();
});

app.get("/", auth, (req, res) => {
  res.render("index", { user: req.session.user });
});

app.use("/", router);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
