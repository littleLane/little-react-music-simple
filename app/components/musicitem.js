import React from 'react'
import { Link } from 'react-router-dom'

import './musicitem.less'
import Pubsub from 'pubsub-js'

class MusicItem extends React.Component{
    playMusic(musicItem){
        PubSub.publish('PLAY_MUSIC', musicItem);
    }

    deleteMusic(musicItem, event){
        event.stopPropagation();
        PubSub.publish('DELETE_MUSIC', musicItem);
    }

    render() {
        let musicItem = this.props.musicItem;

        return (
            <Link to="/">
                <li onClick={this.playMusic.bind(this, musicItem)} className={`components-musicitem row${this.props.focus ? ' focus' : ''}`}>
                    <p><strong>{musicItem.title}</strong> - {musicItem.artist}</p>
                    <p onClick={this.deleteMusic.bind(this, musicItem)} className="-col-auto delete"></p>
                </li>
            </Link>
        )
    }
}

export default MusicItem;