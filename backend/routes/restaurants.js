const express = require("express");
const router = express.Router();

const {
  registerRestaurant,
  getRestaurantById,
  getAllRestaurants,
  updateRestaurantDetails,
  deleteRestaurant,
  loginRestaurant,
} = require("../controller/restaurant");
const {authenticateMiddleWare ,authenticateMiddleWare_for_restaurant} = require("../middleware/auth");

//Public routes
router.route("/login").post(loginRestaurant);
router.route("/register").post(registerRestaurant);

// protected routes
router.route("/get/:id").get(authenticateMiddleWare, getRestaurantById);
router.route("/get").get(authenticateMiddleWare, getAllRestaurants);

router.route("/delete").delete(authenticateMiddleWare_for_restaurant, deleteRestaurant);
router
  .route("/updatedetails")
  .patch(authenticateMiddleWare_for_restaurant, updateRestaurantDetails);

module.exports = router;
