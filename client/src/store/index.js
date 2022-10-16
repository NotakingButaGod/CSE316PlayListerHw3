import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'

export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/
// 何日天
// 何再次日天
// 何再次日天天
// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    CREATE_NEW_SONG: "CREATE_NEW_SONG",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    DELETE_LIST: "DELETE_LIST",
    DELETE_SONG: "DELETE_SONG",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION", 
    MARK_SONG_FOR_DELETION: "MARK_SONG_FOR_DELETION"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        idNamePairs_toDelete: null,
        song_toDelete: null,
        song_toDelete_index: null,
        currentList: null,
        newListCounter: 0,
        listNameActive: false
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false
                })
            }
            case GlobalStoreActionType.CREATE_NEW_SONG: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                })
            }
            case GlobalStoreActionType.DELETE_LIST: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    idNamePairs_toDelete: null,
                    currentList: null,
                    newListCounter: store.newListCounter - 1,
                    listNameActive: false
                })
            }
            case GlobalStoreActionType.DELETE_SONG: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    idNamePairs_toDelete: null,
                    song_toDelete: null,
                    song_toDelete_index: null,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    idNamePairs_toDelete: payload.idNamePairs_toDelete,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }

            case GlobalStoreActionType.MARK_SONG_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    idNamePairs_toDelete: payload.idNamePairs_toDelete,
                    song_toDelete: payload.song_toDelete,
                    song_toDelete_index: payload.song_toDelete_index,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: true
                });
            }


            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.createNewList = async function(newplaylist) {
        async function asyncCreateNewList(newplaylist){
            let response = await api.createNewPlaylists(newplaylist);
            if(response.data.success){
                //console.log(response);
                let playlist = response.data.playlist;
                let pair = store.idNamePairs;
                pair.push(playlist);
                storeReducer({
                    type: GlobalStoreActionType.CREATE_NEW_LIST,
                    payload : {
                        idNamePairs: pair,
                        playlist : playlist
                    }
                });
                
            }
            // update the playlist
            return response.data.playlist._id;
        }
        let getid = await asyncCreateNewList(newplaylist);
        return getid;
        
    }
    store.createNewSong = function(id, newSong) {
        async function asyncCreateNewSong(id, newSong) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.songs.push(newSong);
                async function updateList() {
                    response = await api.createNewSong(id,newSong); 
                    if (response.data.success) {
                        async function getListPairs() {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CREATE_NEW_SONG,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs();
                    }
                }
                updateList();
            }
        }
        asyncCreateNewSong(id, newSong);
    }
    
    store.MarkListForDeletion = function(idNamePair){
        //console.log(store.idNamePairs);
        storeReducer({
           type: GlobalStoreActionType.MARK_LIST_FOR_DELETION, 
           payload : {
                idNamePairs_toDelete:  idNamePair
           } 
        });
        let modal = document.getElementById("delete-list-modal");
        modal.classList.add("is-visible");
    }

    store.deleteList = function(id) {
        async function asyncdeleteList(id){
            let response = await api.deletePlaylist(id);
            if(response.data.success){
                let pair = store.idNamePairs.filter((list) => list._id !== id);
                storeReducer({
                    type: GlobalStoreActionType.DELETE_LIST, 
                    payload : {
                        idNamePairs : pair
                    } 
                })
            }
        }
        asyncdeleteList(id);
    }
    store.MarkSongForDeletion = function(list, song, index){
        //console.log(store.idNamePairs);
        storeReducer({
           type: GlobalStoreActionType.MARK_SONG_FOR_DELETION, 
           payload : {
                idNamePairs_toDelete: list,
                song_toDelete: song,
                song_toDelete_index: index
           } 
        });
        let modal = document.getElementById("delete-song-modal");
        modal.classList.add("is-visible");
    }
    store.deleteSong = function(list_id, song_index) {
        async function asyncdeleteSong(list_id, song_index){
            let response = await api.getPlaylistById(list_id);
            if(response.data.success){
                let playlist = response.data.playlist;
                playlist.songs.splice(song_index, 1);
                async function updateList(){
                    response = await api.deleteSong(list_id, playlist.songs);
                    if (response.data.success) {
                        storeReducer({
                            type: GlobalStoreActionType.DELETE_SONG,
                                payload: {
                                    playlist: playlist
                                }
                            });
                    }
                }
                updateList();
            }
        }
        asyncdeleteSong(list_id, song_index);      
    }
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName; 
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist.name); 
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }
    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}