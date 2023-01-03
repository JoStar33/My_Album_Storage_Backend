const express = require('express');
const Topster = require('../schemas/topster');
const { verifyToken } = require('./middlewares');
const router = express.Router();


router.get('/:user_id', verifyToken, async (req, res, next) => {
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

router.patch('/:topster_id', verifyToken, async (req, res, next) => {
  try {
    const updateTopster = await Topster.updateOne({
      _id: req.params.topster_id
    }, {
      name: req.body.topster.name,
      type: req.body.topster.type
    });
    return res.status(200).json(updateTopster);
  } catch (err) {
    console.log(err);
    res.status(500).json('내부오류 발생!');
  }
});

router.patch('/album/:topster_id', verifyToken, async (req, res, next) => {
  try {
    const topsters = await Topster.find({ _id: req.params.topster_id});
    if(topsters[0].albums.find(album => album.position === req.body.topsterAlbum.position)){
      await Topster.updateOne({ _id: req.params.topster_id }, { 
        $pull: { albums: { position: parseInt(req.body.topsterAlbum.position) }}});
    }
    const updateTopster = await Topster.updateOne({_id: req.params.topster_id }, { 
        $push: { albums: req.body.topsterAlbum }});
    return res.status(200).json(updateTopster);
  } catch (err) {
    console.log(err);
    res.status(500).json('내부오류 발생!');
  }
});

router.delete('/album/:topster_id/:album_position', verifyToken, async (req, res, next) => {
  try {
    const updateTopster = await Topster.updateOne({
      _id: req.params.topster_id
    }, {
      $pull: {
        albums: {
          position: parseInt(req.params.album_position)
        },
      }
    });
    return res.status(200).json(updateTopster);
  } catch (err) {
    console.log(err);
    res.status(500).json('내부오류 발생!');
  }
});


module.exports = router;