const express = require('express');
const authRoutes = require('../v1/authentication/auth');
const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));


/**
 * GET v1/auth
 */
router.use('/auth', authRoutes);


module.exports = router;
