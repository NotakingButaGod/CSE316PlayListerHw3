import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function DeleteSongModal(props){
    const { store } = useContext(GlobalStoreContext);
    let name = "";
    if(store.song_toDelete !== undefined && store.song_toDelete !== null){
        name = store.song_toDelete.title;
    }
    //console.log(store.idNamePairs_toDelete);
    function handleConfirmDeleteSong(){
        store.deleteSong(store.idNamePairs_toDelete._id, store.song_toDelete_index);
        let modal = document.getElementById("delete-song-modal");
        modal.classList.remove("is-visible");
    }

    function handleCancelDeleteSong(){
        let modal = document.getElementById("delete-song-modal");
        modal.classList.remove("is-visible");
    }

    // if name doesn't work, replace name with store.idNamePairs_toDelete.name
    return(
            <div
                id="delete-song-modal"
                className={"modal"}
                data-animation="slideInOutLeft">
                <div className="modal-root" id='verify-delete-song-root'>
                    <div className="modal-north">
                    Delete the {name} song?
                    </div>
                    <div className="modal-center">
                        <div className="modal-center-content">
                            Are you sure you wish to permanently delete the {name} song?
                        </div>
                    </div>
                    <div className="modal-south">
                        <input type="button" id="remove-song-confirm-button" className="modal-button" onClick={handleConfirmDeleteSong} value='Confirm' />
                        <input type="button" id="remove-song-cancel-button" className="modal-button" onClick={handleCancelDeleteSong} value='Cancel' />
                    </div>
                </div>
            </div>
    );
    
}
export default DeleteSongModal;