const express = require("express");
const router = express.Router();
const {
  createReset,
  verifyReset,
  applyReset,
} = require("../controller/resetcontroller");

router.route('/sendmail').post(createReset);
router.route('/checkotp').post(verifyReset);
router.route('/updatepassword').post(applyReset);

module.exports = router;
