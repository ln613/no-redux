import React, { Component } from 'react';
import Artists from './Artists';
import 'reveal.js/lib/js/head.min';
import Reveal from 'reveal.js/js/reveal';
import hljs from 'highlight.js/lib/highlight';
import 'react-highlight';
import 'reveal.js/css/reveal.css';
import 'reveal.js/css/theme/beige.css';
import 'highlight.js/styles/tomorrow-night-bright.css';

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
          <p>All you need to do is to specify the data about the actions.</p>
          <pre><code className="language-javascript">
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
  ...
}`}
          </code></pre>
        </section>

        <section>
          <h2>Create redux store with the action data</h2>
          <pre><code className="language-javascript">
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
            <li>Call <i>generateActions</i> function to generate action creators</li>
            <pre><code className="language-javascript">
{`import { generateActions } from 'no-redux';
...
export default generateActions(actionData);`}
            </code></pre>
            <li>Map the action creators to the component props</li>
            <pre><code className="language-javascript">
{`import { connect } from 'no-redux';
import actions from './actions';
...
export default connect(selector, actions)(App);`}
            </code></pre>
          </ol>  
        </section>

        <section>
          <h2>Get, post, set</h2>
          <ul>
						<li>A <i>get</i> (or <i>post</i> if the method is 'post') action creator will be created for every action with url, used to make http request</li>
						<li className="fragment fade-up">A <i>set</i> action creator will be created for every action, used to put payload on the store</li>
					</ul>          
        </section>

        <section>
          <h2>Call the action creators</h2>
          <p>When you call the <i>get/post</i> action creators:</p>
          <pre><code className="language-javascript">
{`this.props.getArtists();
this.props.getArtist({ id: 5 });
this.props.postRate(99, { artistId: 5, albumId: 3 });`}
          </code></pre>
          <ul>
            <li>An http request will be made</li>
            <li>When the response is received, the corresponding <i>set</i> action creator will be called with the response as payload</li>
            <li>The reducer will put the payload on the store under the name defined by the <i>path</i> property (or the action name if there is no path)</li>
          </ul>
        </section>
      </div>
    );
  }
}

export default App;
