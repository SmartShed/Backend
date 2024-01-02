const router = require("express").Router();

const { users, deleteUsers } = require("../controllers/userController");
const { faq, faqs } = require("../controllers/smartShedControllers/faqs");
const { searchForms } = require("../controllers/searchController");

router.get("/users", users);
router.post("/delete/users", deleteUsers);

router.post("/faq", faq);
router.get("/faqs/:position", faqs);

router.get("/search", searchForms);

module.exports = router;
