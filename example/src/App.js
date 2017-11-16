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
import NewArtist from './components/NewArtist';

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
          <p>All you need to do is to define the action data and call the generated action creators.</p>
          <div className="flex main">
            <div className="w50">
              <div className="left">Define action data:</div>
              <pre className="card c2"><code className="language-javascript">
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
    path: 'artists[id={artistId}].albums[id={albumId}].rate'
  },
  //...
}
//...
export default generateActions(actionData);`}
              </code></pre>
            </div>
            <div className="w50">
              <div className="left">Call action creators:</div>
              <pre className="card c2"><code className="language-javascript">
{`// call web api and put the http response on the store under 'artists'
this.props.getArtists();

// set the 'artists' to null on the store
this.props.setArtists();

// with parameters
this.props.getArtist({ id: 5 });

// call web api with body and put the body on the store under the path
this.props.postRate(99, {
  artistId: 5,
  albumId: 3
});`}
              </code></pre>
            </div>
          </div>
        </section>

        <section>
          <h2>Restful Api</h2>
          <div className="flex main">
            <div className="w50">
              <div className="left">Action data with restful API:</div>
              <pre className="card c2"><code className="language-javascript">
{`export const actionData = {
  artists: {
    url: 'http://localhost/api/artists',
    methods: ['get', 'post']
  },
  artist: {
    url: 'http://localhost/api/artist/{id}',
    methods: ['put', 'patch', 'delete']
  },
  //...
}
//...
export default generateActions(actionData);`}
              </code></pre>
            </div>
            <div className="w50">
              <div className="left">Call action creators:</div>
              <pre className="card c2"><code className="language-javascript">
{`this.props.getArtists();

// add new item to array
this.props.postArtists({ id: 7, name: 'Elton John' });

// replace item in array
this.props.putArtist(
  { id: 5, name: 'MJ', albums: [] },
  { id: 5 }
);

// modify item in array
this.props.patchArtist(
  { name: 'MJ' },
  { id: 5 }
);

// remove item from array
this.props.deleteArtist({ id: 5 });`}
              </code></pre>
            </div>
          </div>
        </section>

        <section>
          <h2>Setup redux store</h2>
          <div className="flex main">
            <div className="w50">
              <div className="left">Create store with the action data:</div>
              <pre className="card c2"><code className="language-javascript">
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
              </div>
            <div className="w50">
              <div className="left">Map action creators to props:</div>
              <pre className="card c2"><code className="language-javascript">
{`import { connect } from 'no-redux';
import actions from './actions';
//...
export default connect(selector, actions)(App);`}
              </code></pre>
            </div>
          </div>
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
    //...
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
    <Button onClick={() => this.props.getArtist({ id: 5 })}>
      Load Artist
    </Button>
    <Button onClick={() => this.props.setArtist()}>
      Clear Artist
    </Button>
    //...
  </div>
)`}
            </code></pre>
            <div className="w50">
              <div className="spacer"/>
              <Artist/>
              <p>
                <small><a href={api + 'artists/5'} target="_blank">Check json api</a></small><br/>
                <small><a href={src + 'Artist.js'} target="_blank">View Source</a></small>
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2>Example 3</h2>
          <p>Add new item to an array</p>
          <div className="flex">
            <pre className="card w50"><code className="language-javascript">
{`export const actionData = {
  //...
  newArtist: {
    url: 'http://localhost/api/newartist',
    method: 'post',
    path: 'artists[]'
  }
}

// in the component...

render(
  <div>
    <Button onClick={() => this.props.postNewArtist({
      id: this.getNewId(),
      name: this.refs.name.value
    })}>
      Add Artist
    </Button>
    //...
  </div>
)`}
            </code></pre>
            <div className="w50">
              <div className="spacer"/>
              <NewArtist/>
              <p>
                <small><a href={src + 'NewArtist.js'} target="_blank">View Source</a></small>
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2>Example 4</h2>
          <p>Todo list with restful API</p>
          <div className="flex main">
            <div className="w50">
              <pre className="card c2"><code className="language-javascript">
{`export const actionData = {
  //...
  newArtist: {
    url: 'http://localhost/api/newartist',
    method: 'post',
    path: 'artists[]'
  }
}

// in the component...

render(
  <div>
    <Button onClick={() => this.props.postNewArtist({
      id: this.getNewId(),
      name: this.refs.name.value
    })}>
      Add Artist
    </Button>
    //...
  </div>
)`}
              </code></pre>
            </div>
            <div className="w50">
              <div className="card c2">
                <iframe className="todo" src="http://localhost:3000"/>
              </div>  
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default App;
