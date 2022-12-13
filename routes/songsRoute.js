const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const Song = require('../models/songModel');
const User=require('../models/userModel');


router.post('/get-all-songs', authMiddleware, async (req, res) => {
    try {
        const allSongs=await Song.find()
        if(allSongs) {
            return res.status(200).send({
                message: 'songs fetched successfully',
                success: true,
                data: allSongs,
                token : null
            })
        } else {
            return res.status(200).send({
                message: 'server side error',
                success: false,
                data: null,
                token:null,
            })
        }
    } catch (error) {
        return res.status(500).send({
            message: error.message,
            success: false,
            data: error,
            token: null
        })
    }
})

router.post('/add-playlist', authMiddleware, async (req, res) => {
    try {
        const user=await User.findById(req.body.userId)
        const existingPlaylists=user.playlists
        existingPlaylists.push({
            name: req.body.name,
            songs: req.body.songs
        })
        const updatedUser=await User.findByIdAndUpdate(
            req.body.userId, {
                playlists:existingPlaylists,
        },
            {new:true}
        )
        if(updatedUser) {
            return res.status(200).send({
                message: 'Playlist created successfully',
                success: true,
                data: updatedUser,
                token : null
            })
        } else {
            return res.status(200).send({
                message: 'Playlist creation failed',
                success: false,
                data: null,
                token : null
            })
        }
    } catch (error) {
        return res.status(500).send({
                message: 'Error creating playlist',
                success: false,
                data: error,
                token : null
            })
    }
})


router.post('/update-playlist', authMiddleware, async (req, res) => {
    try {
        const user=await User.findById(req.body.userId)
        let existingPlaylists=user.playlists
        existingPlaylists=existingPlaylists.map((playlist) => {
            if(playlist.name===req.body.name) {
                playlist.songs = req.body.songs
            }
            return playlist
        })
        const updatedUser=await User.findByIdAndUpdate(
            req.body.userId, {
                playlists:existingPlaylists,
        },
            {new:true}
        )
        if(updatedUser) {
            return res.status(200).send({
                message: 'Playlist updated successfully',
                success: true,
                data: updatedUser,
                token : null
            })
        } else {
            return res.status(200).send({
                message: 'Playlist updation failed',
                success: false,
                data: null,
                token : null
            })
        }
    } catch (error) {
        return res.status(500).send({
                message: 'Error updating playlist',
                success: false,
                data: error,
                token : null
            })
    }
})


router.post('/delete-playlist', authMiddleware, async (req, res) => {
    try {
        const user=await User.findById(req.body.userId)
        let existingPlaylists=user.playlists
        existingPlaylists=existingPlaylists.filter((playlist) => {
            if(playlist.name===req.body.name) {
                return false
            }
            return true
        })
        const updatedUser=await User.findByIdAndUpdate(
            req.body.userId,
            {
                playlists : existingPlaylists
            },
            {
                new : true
            }
        )
        if(updatedUser) {
            return res.status(200).send({
                        message: "Playlist deleted successfully",
                        success: true,
                        data: updatedUser,
                        token : null
                    });
        } else {
            return res.status(200).send({
                        message: "Playlist deletion failed",
                        success: false,
                        data: null,
                        token : null
                    });
        }
    } catch (error) {
        return res.status(500).send({
                        message: "Error deleting playlist",
                        success: false,
                        data: null,
                        token : null
                    });
    }
})



module.exports = router
















