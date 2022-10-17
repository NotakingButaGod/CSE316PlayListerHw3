import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const {store} = useContext(GlobalStoreContext);
    const history = useHistory();
    
    let enabledAddSongButtonClass = "playlister-button";
    let enabledCloseButtonClass = "playlister-button";
    let enabledUndoButtonClass = "playlister-button";
    let enabledRedoButtonClass = "playlister-button";
    let canAddSong = store.currentList !== null ? true : false;
    let canUndo = store.hasUndo ? true : false;
    let canRedo = store.hasRedo ? true : false;
    let canClose = store.currentList !== null ? true : false;
    
    
    if (!canAddSong) enabledAddSongButtonClass += "-disabled";
    if (!canClose) enabledCloseButtonClass += "-disabled";
    if (!canUndo) enabledUndoButtonClass += "-disabled";
    if (!canRedo) enabledRedoButtonClass += "-disabled";
   
    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    
    function handleClose() {
        history.push("/");
        store.closeCurrentList();
    }
    function handleAddSong(event) {
        event.stopPropagation();
        let newSong = {title : "Untitled", artist : "Unknown", youTubeId: "dQw4w9WgXcQ"};
        //store.createNewSong(store.currentList._id, newSong);
        store.addAddSongTransaction(store.currentList._id, newSong);
    }
    let editStatus = false;
    if (store.isListNameEditActive) {
        editStatus = true;
    }
    return (
        <span id="edit-toolbar">
            <input
                type="button"
                id='add-song-button'
                disabled={canAddSong ? false : true}
                value="+"
                className={enabledAddSongButtonClass}
                onClick={handleAddSong}
            />
            <input
                type="button"
                id='undo-button'
                disabled={canUndo ? false : true}
                value="⟲"
                className={enabledUndoButtonClass}
                onClick={handleUndo}
                onKeyDown={store.handlekeydown}
            />
            <input
                type="button"
                id='redo-button'
                disabled={canRedo ? false : true}
                value="⟳"
                className={enabledRedoButtonClass}
                onClick={handleRedo}
                onKeyDown={store.handlekeydown}
            />
            <input
                type="button"
                id='close-button'
                disabled={canClose ? false : true}
                value="&#x2715;"
                className={enabledCloseButtonClass}
                onClick={handleClose}
            />
        </span>);
}

export default EditToolbar;