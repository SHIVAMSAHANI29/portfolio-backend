// routes/messageRoutes.js
// All routes here require a valid admin JWT (see middleware/authMiddleware.js)

const express = require('express');
const {
  getMessages,
  getMessageById,
  markMessageAsRead,
  deleteMessage
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // everything below requires authentication

router.get('/', getMessages);
router.get('/:id', getMessageById);
router.put('/:id/read', markMessageAsRead);
router.delete('/:id', deleteMessage);

module.exports = router;
