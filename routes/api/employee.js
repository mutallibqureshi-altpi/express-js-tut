const express = require("express");
const router = express.Router();
const employeesController = require("../../controllers/employeesController");
const verifyJWT = require("../../middleware/verifyJWT");

const {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
} = employeesController;

router
  .route("/")
  .get(verifyJWT, getAllEmployees)
  .post(createNewEmployee)
  .put(updateEmployee)
  .delete(deleteEmployee);

router.route("/:id").get(getEmployee);

module.exports = router;
