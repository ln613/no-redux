import React, { Component } from 'react';
import 'reveal.js/lib/js/head.min';
import Reveal from 'reveal.js/js/reveal';
import hljs from 'highlight.js/lib/highlight';
import 'react-highlight';
import 'reveal.js/css/reveal.css';
import 'reveal.js/css/theme/beige.css';
import 'highlight.js/styles/vs.css';
import { api } from './actions';

import Artists from './components/Artists';
import Artist from './components/Artist';

const src = 'https://github.com/ln613/no-redux/blob/master/example/src/components/';

class App extends Component {
  componentDidMount() {
    Reveal.initialize({
      dependencies: [
        { src: 'reveal.js/lib/js/classList.js', condition: function () { return !document.body.classList; } },
        { src: 'reveal.js/plugin/markdown/marked.js', condition: function () { return !!document.querySelector('[data-markdown]'); } },
        { src: 'reveal.js/plugin/markdown/markdown.js', condition: function () { return !!document.querySelector('[data-markdown]'); } },
        { src: 'reveal.js/plugin/highlight/highlight.js', async: true, callback: function () { hljs.initHighlightingOnLoad();  } },
        { src: 'reveal.js/plugin/zoom-js/zoom.js', async: true },
        { src: 'reveal.js/plugin/notes/notes.js', async: true }
      ]
    });
  }

  render() {
    return (
      <div className="slides">
        
        <section>
          <h1>no-redux</h1>
          <h3>Automate all redux flows</h3>
					<p>
						<small>Created by <a href="mailto:ln613@hotmail.com">Nan Li</a> / <a href="https://github.com/ln613/no-redux">@github</a></small>
          </p>
        </section>
        
        <section>
          <h2>no-redux will help you</h2>
          <ul>
						<li className="fragment fade-up">Generate action creators</li>
						<li className="fragment fade-up">Make http requests</li>
						<li className="fragment fade-up">Receive http responses</li>
            <li className="fragment fade-up">Generate reducers to put payload/response on the store</li>
            <li className="fragment fade-up">Guarantee store immutability</li>
            <li className="fragment fade-up">'Memoize' selectors</li>
					</ul>          
        </section>

        <section>
          <h2>Define action data</h2>
          <p>You only need to define the data about the actions.</p>
          <pre className="card"><code className="language-javascript">
{`export const actionData = {
  artists: {
    url: 'http://localhost/api/artists'
  },
  artist: {
    url: 'http://localhost/api/artist/{id}'
  },
  rate: {
    url: 'http://localhost/api/updaterate',
    method: 'post',
    path: 'artists[id={artistId}].album[id={albumId}].rate'
  },
  //...
}`}
          </code></pre>
        </section>

        <section>
          <h3>Create redux store with the action data</h3>
          <pre className="card"><code className="language-javascript">
{`import React from 'react';
import { render } from 'react-dom';
import { Provider, createStore } from 'no-redux';
import { actionData } from './actions';
import App from './App';

render(
  <Provider store={createStore(actionData)}>
    <App />  
  </Provider>,
  document.getElementById('root')
);`}
          </code></pre>
        </section>

        <section>
          <h2>Generate action creators</h2>
          <ol>
            <li>Call <i>generateActions</i> to generate action creators</li>
            <pre className="card"><code className="language-javascript">
{`import { generateActions } from 'no-redux';
//...
export default generateActions(actionData);`}
            </code></pre>
            <li>Map the action creators to the component props</li>
            <pre className="card"><code className="language-javascript">
{`import { connect } from 'no-redux';
import actions from './actions';
//...
export default connect(selector, actions)(App);`}
            </code></pre>
          </ol>  
        </section>

        <section>
          <h2>Action creators</h2>
          <ul>
            <li>One action creator for each http method, e.g., <i>getArtist, postArtist, putArtist, patchArtist and deleteArtist</i>, used to make http calls</li>
						<li className="fragment fade-up">One <i>set</i> action creator for every action, e.g., <i>setArtist</i>, used to put payload on the store</li>
					</ul>          
        </section>

        <section>
          <h2>Call the http action creators</h2>
          <pre className="card"><code className="language-javascript">
{`this.props.getArtists();
this.props.getArtist({ id: 5 });
this.props.postRate(99, { artistId: 5, albumId: 3 });`}
          </code></pre>
          <p>When you call http action creators, no-redux will:</p>
          <ul>
            <li>Make http request</li>
            <li>Receive http response, call the <i>set</i> action creator with the response</li>
            <li>Put the payload/response on the store under the action name/path</li>
          </ul>
        </section>

        <section>
          <h2>Example 1</h2>
          <div className="flex">
            <pre className="card w50"><code className="language-javascript">
{`export const actionData = {
  artists: {
    url: 'http://localhost/api/artists'
  }
}

// in the component...

render(
  <div>
    <Button onClick={() => this.props.getArtists()}>
      Load Artists
    </Button>
    <Button onClick={() => this.props.setArtists()}>
      Clear Artists
    </Button>
    ...
  </div>
)`}
            </code></pre>
            <div className="w50">
              <div className="spacer"/>
              <Artists/>
              <p>
                <small><a href={api + 'artists'} target="_blank">Check json api</a></small><br/>
                <small><a href={src + 'Artists.js'} target="_blank">View Source</a></small>
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2>Example 2</h2>
          <p>Url with parameters</p>
          <div className="flex">
            <pre className="card w50"><code className="language-javascript">
{`export const actionData = {
  artist: {
    url: 'http://localhost/api/artists/{id}'
  }
}

// in the component...

render(
  <div>
    <Button
      onClick={() => this.props.getArtist({ id: 5 })}
    >
      Load Artist
    </Button>
    <Button onClick={() => this.props.setArtist()}>
      Clear Artist
    </Button>
    ...
  </div>
)`}
            </code></pre>
            <div className="w50">
              <div className="spacer"/>
              <Artist/>
              <p>
                <small><a href={api + 'artist/5'} target="_blank">Check json api</a></small><br/>
                <small><a href={src + 'Artist.js'} target="_blank">View Source</a></small>
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default App;
