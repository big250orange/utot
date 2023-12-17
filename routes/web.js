const router = require("express").Router();
const { auth } = require("../middleware/auth");
const {
  renderLogin,
  loginRequest,
  renderRegister,
  registerRequest,
  logoutRequest,
} = require("../controllers/controller");

router.get("/login", renderLogin);
router.post("/login", loginRequest);

router.get("/register", renderRegister);
router.post("/register", registerRequest);

router.get("/logout", auth, logoutRequest);

module.exports = router;
