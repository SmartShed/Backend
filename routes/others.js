const router = require("express").Router();

const { users } = require("../controllers/userController");

router.get("/users", users);

module.exports = router;
