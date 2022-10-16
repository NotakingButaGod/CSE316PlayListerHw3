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
export default class MoveSong_Transaction extends jsTPS_Transaction {
    constructor(store, start_index, end_index, list_id) {
        super();
        this.store = store;
        this.id = list_id;
        this.oldstart_index = start_index;
        this.newend_index = end_index;
    }

    doTransaction() {
        this.store.moveSong(this.oldstart_index, this.newend_index, this.id);
    }
    
    undoTransaction() {
        this.store.moveSong(this.newend_index, this.oldstart_index, this.id);
    }
}