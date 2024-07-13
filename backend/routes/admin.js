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
  deleteRestaurantById,
  deleteNGOById,
  getAllFoodLogs,
  deleteUnverifiedNGOById,
  deleteUnverifiedVolunteerById,
  deleteUnverifiedRestaurantById,
} = require("../controller/admin");
const {authenticateMiddleWare} = require('../middleware/auth');

router.route("/login").post(adminlogin);

// To Verify 
router.route("/verifyngo").post(authenticateMiddleWare,verifyngo);
router.route("/verifyvolunteer").post(authenticateMiddleWare,verifyVolunteer);
router.route("/verifyrestaurant").post(authenticateMiddleWare,verifyRestaurant);

// To get all unverified data
router.route("/getallunverifiedngos").get(authenticateMiddleWare,getAllUnverifiedNGOs);
router.route("/getallunverifiedvolunteers").get(authenticateMiddleWare,getAllUnverifiedVolunteers);
router.route("/getallunverifiedrestaurants").get(authenticateMiddleWare,getAllUnverifiedRestaurants);

// Get all verified data
router.route('/getallngos').get(authenticateMiddleWare,getAllngos);
router.route('/getallvolunteers').get(authenticateMiddleWare,getAllVolunteers);
router.route('/getallrestaurants').get(authenticateMiddleWare,getAllRestaurants);

// Delete perticular data entry.
router.route('/deletevolunteer/:id').delete(authenticateMiddleWare,deleteVolunteerById);
router.route('/deleterestaurant/:id').delete(authenticateMiddleWare,deleteRestaurantById);
router.route('/deletengo/:id').delete(authenticateMiddleWare,deleteNGOById);

// Delete from unverified list
router.route('/deleteunverifiedvolunteer/:id').delete(authenticateMiddleWare,deleteUnverifiedVolunteerById);
router.route('/deleteunverifiedrestaurant/:id').delete(authenticateMiddleWare,deleteUnverifiedRestaurantById);
router.route('/deleteunverifiedngo/:id').delete(authenticateMiddleWare,deleteUnverifiedNGOById);

router.route('/getallfoodlogs').get(authenticateMiddleWare,getAllFoodLogs);

module.exports = router;
