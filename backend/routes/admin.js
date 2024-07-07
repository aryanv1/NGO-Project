const express = require("express");
const router = express.Router();

const {
  adminlogin,
  verifyngo,
  verifyVolunteer,
  verifyRestaurant,
  getAllUnverifiedNGOs,
  getAllUnverifiedVolunteers,
  getAllUnverifiedRestaurants,
} = require("../controller/admin");

router.route("/login").post(adminlogin);
router.route("/verifyngo").post(verifyngo);
router.route("/verifyvolunteer").post(verifyVolunteer);
router.route("/verifyrestaurant").post(verifyRestaurant);
router.route("/getallunverifiedngos").get(getAllUnverifiedNGOs);
router.route("/getallunverifiedvolunteers").get(getAllUnverifiedVolunteers);
router.route("/getallunverifiedrestaurants").get(getAllUnverifiedRestaurants);

module.exports = router;
