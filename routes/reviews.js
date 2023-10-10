const express = require('express');
const router = express.Router(); 
const reviewController = require('../controllers/review_controller');

router.post('/newReview/:id' , reviewController.newReview);

module.exports = router;