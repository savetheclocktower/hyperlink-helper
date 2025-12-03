'use babel';

import { CompositeDisposable } from 'atom';
import HyperlinkHelper from './hyperlink-helper';

export default {
  subscriptions: null,

  activate () {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-text-editor', {
      'hyperlink-helper:insert': () => {
        HyperlinkHelper.insert(
          atom.workspace.getActiveTextEditor()
        );
      }
    }));
  },

  deactivate () {
    this.subscriptions.dispose();
  },

  consumeSnippets (snippets) {
    HyperlinkHelper.setSnippets(snippets);
  }
};
