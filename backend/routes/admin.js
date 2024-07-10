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
  getAllngos,
  getAllVolunteers,
  getAllRestaurants,
  deleteVolunteerById,
  deleteRestaurantById
} = require("../controller/admin");
const {authenticateMiddleWare} = require('../middleware/auth');

router.route("/login").post(adminlogin);
router.route("/verifyngo").post(authenticateMiddleWare,verifyngo);
router.route("/verifyvolunteer").post(authenticateMiddleWare,verifyVolunteer);
router.route("/verifyrestaurant").post(authenticateMiddleWare,verifyRestaurant);
router.route("/getallunverifiedngos").get(authenticateMiddleWare,getAllUnverifiedNGOs);
router.route("/getallunverifiedvolunteers").get(authenticateMiddleWare,getAllUnverifiedVolunteers);
router.route("/getallunverifiedrestaurants").get(authenticateMiddleWare,getAllUnverifiedRestaurants);
router.route('/getallngos').get(authenticateMiddleWare,getAllngos);
router.route('/getallvolunteers').get(authenticateMiddleWare,getAllVolunteers);
router.route('/getallrestaurants').get(authenticateMiddleWare,getAllRestaurants);
router.route('/deletevolunteer/:id').delete(authenticateMiddleWare,deleteVolunteerById);
router.route('/deleterestaurant/:id').delete(authenticateMiddleWare,deleteRestaurantById);

module.exports = router;
