const express = require("express");
const router = express.Router();

const {
  createVolunteer,
  getAllVolunteers,
  getVolunteerById,
  updateVolunteerById,
  updateVolunteerAvailability,
  deleteVolunteerById,
  loginVolunteer,
  getAvailableVolunteers,
} = require("../controller/volunteer");
const authenticateMiddleWare = require("../middleware/auth");

// Routes for volunteer.
router.route("/create").post(createVolunteer);
router.route("/login").post(loginVolunteer);

router.route("/getallvolunteers").get(authenticateMiddleWare, getAllVolunteers);
router.route("/getallvolunteers/available").get(authenticateMiddleWare, getAvailableVolunteers);
router
  .route("/:id")
  .get(authenticateMiddleWare, getVolunteerById)
  .delete(authenticateMiddleWare, deleteVolunteerById)
  .patch(authenticateMiddleWare, updateVolunteerById);
router
  .route("/updateavailabilitymode/:id")
  .patch(authenticateMiddleWare, updateVolunteerAvailability);

module.exports = router;
