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
          <h2>step 2</h2>
          <Artists />
        </section>

        
        <section>
					<h2>Code</h2>
          <pre><code className="hljs">
            alert('a')
          </code></pre>
        </section>

      </div>
    );
  }
}

export default App;
