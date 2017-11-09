import React, { Component } from 'react';
import Artists from './Artists';
import 'reveal.js/lib/js/head.min';
import Reveal from 'reveal.js/js/reveal';
import 'reveal.js/css/reveal.css';
import 'reveal.js/css/theme/beige.css';

class App extends Component {
  componentDidMount() {
    Reveal.initialize({});
  }

  render() {
    return (
      <div className="slides">
        <section>
          <h1>no-redux</h1>
        </section>
        <section>
          <h2>step 2</h2>
          <Artists />
        </section>
      </div>
    );
  }
}

export default App;
