const { ListItem, validateItem } = require("../models/listItem");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

// Get a set of tasks similar to query parameter.
router.get('/task', async (req, res) => {
	const searchKeyword = req.query.q;
	const listItem = await ListItem.find(
			{ "taskName": { $regex: '.*' + searchKeyword + '.*',
							$options: 'i'  }
			}, function(err,res){
			}).select('taskName').limit(5).exec().then(doc => {
			    res.send(doc); // <-- returns a pending promise
			});
});

// Get a particular list item
router.get('/:id', async (req, res) => {
  const listItem = await ListItem.findById(req.params.id);
  res.send(listItem);
});


module.exports = router;
