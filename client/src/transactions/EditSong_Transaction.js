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
export default class EditSong_Transaction extends jsTPS_Transaction {
    constructor(store) {
        super();
        this.store = store;
        this.id = this.store.idNamePairs_toEdit._id;
        this.index = this.store.song_toEdit_index;
        this.oldsong = {title : this.store.song_toEdit.title, artist: this.store.song_toEdit.artist, youTubeId: this.store.song_toEdit.youTubeId};
        this.newsong = {title: document.getElementById("titleinput").value, artist: document.getElementById("artistinput").value, youTubeId: document.getElementById("youtubeidinput").value};
    }
    doTransaction() {
        this.store.editSong(this.id, this.index, this.newsong.title, this.newsong.artist, this.newsong.youTubeId);
        let modal = document.getElementById("edit-song-modal");
        modal.classList.remove("is-visible");
    }
    
    undoTransaction() {
        this.store.editSong(this.id, this.index, this.oldsong.title, this.oldsong.artist, this.oldsong.youTubeId);
    }
}