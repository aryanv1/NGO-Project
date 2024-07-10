const express = require("express");
const router = express.Router();
const {
  authenticationMiddleware,
  authenticateMiddleWare_for_ngo,
  authenticateMiddleWare_for_restaurant,
} = require("../middleware/auth");

const {
  createFoodTransaction,
  getAvailableFoodTransactions,
  getAllFoodLogs,
  claimFoodTransaction,
  createFoodTransactionLog,
  getLogsofNGO,
  getLogsofRestaurant,
  getTransactionsOfNGO,
  getTransactionsOfRestaurant,
} = require("../controller/foodTransaction");

// To see all logs details
router.route("/getallfoodlogs").get(getAllFoodLogs);


router.route("/foodlogs/ngo").get(authenticateMiddleWare_for_ngo, getLogsofNGO);
router
  .route("/foodlogs/restaurant")
  .get(authenticateMiddleWare_for_restaurant, getLogsofRestaurant);

// food transactions details
router.route("/create").post(authenticateMiddleWare_for_restaurant, createFoodTransaction);
router
  .route("/available")
  .get(authenticateMiddleWare_for_ngo, getAvailableFoodTransactions);

// Records
router
  .route("/foodtransactions/ngo")
  .get(authenticateMiddleWare_for_ngo, getTransactionsOfNGO);
router
  .route("/foodtransactions/restaurant")
  .get(authenticateMiddleWare_for_restaurant, getTransactionsOfRestaurant);

// Claim button functionality.
router
  .route("/claimstatusupdate")
  .patch(authenticateMiddleWare_for_ngo, claimFoodTransaction);

// Completion form
router
  .route("/verifycompletion")
  .post(authenticateMiddleWare_for_ngo, createFoodTransactionLog);

module.exports = router;
