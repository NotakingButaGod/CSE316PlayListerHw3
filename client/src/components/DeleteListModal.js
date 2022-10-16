import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function DeleteListModal(props){
    const { store } = useContext(GlobalStoreContext);
    let name = "";
    if(store.idNamePairs_toDelete !== undefined && store.idNamePairs_toDelete !== null){
        name = store.idNamePairs_toDelete.name;
    }
    //console.log(store.idNamePairs_toDelete);
    function handleConfirmDeleteList(){
        store.deleteList(store.idNamePairs_toDelete._id);
        let modal = document.getElementById("delete-list-modal");
        modal.classList.remove("is-visible");
    }

    function handleCancelDeleteList(){
        let modal = document.getElementById("delete-list-modal");
        modal.classList.remove("is-visible");
    }

    // if name doesn't work, replace name with store.idNamePairs_toDelete.name
    return(
            <div
                id="delete-list-modal"
                className={"modal"}
                data-animation="slideInOutLeft">
                <div className="modal-root" id='verify-delete-list-root'>
                    <div className="modal-north">
                    Delete the {name} playlist?
                    </div>
                    <div className="modal-center">
                        <div className="modal-center-content">
                            Are you sure you wish to permanently delete the {name} playlist?
                        </div>
                    </div>
                    <div className="modal-south">
                        <input type="button" id="remove-list-confirm-button" className="modal-button" onClick={handleConfirmDeleteList} value='Confirm' />
                        <input type="button" id="remove-list-cancel-button" className="modal-button" onClick={handleCancelDeleteList} value='Cancel' />
                    </div>
                </div>
            </div>
    );
    
}
export default DeleteListModal;