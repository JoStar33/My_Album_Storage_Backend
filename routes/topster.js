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

router.patch('/:topster_id', async (req, res, next) => {
  try {
    const updateTopster = await Topster.updateOne({
      _id: req.params.topster_id
    },  {
      name: req.body.topster.name,
      type: req.body.topster.type,
      albums: req.body.topster.albums,
    });
    console.log(updateTopster);
    return res.status(200).json(updateTopster);
  } catch (err) {
    res.status(500).json('내부오류 발생!');
  }
})

module.exports = router;