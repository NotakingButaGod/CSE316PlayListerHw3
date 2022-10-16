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
export default class AddSong_Transaction extends jsTPS_Transaction {
    constructor(store, list_id, newsong) {
        super();
        this.store = store;
        this.id = list_id;
        this.newsong = newsong;
    }

    doTransaction() {
        this.index = this.store.currentList.songs.length + 1;
        this.store.createNewSong(this.id, this.newsong, this.index);
        this.index = this.store.currentList.songs.length;
    }
    
    undoTransaction() {
        this.store.deleteSong(this.id, this.index);
    }
}