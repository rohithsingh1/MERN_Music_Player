import { createSlice } from '@reduxjs/toolkit'


// createSlice accepts object as argument
//createSlice is a higher order function that accepts an initial state, 
//an object full of reducer functions and a slice name. 
//It automatically generates action creators and action types that correspond to the reducers key-names

//Within createSlice, synchronous requests made to the store are handled in the reducers object 
//while extraReducers handles asynchronous requests.
const usersSlice = createSlice({
    // name assigned to redux state
    name : 'users',
    // initialstate of the redux state
    initialState:{
        user: null,
         allSongs: [],
        tempAllSongs: [],
        currentSong: null,
        currentSongIndex: 0,
        selectedPlaylist: null,
        selectedPlaylistForEdit : null,
        isPlaying : false,
        currentTime : 0,
    },
    reducers: {
    SetUser: (state, action) => {
      state.user = action.payload;
    },
    SetAllSongs: (state, action) => {
      state.allSongs = action.payload;
    },
    SetCurrentSong: (state, action) => {
      state.currentSong = action.payload;
    },
    SetCurrentSongIndex: (state, action) => {
      state.currentSongIndex = action.payload;
    },
    SetSelectedPlaylist: (state, action) => {
      state.selectedPlaylist = action.payload;
    },
    SetSelectedPlaylistForEdit: (state, action) => {
      state.selectedPlaylistForEdit = action.payload;
    },
    SetIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    SetCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    }
  },
})

// this module exports reducer function 
//Reducer function internally takes initialstate of redux as first argument 
//and action is of function/action creater as second argument
export default usersSlice.reducer

//Action creators for the types of actions that are handled by the slice reducer.
// this module exports action creators i.e ordered , restocked function creators are exported
export const {SetUser,SetAllSongs,SetCurrentSong,SetCurrentSongIndex,SetCurrentTime,SetIsPlaying,SetSelectedPlaylist,SetSelectedPlaylistForEdit} = usersSlice.actions
















