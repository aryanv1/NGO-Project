const express = require("express");
const router = express.Router();

const { adminlogin , verifyngo ,verifyVolunteer , verifyRestaurant} = require("../controller/admin");

router.route('/login').post(adminlogin);
router.route('/verifyngo').post(verifyngo);
router.route('/verifyvolunteer').post(verifyVolunteer);
router.route('/verifyrestaurant').post(verifyRestaurant);

module.exports = router;
