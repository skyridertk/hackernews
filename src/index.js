import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

class ExplainBindingsComponent extends React.Component{
    //automatic binding
    onClickMe = () => {
        console.log(this);
    }

    render(){
        return(
            <button onClick={this.onClickMe}
            type='button'>
            Click Me
            </button>
        );
    }
}
ReactDOM.render(<App />, 
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

if(module.hot){
    module.hot.accept();
}