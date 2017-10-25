import React from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import Pubsub from 'pubsub-js'

import Header from './components/header'
import Player from './page/player'
import MusicList from './page/musiclist'

import { MUSIC_LIST } from './config/musicList'
import {randomRange} from './utils/utils'

class Root extends React.Component{
    constructor(props){
        super(props);
        
        this.state = {
            musiclist: MUSIC_LIST,
            currentMusicItem: MUSIC_LIST[0],
            repeatType: 'cycle'
        }
    }

    playMusic(musicItem){
        $('#player').jPlayer("setMedia", {
            mp3: musicItem.file
        }).jPlayer('play');

        this.setState({
            currentMusicItem: musicItem
        });
    }

    playNext(type = 'next'){
        let musicListLength = this.state.musiclist.length,
            _thisCurrentIndex = this.getCurrentMusicIndex(this.state.currentMusicItem),
            _thisNextIndex = null;

        if(type === 'next'){
            _thisNextIndex = (_thisCurrentIndex + 1) % musicListLength;
        }else{
            _thisNextIndex = (_thisCurrentIndex - 1 + musicListLength) % musicListLength;
        }

        let _thisCurrentItem = this.state.musiclist[_thisNextIndex];

        this.setState({
            currentMusicItem: _thisCurrentItem
        });

        this.playMusic(_thisCurrentItem);
    }

    getCurrentMusicIndex(currentMusicItem){
        return this.state.musiclist.indexOf(currentMusicItem);
    }

    playWhenEnd(){
        if(this.state.repeatType === 'random'){
            let index = this.getCurrentMusicIndex(this.state.currentMusicItem),
                randomIndex = randomRange(0, this.state.musiclist.length - 1);

            while(randomIndex === index){
                randomIndex = randomRange(0, this.state.musiclist.length - 1);
            }

            this.playMusic(this.state.musiclist[randomIndex]);
        }else if(this.state.repeatType === 'once'){
            this.playMusic(this.state.currentMusicItem);
        }else{
            this.playNext();
        }
    }

    componentDidMount() {
        let that = this;

        $('#player').jPlayer({
            supplied: "mp3",
			wmode: "window",
			useStateClassSkin: true
        });

        this.playMusic(this.state.currentMusicItem);

        $("#player").bind($.jPlayer.event.ended, (e) => {
            this.playWhenEnd();
        });

        PubSub.subscribe("PLAY_MUSIC", (msg, musicItem) => {
            this.playMusic(musicItem);
        });

        PubSub.subscribe("DELETE_MUSIC", (msg, musicItem) => {
            this.setState({
                musiclist: this.state.musiclist.filter((item) => {
                    return item !== musicItem;
                })
            });
        });

        PubSub.subscribe("PLAY_PREV", (msg) => {
            this.playNext('prev')
        });

        PubSub.subscribe("PLAY_NEXT", (msg) => {
            this.playNext()
        });

        let repeatList = [
			'cycle',
			'once',
			'random'
		];

        PubSub.subscribe('CHANGE_REPEAT', () => {
            let index = repeatList.indexOf(this.state.repeatType);
            index = (index + 1) % repeatList.length;
            this.setState({
                repeatType: repeatList[index]
            })
        })
    }

    componentWillUnMount(){
        PubSub.unsubscribe("PLAY_MUSIC");
        PubSub.unsubscribe("DELETE_MUSIC");
        PubSub.unsubscribe("PLAY_PREV");
        PubSub.unsubscribe("PLAY_NEXT");
        PubSub.unsubscribe("CHANGE_REPEAT");

        $("#player").unbind($.jPlayer.event.ended);
    }

    render(){
        const Home = () => (
            <Player 
                currentMusicItem={this.state.currentMusicItem}
                repeatType={this.state.repeatType}
            />
        );

        const List = () => (
            <MusicList
                currentMusicItem={this.state.currentMusicItem}
                musiclist={this.state.musiclist}
            />
        );

        return (
            <Router>
                <div>
                    <Header/>

                    <Route exact path="/" component={Home}/>
                    <Route path="/list" component={List}/>
                </div>
            </Router>
        )
    }
}

export default Root;