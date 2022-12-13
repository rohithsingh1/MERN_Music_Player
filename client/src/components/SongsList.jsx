import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SetCurrentSong,
  SetCurrentSongIndex,
  SetSelectedPlaylist,
} from "../redux/usersSlice";

function SongsList() {
  const dispatch = useDispatch();
  const { allSongs, currentSong, selectedPlaylist } = useSelector((state) => {
    return state.users;
  });
  const [songsToPlay, setSongsToPlay] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  useEffect(() => {
    if (selectedPlaylist) {
      if (
        selectedPlaylist &&
        selectedPlaylist.name === "All Songs" &&
        searchKey !== ""
      ) {
        const tempSongs = [];
        selectedPlaylist.songs.forEach((song) => {
          if (JSON.stringify(song).toLowerCase().includes(searchKey)) {
            tempSongs.push(song);
          }
        });
        console.log("tempsomgs = ", tempSongs);
        setSongsToPlay(tempSongs);
      } else {
        setSongsToPlay(selectedPlaylist?.songs);
      }
    }
  }, [selectedPlaylist, searchKey]);
  return (
    <div className="flex flex-col gap-3">
      <div className="pl-1 pr-4">
        <input
          type="text"
          placeholder="Song , Artist , Album"
          className="rounded w-full"
          onFocus={() =>
            dispatch(
              SetSelectedPlaylist({
                name: "All Songs",
                songs: allSongs,
              })
            )
          }
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
        />
      </div>
      <div className="overflow-y-scroll h-[54vh] p-2">
        {songsToPlay.map((song, index) => {
          const isPlaying = currentSong?._id === song._id;
          return (
            <div
              key={song._id}
              className={`p-2 text-gray-600 flex items-center justify-between cursor-pointer ${
                isPlaying &&
                "shadow rounded text-active font-semibold border-active border-2"
              }`}
              onClick={() => {
                dispatch(SetCurrentSong(song));
                dispatch(SetCurrentSongIndex(index));
              }}
            >
              <div>
                <h4 className="text-sm">{song.title}</h4>
                <h4 className="text-sm">
                  {song.artist} {song.album} {song.year}
                </h4>
              </div>
              <div>
                <h4 className="text-sm">{song.duration}</h4>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SongsList;
