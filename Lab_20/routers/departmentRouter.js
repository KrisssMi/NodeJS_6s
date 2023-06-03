const express = require("express");
const departmentController = require("../controllers/departmentController");
const departmentRouter = express.Router();

departmentRouter.get("/all", departmentController.getAllDep);
departmentRouter.get("/add", departmentController.getAddPageDep);
departmentRouter.get("/update/:idDep", departmentController.getUpdatePage);
departmentRouter.post("/", departmentController.getDepartmentByBodyId);
departmentRouter.get("/:idDep", departmentController.getDepartmentById);

departmentRouter.post("/add", departmentController.addDepartment);
departmentRouter.put("/update/:idDep", departmentController.updateDepartment);
departmentRouter.delete("/delete/:idDep", departmentController.deleteDepartment);

module.exports = departmentRouter;