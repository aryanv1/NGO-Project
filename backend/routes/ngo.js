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
const authenticateMiddleWare = require("../middleware/auth");

// Route for registering a new NGO
router.route("/register").post(registerNGO);
router.route("/login").post(loginNGO);
router.route("/get").get(getAllngos);

router
  .route("/get/:id")
  .get(authenticateMiddleWare, getNGOById)
  .delete(authenticateMiddleWare, deleteNGO)
  .patch(authenticateMiddleWare, updateNGODetails);

module.exports = router;
