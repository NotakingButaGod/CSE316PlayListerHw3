import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * MoveSong_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class DeleteSong_Transaction extends jsTPS_Transaction {
    constructor(store) {
        super();
        this.store = store;
        this.id = this.store.idNamePairs_toDelete._id;
        this.index = this.store.song_toDelete_index;
        this.savedsong = {title : this.store.song_toDelete.title, artist: this.store.song_toDelete.artist, youTubeId: this.store.song_toDelete.youTubeId};
    }

    doTransaction() {
        this.store.deleteSong(this.id, this.index);
        let modal = document.getElementById("delete-song-modal");
        modal.classList.remove("is-visible");
    }
    
    undoTransaction() {
        this.store.createNewSong(this.id, this.savedsong, this.index);
        //console.log(this.index);
        
    }
}