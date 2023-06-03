const express = require("express");
const personalInformationController = require("../controllers/personalInformationController");
const personalInformationRouter = express.Router();

personalInformationRouter.get("/all", personalInformationController.getAllInformation);
personalInformationRouter.get("/add", personalInformationController.getAddPage);
personalInformationRouter.get("/update/:personalNum", personalInformationController.getUpdatePage);
personalInformationRouter.get("/:personalNum", personalInformationController.getInformationById);
personalInformationRouter.post("/", personalInformationController.getInformationByBodyId);

personalInformationRouter.post("/add", personalInformationController.addInformation);
personalInformationRouter.put("/update/:personalNum", personalInformationController.updateInformation);
personalInformationRouter.delete("/delete/:personalNum", personalInformationController.deleteInformation);

module.exports = personalInformationRouter;