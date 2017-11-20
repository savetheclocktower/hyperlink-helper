'use babel';

import { CompositeDisposable } from 'atom';
import HyperlinkHelper from './hyperlink-helper';

// Escape a value for use in a snippet.
function _escapeSnippet (str) {
  return str.replace(/(?=[$`\\])/g, '\\');
}

function getSnippetsModule () {
  let p = atom.packages.activePackages;
  if (p.snippets) { return p.snippets.mainModule; }
  return null;
}

const FORMAT_MARKDOWN = "[{{text}}]({{url}})";
const FORMAT_HTML     = '<a href="{{url}}">{{text}}</a>';

const MAPPINGS = {
  'text.html.markdown': FORMAT_MARKDOWN,
  'source.gfm': FORMAT_MARKDOWN,
  default: FORMAT_HTML
};

export default {
  subscriptions: null,

  activate (state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-text-editor', {
      'hyperlink-helper:insert': () => {
        HyperlinkHelper.insert( atom.workspace.getActiveTextEditor() );
      }
    }));
  },

  deactivate () {
    this.subscriptions.dispose();
  }
};
