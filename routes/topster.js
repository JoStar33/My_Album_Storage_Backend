const express = require('express');
const Topster = require('../schemas/topster');

const router = express.Router();


router.get('/:user_id', async (req, res, next) => {
  try {
    const topsters = await Topster.find({
      owner: req.params.user_id
    });
    return res.json(topsters);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

module.exports = router;