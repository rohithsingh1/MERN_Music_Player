const express = require("express");
const router = express.Router();
const multer = require("multer");
const authMiddleware = require('../middlewares/authMiddleware');
const { cloudinary } = require('../cloudinary');
const Song=require("../models/songModel");


const storage=multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null,'./uploads/')
    },
    filename: function(req, file, cb) {
        cb(null,file.originalname)
    }
})

const upload=multer({storage: storage})

router.post('/add-song', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        console.log('req.file.path = ',req.file.path)
        cloudinary.uploader.upload(
            req.file.path, {
                folder: 'music-folder',
                use_filename: true,
                resource_type : 'raw'
        },
            async (err, result) => {
                if(err) {
                    console.log('err in cloudinary == ', err)
                     res.status(500).json({ message: "Something went wrong" });
                } else {
                    const newSong=new Song({
                        title: req.body.title,
                        artist: req.body.artist,
                        src: result.url,
                        album: req.body.album,
                        duration: req.body.duration,
                        year: req.body.year,
                    })
                    await newSong.save()
                    const allSongs=await Song.find();
                    if(allSongs) {
                        return res.status(200).send({
                            message: 'Song Added successfully',
                            success: true,
                            data: allSongs,
                            token: null
                        })
                    } else {
                        return res.status(200).send({
                            message: 'fetching the songs failed',
                            success: false,
                            data: null,
                            token: null
                        })
                    }
                }
            }
        )
    } catch(error) {
        console.log('error = ',error);
        res.status(500).send({
            message: 'error uploading the song',
            success: false,
            data: error,
            token : null
        })
    }
})

router.post('/edit-song',authMiddleware, upload.single('file'), async (req, res) => {
    try {
        let response = null
        if(req.file) {
            response=await cloudinary.uploader.upload(req.file.path, {
                folder: 'music-folder',
                use_filename: true,
                resource_type : 'raw'
            })
        }
        console.log('response = ', response)
        await Song.findByIdAndUpdate(req.body._id, {
            title: req.body.title,
            artist: req.body.artist,
            src: response ? response.url : req.body.src,
            album: req.body.album,
            duration: req.body.duration,
            year: req.body.year,
        })
        const allSongs=await Song.find()
        return res.status(200).send({
            message: 'Song updated successfully',
            success: true,
            data: allSongs,
            token : null
        })
    } catch (error) {
        return res.status(500).send({
            message: 'updating the song failed',
            success: false,
            data: error,
            token : null
        })
    }
})

module.exports = router






















