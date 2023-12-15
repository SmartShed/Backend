const router = require("express").Router();

const { users, deleteUsers } = require("../controllers/userController");

router.get("/users", users);

router.post("/delete/users", deleteUsers);

module.exports = router;
