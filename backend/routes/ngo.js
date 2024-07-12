const express = require("express");
const router = express.Router();

const {
  registerNGO,
  getNGOById,
  getAllngos,
  updateNGODetails,
  deleteNGO,
  loginNGO,
} = require("../controller/ngo");
const {authenticateMiddleWare_for_ngo } = require("../middleware/auth");

// Route for registering a new NGO
router.route("/register").post(registerNGO);
router.route("/login").post(loginNGO);
router.route("/get").get(getAllngos);

router.route('/updatedetails').patch(authenticateMiddleWare_for_ngo, updateNGODetails);
router
  .route("/byid")
  .get(authenticateMiddleWare_for_ngo, getNGOById)
  .delete(authenticateMiddleWare_for_ngo, deleteNGO);

module.exports = router;
