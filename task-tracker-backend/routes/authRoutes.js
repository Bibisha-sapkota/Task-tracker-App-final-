const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');

// 👇 This is just for avoiding 404
router.get('/signup', (req, res) => {
  res.send('Signup page is POST only. Use POST request.');
});

router.post('/signup', signup);
router.post('/login', login);

module.exports = router;
