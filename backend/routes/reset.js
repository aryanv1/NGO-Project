const express = require('express');
const router = express.Router();
const { createReset, applyReset } = require('../controller/resetcontroller');

router.post('/api/reset-password', createReset);
router.post('/api/reset-password/confirm', applyReset);

module.exports = router;
