'use babel';

import HyperlinkHelper from '../lib/hyperlink-helper';
import { Range, Point } from 'atom';

const r = (strings) => {
  return strings[0].replace(/^[ \t\r]+/gm, '')
};

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('HyperlinkHelper', () => {
  let editor = null;

  beforeEach(() => {
    waitsForPromise(() => {
      return atom.packages.activatePackage('snippets');
    });

    waitsForPromise(() => {
      return atom.packages.activatePackage('language-html');
    });

    waitsForPromise(() => {
      return atom.packages.activatePackage('language-gfm');
    });

    waitsForPromise(() => {
      return atom.packages.activatePackage('language-javascript');
    });

    waitsForPromise(() => {
      return atom.workspace.open();
    });

    runs(() => {
      editor = atom.workspace.getActiveTextEditor();
      editor.setText(r`
        This SELECTED TEXT should link to a URL.
      `);
      let selectedRange = new Range(
        new Point(1, 5),
        new Point(1, 18)
      );
      editor.setSelectedBufferRange(selectedRange);
    });
  });

  describe('when in an HTML document', () => {
    beforeEach(() => {
      runs(() => {
        editor.setGrammar(
          atom.grammars.grammarForScopeName('text.html.basic')
        );
      });
    });

    it('should wrap selected text in a hyperlink', () => {
      atom.clipboard.write('http://example.com/foo');
      HyperlinkHelper.insert(editor);
      expect( editor.lineTextForBufferRow(1) ).toBe(
        `This <a href="http://example.com/foo">SELECTED TEXT</a> should link to a URL.`
      );
      expect( editor.getSelectedText() ).toBe('http://example.com/foo');
    });

    it('should treat arbitrary strings as URLs if they do not contain spaces', () => {
      atom.clipboard.write('tadpoles');
      HyperlinkHelper.insert(editor);
      expect( editor.lineTextForBufferRow(1) ).toBe(
        `This <a href="tadpoles">SELECTED TEXT</a> should link to a URL.`
      );
      expect( editor.getSelectedText() ).toBe('tadpoles');
    });

    it('should ignore clipboard values that are probably not URLs', () => {
      atom.clipboard.write('lorem ipsum dolor sit amet');
      HyperlinkHelper.insert(editor);
      expect( editor.lineTextForBufferRow(1) ).toBe(
        `This <a href="http://example.com">SELECTED TEXT</a> should link to a URL.`
      );
      expect( editor.getSelectedText() ).toBe('http://example.com');
    });

  });

  describe('in a Markdown document', () => {
    beforeEach(() => {
      runs(() => {
        editor.setGrammar(
          atom.grammars.grammarForScopeName('source.gfm')
        );
      });
    });

    it('should wrap selected text in a hyperlink', () => {
      atom.clipboard.write('http://example.com/foo');
      HyperlinkHelper.insert(editor);
      expect( editor.lineTextForBufferRow(1) ).toBe(
        `This [SELECTED TEXT](http://example.com/foo) should link to a URL.`
      );
      expect( editor.getSelectedText() ).toBe('http://example.com/foo');
    });
  });

  describe('in an arbitrary document with a "format" config setting', () => {
    beforeEach(() => {
      runs(() => {
        atom.config.set('hyperlink-helper.format', '##{{text}}##{{url}}##', { scopeSelector: '.text.plain' });
        editor.setGrammar(
          atom.grammars.grammarForScopeName('text.plain')
        );
      });
    });

    it('should respect our config setting', () => {
      atom.clipboard.write('something');
      HyperlinkHelper.insert(editor);

      expect( editor.lineTextForBufferRow(1) ).toBe(
        `This ##SELECTED TEXT##something## should link to a URL.`
      );
      expect( editor.getSelectedText() ).toBe('something');
    });

  });

  describe('in an arbitrary document without a "format" config setting', () => {
    beforeEach(() => {
      runs(() => {
        editor.setGrammar(
          atom.grammars.grammarForScopeName('source.js')
        )
      });
    });

    it('assumes HTML', () => {
      atom.clipboard.write('something-else');
      HyperlinkHelper.insert(editor);

      expect( editor.lineTextForBufferRow(1) ).toBe(
        `This <a href="something-else">SELECTED TEXT</a> should link to a URL.`
      );
      expect( editor.getSelectedText() ).toBe('something-else');
    });
  });

});
