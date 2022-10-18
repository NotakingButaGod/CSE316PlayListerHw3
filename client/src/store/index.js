import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
import AddSong_Transaction from '../transactions/AddSong_Transaction.js'
import DeleteSong_Transaction from '../transactions/DeleteSong_Transaction.js'
import EditSong_Transaction from '../transactions/EditSong_Transaction.js'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction.js'
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
    EDIT_SONG: "EDIT_SONG",
    MOVE_SONG: "MOVE_SONG",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION", 
    MARK_SONG_FOR_DELETION: "MARK_SONG_FOR_DELETION",
    MARK_SONG_FOR_EDITION: "MARK_SONG_FOR_EDITION", 
    SET_UNDO_AND_REDO_TRANSACTION: "SET_UNDO_AND_REDO_TRANSACTION"
    
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
        idNamePairs_toEdit: null,
        song_toEdit: null,
        song_toEdit_index: null,
        currentList: null,
        newListCounter: 0,
        listNameActive: false, 
        hasUndo: false,
        hasRedo: false
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
                    listNameActive: false,
                    //editactive: true
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
                    hasUndo: tps.hasTransactionToUndo(),
                    hasRedo: tps.hasTransactionToRedo(),
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
                    idNamePairs: payload.idNamePairs,
                    idNamePairs_toDelete: null,
                    song_toDelete: null,
                    song_toDelete_index: null,
                    currentList: payload.playlist,
                    hasUndo: tps.hasTransactionToUndo(),
                    hasRedo: tps.hasTransactionToRedo(),
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    idNamePairs_toEdit: null,
                    song_toEdit: null,
                    song_toEdit_index: null,
                    currentList: payload.playlist,
                    hasUndo: tps.hasTransactionToUndo(),
                    hasRedo: tps.hasTransactionToRedo(),
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            case GlobalStoreActionType.MOVE_SONG: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    hasUndo: tps.hasTransactionToUndo(),
                    hasRedo: tps.hasTransactionToRedo(),
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

            case GlobalStoreActionType.MARK_SONG_FOR_EDITION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    idNamePairs_toEdit: payload.idNamePairs_toEdit,
                    song_toEdit: payload.song_toEdit,
                    song_toEdit_index: payload.song_toEdit_index,
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
            case GlobalStoreActionType.SET_UNDO_AND_REDO_TRANSACTION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    hasUndo: tps.hasTransactionToUndo(),
                    hasRedo: tps.hasTransactionToRedo(),
                    newListCounter: store.newListCounter,
                    listNameActive: false
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
    store.createNewSong = function(id, newSong, index) {
        async function asyncCreateNewSong(id, newSong, index) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                if(index === playlist.songs.length){
                    playlist.songs.push(newSong);
                }
                else{
                    playlist.songs.splice(index, 0, newSong);
                }
                console.log(playlist);
                async function updateList() {
                    response = await api.createNewSong(id,playlist.songs); 
                    if (response.data.success) {
                        async function getListPairs() {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                //console.log(response);
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
        asyncCreateNewSong(id, newSong, index);
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
                let playlist1 = response.data.playlist;
                playlist1.songs.splice(song_index, 1);
                //console.log(playlist);
                async function updateList(playlist1){
                    response = await api.deleteSong(list_id, playlist1.songs);
                    if (response.data.success) {
                        async function getListPairs(playlist1) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                //console.log(response);
                                storeReducer({
                                    type: GlobalStoreActionType.DELETE_SONG,
                                        payload: {
                                            idNamePairs: pairsArray,
                                            playlist: playlist1
                                        }
                                });
                                
                                console.log(playlist1)
                            }
                        }
                        getListPairs(playlist1);
                    }
                }
                updateList(playlist1);
            }
        }
        asyncdeleteSong(list_id, song_index);      
    }

    store.MarkSongForEdition = function(list, song, index){
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG_FOR_EDITION, 
            payload : {
                 idNamePairs_toEdit: list,
                 song_toEdit: song,
                 song_toEdit_index: index
            } 
        });
        let modal = document.getElementById("edit-song-modal");
        modal.classList.add("is-visible");
        document.getElementById("titleinput").value = song.title;
        document.getElementById("artistinput").value = song.artist;
        document.getElementById("youtubeidinput").value = song.youTubeId;
    }

    store.editSong = function(list_id, song_index, newtitle, newartist, newyouTubeId){
        async function asyncEditSong(list_id, song_index, newtitle, newartist, newyouTubeId){
            let response = await api.getPlaylistById(list_id);
            if(response.data.success){
                let playlist = response.data.playlist;
                if (newtitle !== "") {
                    playlist.songs[song_index].title = newtitle;
                }
                if (newartist !== "") {
                    playlist.songs[song_index].artist = newartist;
                }
                if (newyouTubeId !== "") {
                    playlist.songs[song_index].youTubeId = newyouTubeId;
                }
                console.log(playlist);
                async function updateList(){
                    response = await api.editSong(list_id, playlist.songs);
                    if (response.data.success) {
                        async function getListPairs() {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                //console.log(response);
                                storeReducer({
                                    type: GlobalStoreActionType.EDIT_SONG,
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
        asyncEditSong(list_id, song_index, newtitle, newartist, newyouTubeId);
    }

    store.moveSong = function(start_index, end_index, list_id){
        async function asyncMoveSong(start_index, end_index, list_id){
            let response = await api.getPlaylistById(list_id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                let tempsong = playlist.songs[start_index];
                playlist.songs[start_index] = playlist.songs[end_index];
                playlist.songs[end_index] = tempsong;
                async function updateList(){
                    response = await api.moveSong(list_id, playlist.songs);
                    if (response.data.success) {
                        async function getListPairs() {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                //console.log(response);
                                storeReducer({
                                    type: GlobalStoreActionType.MOVE_SONG,
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
        asyncMoveSong(start_index, end_index, list_id);
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
        tps.clearAllTransactions();
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
        if (tps.hasTransactionToUndo()){
            tps.undoTransaction();
            console.log(store.currentList);
            storeReducer({
                type: GlobalStoreActionType.SET_UNDO_AND_REDO_TRANSACTION,
                payload: null
            });
        }
        
    }
    store.redo = function () {
        if (tps.hasTransactionToRedo()) {
            tps.doTransaction();
            storeReducer({
                type: GlobalStoreActionType.SET_UNDO_AND_REDO_TRANSACTION,
                payload: null
            });
            
        }
        
    }
    function handlekeydown(event){
        if((event.metaKey || event.ctrlKey) && event.key === 'z'){
            if(tps.hasTransactionToUndo()){
                store.undo();
            }
            
            //this.undo();
        }
        else if((event.metaKey || event.ctrlKey) && event.key === 'y'){
            if(tps.hasTransactionToRedo()){
                store.redo();
            }
        }
    }
    document.onkeydown = (event) => handlekeydown(event, this);
    

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    store.addAddSongTransaction = function(list_id, newsong) {
        let transaction = new AddSong_Transaction(store, list_id, newsong);
        tps.addTransaction(transaction);
    }

    store.addDeleteSongTransaction = function(){
        let transaction = new DeleteSong_Transaction(store);
        tps.addTransaction(transaction);
    }

    store.addEditSongTransaction = function(){
        let transaction = new EditSong_Transaction(store);
        tps.addTransaction(transaction);
    }

    store.addMoveSongTransaction = function(start_index, end_index, list_id){
        let transaction = new MoveSong_Transaction(store, start_index, end_index, list_id);
        tps.addTransaction(transaction);
    }

    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}