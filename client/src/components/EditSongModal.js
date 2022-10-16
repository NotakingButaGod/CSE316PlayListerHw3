import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function EditSongModal(props){
    const { store } = useContext(GlobalStoreContext);
    //console.log(store.idNamePairs_toDelete);
    function handleConfirmEditSong(){
        //store.editSong(store.idNamePairs_toEdit._id, store.song_toEdit_index);
        //let modal = document.getElementById("edit-song-modal");
        //modal.classList.remove("is-visible");
        store.addEditSongTransaction();
    }

    function handleCancelEditSong(){
        let modal = document.getElementById("edit-song-modal");
        modal.classList.remove("is-visible");
    }

    // if name doesn't work, replace name with store.idNamePairs_toDelete.name
    return(
            <div 
                id="edit-song-modal" 
                className={"modal"} 
                data-animation="slideInOutLeft">
                    <div className="modal-root" id='verify-edit-song-root' style={{width : "800px"}}>
                        <div className="modal-north">
                            Edit Song
                        </div>
                        <div className="modal-center">
                            <div className="modal-center-content">
                                Title:
                                <input className="inputs" type="text" id="titleinput" size="30" style={{fontSize:"x-large"}}></input><br></br>
                                Artist:
                                <input className="inputs" type="text" id="artistinput" size="30" style={{fontSize:"x-large"}}></input><br></br>
                                Youtube Id:
                                <input className="inputs" type="text" id="youtubeidinput" size="30" style={{fontSize:"x-large"}}></input><br></br>
                            </div>
                        </div>
                        <div className="modal-south">
                            <input type="button" 
                                id="edit-song-confirm-button" 
                                className="modal-button" 
                                onClick={handleConfirmEditSong}
                                value='Confirm' />
                            <input type="button" 
                                id="edit-song-cancel-button" 
                                className="modal-button" 
                                onClick={handleCancelEditSong}
                                value='Cancel' />
                        </div>
                    </div>
            </div>
    );
    
}
export default EditSongModal;