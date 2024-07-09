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
const {authenticateMiddleWare} = require('../middleware/auth');

router.route("/login").post(adminlogin);
router.route("/verifyngo").post(authenticateMiddleWare,verifyngo);
router.route("/verifyvolunteer").post(authenticateMiddleWare,verifyVolunteer);
router.route("/verifyrestaurant").post(authenticateMiddleWare,verifyRestaurant);
router.route("/getallunverifiedngos").get(authenticateMiddleWare,getAllUnverifiedNGOs);
router.route("/getallunverifiedvolunteers").get(authenticateMiddleWare,getAllUnverifiedVolunteers);
router.route("/getallunverifiedrestaurants").get(authenticateMiddleWare,getAllUnverifiedRestaurants);

module.exports = router;
