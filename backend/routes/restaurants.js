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
const authenticateMiddleWare = require("../middleware/auth");

//Public routes
router.route("/login").post(loginRestaurant);
router.route("/register").post(registerRestaurant);

// protected routes
router.route("/get/:id").get(authenticateMiddleWare, getRestaurantById);
router.route("/get").get(authenticateMiddleWare, getAllRestaurants);
router.route("/delete/:id").delete(authenticateMiddleWare, deleteRestaurant);
router
  .route("/update/:id")
  .patch(authenticateMiddleWare, updateRestaurantDetails);

module.exports = router;
