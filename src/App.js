import './App.css'

import React from 'react'
import Rx from 'rxjs';

var stateUpdater = {};

var source$ = Rx.Observable
    .interval(500 /* ms */)
    .timeInterval()

const apiRequest$ = Rx.Observable.fromPromise(
  fetch(
    'http://quote.machinu.net/api',
    { mode: 'no-cors' }
  )
);

const quoteText$ =  source$.flatMap((_) => {
  return apiRequest$;
})

// response is no-cors so empty body! :)
quoteText$.subscribe(
  (o) => { console.log(o); },
  (e) => { console.log(e); }
);

class Quote extends React.Component {
  constructor(props) {
    super(props);

    this.state = { quote: "OMGWTFBBQ" };
  }

  componentWillMount() {
    stateUpdater.callback = (data) => { 
      this.setState({quote: data.quote});
    }
  }

  render() {
    return (
      <div>
        <p>{this.state.quote}</p>
      </div>
    );
  }
}

let App = React.createClass({
  render() {
    return <div className="App">
      <div className="App-heading App-flex">
        <h2>Welcome to <span className="App-react">Quote</span></h2>
      </div>
      <div className="App-instructions App-flex">
        <Quote/>
      </div>
    </div>
  }
})

source$.subscribe((t) => {
  stateUpdater.callback({quote: t.value})
});

export default App
