const express = require('express');
const router = express.Router();
const { register, login, getUsers, getMe } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/users', auth, getUsers);
router.get('/me', auth, getMe);

module.exports = router;