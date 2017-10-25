import React from 'react'
import MusicItem from '../components/musicitem'

class MusicList extends React.Component{
    render(){
        let listEle = this.props.musiclist.map((item) => {
            return (
                <MusicItem 
                    focus={item === this.props.currentMusicItem}
                    key={item.id}
                    musicItem={item}
                >
                    {item.title}
                </MusicItem>
            )
        });

        return (
            <ul>
                {listEle}
            </ul>
        )
    }
}

export default MusicList