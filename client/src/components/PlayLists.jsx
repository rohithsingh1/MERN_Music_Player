import axios from "axios";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import {
  SetSelectedPlaylist,
  SetSelectedPlaylistForEdit,
  SetUser,
} from "../redux/usersSlice";

function PlayLists() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, allSongs, selectedPlaylist } = useSelector((state) => {
    return state.users;
  });
  const allPlylists = [
    {
      name: "All Songs",
      songs: allSongs,
    },
    ...user.playlists,
  ];

  const onDelete = async (name) => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post(
        "/api/songs/delete-playlist",
        {
          name,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(HideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(
          SetSelectedPlaylist({
            name: "All Songs",
            songs: allSongs,
          })
        );
        dispatch(SetUser(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      toast.error(error);
    }
  };
  useEffect(() => {
    if (!selectedPlaylist && allSongs.length > 0) {
      dispatch(SetSelectedPlaylist(allPlylists[0]));
    }
  }, [selectedPlaylist, allSongs]);
  return (
    <div>
      <div className="flex justify-between w-full">
        <h1 className="text-secondary text-lg">Your Playlists</h1>
        <h1
          className="underline cursor-pointer text-lg text-secondary"
          onClick={() => {
            dispatch(SetSelectedPlaylistForEdit(null));
            navigate("/create-edit-playlist");
          }}
        >
          Create Playlist
        </h1>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-4">
        {allPlylists?.map((playlist, index) => {
          const isSelected = playlist?.name === selectedPlaylist?.name;
          return (
            <div
              key={playlist.name}
              className={`flex flex-col gap-1 text-gray-600 shadow border rounded p-1 cursor-pointer ${
                isSelected && "border-active text-active font-semibold border-2"
              }`}
              onClick={() => {
                dispatch(SetSelectedPlaylist(playlist));
              }}
            >
              <h1 className="text-lg">{playlist?.name}</h1>
              <h1 className="text-lg">{playlist?.songs?.length} Songs</h1>
              <hr />
              <div className="flex gap-3 justify-between">
                <i
                  className="ri-delete-bin-line text-lg text-gray-500"
                  onClick={() => {
                    if (playlist.name !== "All Songs") {
                      onDelete(playlist.name);
                    }
                  }}
                ></i>

                <i
                  className="ri-pencil-line text-lg text-gray-500"
                  onClick={() => {
                    if (playlist.name !== "All Songs") {
                      dispatch(SetSelectedPlaylistForEdit(playlist));
                      navigate("/create-edit-playlist");
                    }
                  }}
                ></i>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PlayLists;
