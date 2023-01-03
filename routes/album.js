const express = require('express');
const { Album } = require('../schemas/album');
const { asyncForEach } = require('../utils/asyncForEach');
const { verifyToken } = require('./middlewares');

const router = express.Router();

router.post('/:user_id', verifyToken, async (req, res, next) => {
  try {
    const albums = await Album.find({
      owner: req.params.user_id
    });
    if(albums.length >= 100) {
      return res.status(500).json("앨범은 최대 100개까지만 등록이 가능합니다.");
    }
    await asyncForEach(req.body.selectedAlbum, async (album) => {
      const userAlbum = await Album.create(
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

router.get('/:user_id', verifyToken, async (req, res, next) => {
  try {
    const albums = await Album.find({
      owner: req.params.user_id
    });
    return res.json(albums);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.delete('/:album_id', verifyToken, async (req, res, next) => {
  try {
    const album = await Album.remove({
      _id: req.params.album_id
    });
    return res.json(`정상적으로 삭제되었습니다. ${album}`);
  } catch(err) {
    return res.status(500).json(err);
  }
});

router.patch('/:album_id', verifyToken, async (req, res, next) => {
  try {
    console.log(req.body);
    const album = await Album.update({
      _id: req.params.album_id
    }, {
      description: req.body.album.description,
      score: req.body.album.score
    });
    return res.json(album);
  } catch(err) {
    return res.status(500).json(err);
  }
});

module.exports = router;