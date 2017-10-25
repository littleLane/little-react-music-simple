import React from 'react'
import './progress.less'

class Progress extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            barColor: '#2f9842'
        };

        this.changeProgress = this.changeProgress.bind(this);
    }

    changeProgress(e){
        let progressBar = this.refs.progressBar;
        let progress = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.clientWidth;
        this.props.onProgressChange && this.props.onProgressChange(progress);
    }

    render(){
        return (
            <div 
                className="components-progress" 
                onClick={this.changeProgress}
                ref="progressBar"
            >
                <div 
                    className="progress" 
                    style={{width: `${this.props.progress}%`, background: this.state.barColor}}
                ></div>
            </div>
        )
    }
}

export default Progress;