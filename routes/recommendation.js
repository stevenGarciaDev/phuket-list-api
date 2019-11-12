const mongoose = require("mongoose");
const { Recommendation } = require("../models/recommendation");
const express = require('express');
const router = express.Router();

router.get('/all', async (req, res) => {
  try {
    const data = await Recommendation.find();
    console.log("data", data);
    res.send(data);
  } catch (ex) {
    console.log("Unable to retrieve all recommendations", ex);
  }
});

module.exports = router;
