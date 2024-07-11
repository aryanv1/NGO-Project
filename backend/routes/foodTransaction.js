const express = require("express");
const router = express.Router();
const {
  authenticateMiddleWare_for_ngo,
  authenticateMiddleWare_for_restaurant,
  authenticateMiddleWare_for_volunteer
} = require("../middleware/auth");

const {
  createFoodTransaction,
  getAvailableFoodTransactions_NGO,
  claimFoodTransaction,
  createFoodTransactionLog,
  getLogsofNGO,
  getLogsofRestaurant,
  getLogsofVolunteer,
  getTransactionsOfNGO,
  getTransactionsOfRestaurant,
  deleteFoodRequest,
  getPendingFoodTransactions_restaurant
} = require("../controller/foodTransaction");

router.route("/foodlogs/ngo").get(authenticateMiddleWare_for_ngo, getLogsofNGO);
router
  .route("/foodlogs/restaurant")
  .get(authenticateMiddleWare_for_restaurant, getLogsofRestaurant);
  router.route("/foodlogs/volunteer").get(authenticateMiddleWare_for_volunteer, getLogsofVolunteer);

// food transactions details
router.route("/create").post(authenticateMiddleWare_for_restaurant, createFoodTransaction);
router
  .route("/available")
  .get(authenticateMiddleWare_for_ngo, getAvailableFoodTransactions_NGO);

// Records
router
  .route("/foodtransactions/ngo")
  .get(authenticateMiddleWare_for_ngo, getTransactionsOfNGO);
router
  .route("/foodtransactions/restaurant/pending")
  .get(authenticateMiddleWare_for_restaurant, getPendingFoodTransactions_restaurant);

  router
  .route("/foodtransactions/restaurant/claimed")
  .get(authenticateMiddleWare_for_restaurant, getTransactionsOfRestaurant);

// Delete a request 
router.route('/delete').delete(authenticateMiddleWare_for_restaurant,deleteFoodRequest);
// Claim button functionality.
router
  .route("/claimstatusupdate")
  .patch(authenticateMiddleWare_for_ngo, claimFoodTransaction);

// Completion form
router
  .route("/verifycompletion")
  .post(authenticateMiddleWare_for_ngo, createFoodTransactionLog);

module.exports = router;
