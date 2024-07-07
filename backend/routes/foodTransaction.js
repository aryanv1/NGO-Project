const express = require("express");
const router = express.Router();
const authenticationMiddleware = require('../middleware/auth'); 

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

// To see logs details
router.route('/foodlogs').get(getAllFoodLogs);
router.route('/foodlogs/ngo').get(authenticationMiddleware,getLogsofNGO);
router.route('/foodlogs/restaurant').get(authenticationMiddleware,getLogsofRestaurant);

// food transactions details
router.route("/create").post(authenticationMiddleware,createFoodTransaction);
router.route('/available').get(authenticationMiddleware,getAvailableFoodTransactions);
router.route('/foodtransactions/ngo').get(authenticationMiddleware,getTransactionsOfNGO);
router.route('/foodtransactions/restaurant').get(authenticationMiddleware,getTransactionsOfRestaurant);

// Claim button functionality.
router.route('/claimstatusupdate').patch(authenticationMiddleware,claimFoodTransaction);
// Completion form 
router.route('/completion').post(authenticationMiddleware,createFoodTransactionLog);


// router.route('/getDetail/:id').get(getFoodDonationById);
// router.route('/update/:id').patch(updateFoodDonation).delete(deleteFoodDonation);

module.exports = router;
