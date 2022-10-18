import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { song, index } = props;
    let cardClass = "list-card unselected-list-card";
    function handleDeleteSong(event){
        //console.log(song);
        //console.log(index);
        event.stopPropagation();
        store.MarkSongForDeletion(store.currentList, song, index);
    }
    function handleEditSong(event){
        //console.log(song);
        event.stopPropagation();
        store.MarkSongForEdition(store.currentList, song, index);
    }

    function handleDragstart(event){
        event.dataTransfer.setData("song", event.target.id);
    }

    function handleDragignore(event){
        event.preventDefault();
    }

    function handleDragdrop(event){
        event.preventDefault();
        let target = event.target;
        let targetId = target.id;
        targetId = targetId.substring(target.id.indexOf("-") + 1);
        let sourceId = event.dataTransfer.getData("song");
        sourceId = sourceId.substring(sourceId.indexOf("-") + 1);
        //console.log(targetId[0]);
        //console.log(sourceId[0]);
        //store.moveSong(sourceId[0], targetId[0], store.currentList._id);
        //console.log(store.currentList.songs[sourceId[0]]);
        //console.log(store.currentList.songs[targetId[0]]);
        store.addMoveSongTransaction(sourceId[0], targetId[0], store.currentList._id);
    }

    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onDoubleClick={handleEditSong}
            onDragStart={handleDragstart}
            onDragOver={handleDragignore}
            onDragEnter={handleDragignore}
            onDragLeave={handleDragignore}
            onDrop={handleDragdrop}
            draggable="true"
        >   
            {index + 1}.
            <a
                id={'song-' + index + '-link'}
                className="song-link"
                href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
                {song.title} by {song.artist}
            </a>
            <input
                type="button"
                id={"remove-song-" + index}
                className="list-card-button"
                onClick={handleDeleteSong}
                value={"\u2715"}
            />
        </div>
    );
}

export default SongCard;