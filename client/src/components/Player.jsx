import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  SetCurrentSong,
  SetCurrentSongIndex,
  SetCurrentTime,
  SetIsPlaying,
} from "../redux/usersSlice";
//import SongsList from "./SongsList";

function Player() {
  const [volume, setVolume] = useState(0.5);
  const [shuffleOn, setShuffleOn] = useState(false);
  const dispatch = useDispatch();
  const audioRef = React.createRef();
  const {
    currentSong,
    allSongs,
    selectedPlaylist,
    currentSongIndex,
    isPlaying,
    currentTime,
  } = useSelector((state) => {
    return state.users;
  });
  const onPause = () => {
    audioRef.current.pause();
    dispatch(SetIsPlaying(false));
  };
  const onPlay = () => {
    audioRef.current.play();
    dispatch(SetIsPlaying(true));
  };

  const onPrev = () => {
    if (currentSongIndex !== 0 && !shuffleOn) {
      dispatch(SetCurrentSongIndex(currentSongIndex - 1));
      dispatch(SetCurrentSong(selectedPlaylist.songs[currentSongIndex - 1]));
    } else {
      if (shuffleOn) {
        const randomIndex = Math.floor(
          Math.random() * selectedPlaylist.songs.length
        );
        dispatch(SetCurrentSongIndex(randomIndex));
        dispatch(SetCurrentSong(selectedPlaylist.songs[randomIndex]));
      } else {
        dispatch(SetCurrentSongIndex(selectedPlaylist.songs.length - 1));
        dispatch(
          SetCurrentSong(
            selectedPlaylist.songs[selectedPlaylist.songs.length - 1]
          )
        );
      }
    }
  };

  const onNext = () => {
    if (currentSongIndex !== selectedPlaylist.songs.length - 1 && !shuffleOn) {
      dispatch(SetCurrentSongIndex(currentSongIndex + 1));
      dispatch(SetCurrentSong(selectedPlaylist.songs[currentSongIndex + 1]));
    } else {
      if (shuffleOn) {
        const randomIndex = Math.floor(
          Math.random() * selectedPlaylist.songs.length
        );
        dispatch(SetCurrentSongIndex(randomIndex));
        dispatch(SetCurrentSong(selectedPlaylist.songs[randomIndex]));
      } else {
        dispatch(SetCurrentSongIndex(0));
        dispatch(SetCurrentSong(selectedPlaylist.songs[0]));
      }
    }
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.play();
    }
  }, [currentSong]);

  useEffect(() => {
    if (!currentSong && selectedPlaylist) {
      dispatch(SetCurrentSong(selectedPlaylist.songs[0]));
    }
  }, [selectedPlaylist]);

  useEffect(() => {
    if (currentTime) {
      audioRef.current.currentTime = currentTime;
    }
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 p-1 shadow-lg bg-white">
      <div className="flex justify-between items-center border p-1 border-green-500 rounded shadow-xl">
        <div className="flex items-center gap-2 w-96">
          <img
            className="h-12 w-32"
            src="https://www.pngimages.pics/images/quotes/english/general/music-symbol-png-clipart-52650-297684.png"
            alt=""
          />
          <div>
            <h1 className={`text-active text-sm`}>{currentSong?.title}</h1>
            <h1 className="text-secondary text-sm">
              {currentSong?.artist} , {currentSong?.album} , {currentSong?.year}
            </h1>
          </div>
        </div>

        <div className="w-96 flex flex-col items-center">
          <audio
            src={currentSong?.src}
            ref={audioRef}
            onTimeUpdate={(e) => {
              dispatch(SetCurrentTime(e.target.currentTime));
            }}
          ></audio>
          <div className="flex gap-10 items-center">
            <i
              className="ri-skip-back-line text-2xl text-gray-500"
              onClick={onPrev}
            ></i>

            {isPlaying ? (
              <i
                className="ri-pause-line text-2xl text-white bg-gray-500 rounded-2xl p-1"
                onClick={onPause}
              ></i>
            ) : (
              <i
                className="ri-play-line text-2xl text-white bg-gray-500 rounded-2xl p-1"
                onClick={onPlay}
              ></i>
            )}

            <i
              className="ri-skip-forward-line text-2xl text-gray-500"
              onClick={onNext}
            ></i>
          </div>
          <div className="flex gap-3 items-center w-full">
            <i
              className={`ri-shuffle-line text-lg ${
                shuffleOn && "text-orange-500 font-semibold"
              }`}
              onClick={() => {
                setShuffleOn(!shuffleOn);
              }}
            ></i>
            <h1>
              {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60)}
            </h1>
            <input
              type="range"
              className="p-0 w-full"
              min={0}
              max={(parseInt(currentSong?.duration) * 60).toString(10)}
              value={currentTime}
              onChange={(e) => {
                audioRef.current.currentTime = e.target.value;
                dispatch(SetCurrentTime(e.target.value));
              }}
            />
            <h1>{currentSong?.duration}</h1>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <i
            className="ri-volume-mute-line text-2xl text-gray-500"
            onClick={() => {
              setVolume(0);
              audioRef.current.volume = 0;
            }}
          ></i>
          <input
            type="range"
            className="p-0 h-3"
            min={0}
            max={1}
            step={0.1}
            value={volume}
            onChange={(e) => {
              audioRef.current.volume = e.target.value;
              setVolume(e.target.value);
            }}
          />
          <i
            className="ri-volume-down-line text-2xl text-gray-500"
            onClick={() => {
              setVolume(1);
              audioRef.current.volume = 1;
            }}
          ></i>
        </div>
      </div>
    </div>
  );
}

export default Player;
