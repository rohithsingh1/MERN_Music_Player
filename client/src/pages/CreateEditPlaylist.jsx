import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Player from "../components/Player";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import {
  SetSelectedPlaylist,
  SetSelectedPlaylistForEdit,
  SetUser,
} from "../redux/usersSlice";

function CreateEditPlaylist() {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [selectedSongs, setSelectedSongs] = useState([]);
  const { allSongs, selectedPlaylistForEdit } = useSelector((state) => {
    return state.users;
  });
  const navigate = useNavigate();
  const selectUnselectSong = (song) => {
    if (selectedSongs.find((s) => s._id === song._id)) {
      setSelectedSongs(selectedSongs.filter((s) => s._id !== song._id));
    } else {
      setSelectedSongs([...selectedSongs, song]);
    }
  };
  const onAdd = async () => {
    if (name.trim().length === 0 || selectedSongs.length === 0) {
      toast.error("please fill all fields");
    } else if (name === "All Songs") {
      toast.error("Please use other name");
    } else {
      try {
        dispatch(ShowLoading());
        const response = await axios.post(
          "/api/songs/add-playlist",
          {
            name,
            songs: selectedSongs,
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
          dispatch(SetUser(response.data.data));
          setName("");
          setSelectedSongs([]);
          dispatch(SetSelectedPlaylistForEdit(null));
          dispatch(
            SetSelectedPlaylist({
              name: "All Songs",
              songs: allSongs,
            })
          );
          navigate("/");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        dispatch(HideLoading());
        toast.error(error.message);
      }
    }
  };

  const onEdit = async () => {
    if (name.trim().length === 0 || selectedSongs.length === 0) {
      toast.error("please fill all fields");
    } else {
      try {
        dispatch(ShowLoading());
        const response = await axios.post(
          "/api/songs/update-playlist",
          {
            name,
            songs: selectedSongs,
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
          dispatch(SetUser(response.data.data));
          dispatch(SetSelectedPlaylistForEdit(null));
          dispatch(
            SetSelectedPlaylist({
              name: "All Songs",
              songs: allSongs,
            })
          );
          setName("");
          setSelectedSongs([]);
          navigate("/");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        dispatch(HideLoading());
        toast.error(error.message);
      }
    }
  };
  useEffect(() => {
    if (selectedPlaylistForEdit) {
      setName(selectedPlaylistForEdit.name);
      setSelectedSongs(selectedPlaylistForEdit.songs);
    }
  }, []);
  return (
    <div>
      <div className="flex items-center gap-5">
        <i
          class="ri-arrow-left-line text-xl"
          onClick={() => {
            navigate("/");
          }}
        ></i>
        <h1 className="text-xl font-semibold">
          {selectedPlaylistForEdit ? "Edit" : "Add"} Playlist
        </h1>
      </div>
      <div className="flex flex-row justify-between gap-1 mt-4">
        <input
          className="flex w-96"
          type="text"
          placeholder="name"
          value={name}
          disabled={selectedPlaylistForEdit}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <button
          className="bg-orange-500 flex text-white py-2 px-4 text-sm"
          onClick={() => {
            if (selectedPlaylistForEdit) {
              onEdit();
            } else {
              onAdd();
            }
          }}
        >
          SAVE
        </button>
      </div>

      <h1 className="my-3 text-xl">Selected Songs - {selectedSongs.length}</h1>

      <div className=" overflow-y-scroll h-[45vh] grid grid-cols-3 gap-3">
        {allSongs.map((song, index) => {
          const isSelected = selectedSongs.find((s) => s._id === song._id);
          return (
            <div
              key={song._id}
              className={`p-2 flex items-center shadow justify-between border cursor-pointer rounded ${
                isSelected ? "border-active border-2" : "border-gray-300"
              }`}
              onClick={() => selectUnselectSong(song)}
            >
              <div>
                <h2 className="text-sm font-semibold text-gray-600">
                  {song.title}{" "}
                </h2>
                <h2 className="text-sm font-semibold text-gray-600">
                  {song.artist} - {song.album} - {song.year}
                </h2>
              </div>
            </div>
          );
        })}
      </div>

      <Player />
    </div>
  );
}

export default CreateEditPlaylist;
