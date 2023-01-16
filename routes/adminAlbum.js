const express = require('express');
const { AdminAlbum } = require('../schemas/adminAlbum');
const { asyncForEach } = require('../utils/asyncForEach');
const { verifyToken } = require('./middlewares');
const router = express.Router();

router.get('/:user_id', verifyToken, async (req, res, next) => {
  try {
    const albums = await AdminAlbum.find({
      owner: req.params.user_id
    });
    return res.json(albums);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.post('/:user_id', verifyToken, async (req, res, next) => {
  try {
    const albums = await AdminAlbum.find({
      owner: req.params.user_id
    });
    if(albums.length + req.body.selectedAlbum.length > 5) {
      return res.status(500).json("앨범은 최대 5개까지만 등록이 가능합니다.");
    }
    await asyncForEach(req.body.selectedAlbum, async (album) => {
      const userAlbum = await AdminAlbum.create(
        {
          artist: album.artist,
          name: album.name,
          image: album.image,
          score: album.score,
          description: album.description,
          owner: req.params.user_id,
        }
      );
      console.log(userAlbum._id);
    });
    return res.status(200).json("success");
  } catch {
    return res.status(500).json("fail");
  }
});

module.exports = router;
