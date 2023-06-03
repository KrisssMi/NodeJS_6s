const express = require("express");
const officialInformationController = require("../controllers/officialInformationController");
const officialInformationRouter = express.Router();

officialInformationRouter.get("/all", officialInformationController.getAllInformation);
officialInformationRouter.get("/add", officialInformationController.getAddPage);
officialInformationRouter.get("/update/:idEmployee", officialInformationController.getUpdatePage);
officialInformationRouter.get("/:idEmployee", officialInformationController.getInformationById);
officialInformationRouter.post("/", officialInformationController.getInformationByBodyId);

officialInformationRouter.post("/add", officialInformationController.addInformation);
officialInformationRouter.put("/update/:idEmployee", officialInformationController.updateInformation);
officialInformationRouter.delete("/delete/:idEmployee", officialInformationController.deleteInformation);

module.exports = officialInformationRouter;