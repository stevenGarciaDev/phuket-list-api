const { TaskGroup } = require('../models/taskgroup');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

// Get group members by group ID
router.get('/members/:id', auth, async (req, res) => {
  // TODO: Get all members from a group by params.id
});

// Get group member by user ID
router.get('/members/:id/:user_id', auth, async (req, res) => {
  // TODO: Get member params.user_id if exists from group params.id
});

module.exports = router;