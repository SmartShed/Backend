const router = require("express").Router();

const { users, deleteUsers } = require("../controllers/userController");
const { faq, faqs } = require("../controllers/smartShedControllers/faqs");

router.get("/users", users);
router.post("/delete/users", deleteUsers);

router.post("/faq", faq);
router.get("/faqs/:position", faqs);

module.exports = router;
