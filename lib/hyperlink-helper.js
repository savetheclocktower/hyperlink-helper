'use babel';

// Escape a value for use in a snippet.
function escapeSnippet (str) {
  return str.replace(/(?=[$`\\])/g, '\\');
}

function getSnippetsModule () {
  let p = atom.packages.activePackages;
  if (p.snippets) { return p.snippets.mainModule; }
  return null;
}

function getUrl () {
  let clip = atom.clipboard.read().trim();
  // URLs won't always have a scheme in front of them. So let's be very
  // open-minded in what we consider to be a URL.
  if ( /^\S+$/.test(clip) ) {
    clip = encodeURI(clip);
  } else {
    // If there's a space in the value, it's almost certainly not a URL.
    clip = `http://example.com`;
  }

  return clip;
}

function makeSnippet (raw, { text, url }) {
  // We don't need a templating engine here; we're just looking for a couple
  // of magic strings. The URL gets wrapped so that it'll be highlighted
  // automatically when the snippet is inserted.
  let result = raw
    .replace(/\{\{text\}\}/g, escapeSnippet(text))
    .replace(/\{\{url\}\}/g, '${1:' + escapeSnippet(url) + '}');

  return result + '$0';
}

function findFormat (editor) {
  let rootDescriptor = editor.getRootScopeDescriptor();
  let fullDescriptor = editor.getLastCursor().getScopeDescriptor();

  // If there's a user-defined format string for this particular scope in
  // config, use it.
  let format = atom.config.get('hyperlink-helper.format', {
    scope: fullDescriptor
  });
  if (format) { return format; }

  // The canonical way to specify a weirdo format is through scope-specific
  // settings, but let's handle Markdown just because it's such a common case.

  let scope = rootDescriptor.scopes[0];
  // If either of these matches, it strongly suggests Markdown syntax.
  if (/markdown|text\.md/.test(scope) || /source\.gfm/.test(scope)) {
    return FORMAT_MARKDOWN;
  }

  // Otherwise we'll just assume it's HTML.
  return FORMAT_HTML;
}

const FORMAT_MARKDOWN = "[{{text}}]({{url}})";
const FORMAT_HTML     = '<a href="{{url}}">{{text}}</a>';

export default {
  insert (editor) {
    let text = editor.getSelectedText(), url = getUrl();
    let snippet = makeSnippet( findFormat(editor), { text, url } );
    getSnippetsModule().insert(snippet);
  }
};
