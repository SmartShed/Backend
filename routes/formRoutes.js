const routes = require("express").Router();

const { formController } = require("../controllers");

routes.get("/recent/:userId", formController.recentFormController);
routes.get("/create/:formId", formController.createController);
routes.post("/createform/:formId", formController.createFormController);

module.exports = routes;
