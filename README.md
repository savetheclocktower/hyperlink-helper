# Hyperlink Helper

An [Atom](https://atom.io) package for wrapping selected text in a hyperlink.

Inspired by the [similar bundle for TextMate](https://github.com/textmate/hyperlink-helper.tmbundle).

## Usage

In a supported language, highlight the text you want to use as the anchor text, and invoke the **Hyperlink Helper: Insert** command (by default mapped to <kbd>Ctrl-Alt-L</kbd>, or <kbd>Ctrl-Opt-L</kbd> on OS X).

If your clipboard holds a piece of text that could plausibly be a URL, it'll be used as the `href` for the link. The hyperlink will get inserted as a snippet, and the URL will be highlighted in case you need to type in something. Pressing <kbd>Tab</kbd> will move the cursor to the end of the hyperlink.

### Supported formats

HTML and Markdown are supported out of the box. The package makes an intelligent guess as to which format to use: if the language scope is `source.gfm` or contains the string `markdown`, it'll use the Markdown anchor syntax. Otherwise it'll assume HTML.

### Defining custom formats

If you need to write in a markup language that uses a different syntax for anchors (Textile, BBCode, JIRA, whatever), you can use [scoped settings](http://flight-manual.atom.io/behind-atom/sections/scoped-settings-scopes-and-scope-descriptors/) to tell Hyperlink Helper about that format.

To illustrate, here's the built-in format string for HTML:

```
<a href="{{url}}">{{text}}</a>
```

Nothing fancy is going on here. Any occurrence of `{{text}}` in the string will be replaced with the anchor text. Any occurrence of `{{url}}` will be replaced with the URL.

Here's what a format string for Textile would look like:

```
"{{text}}":{{url}}
```

And to define it in Textile files, you'd add this to your `config.cson`:

```cson
".text.html.textile":
  "hyperlink-helper":
    format: "\"{{text}}\":{{url}}"
```

In other words, the command will use any `hyperlink-helper.format` config value it finds for the specific scope. This will supersede the "guessing" behavior [described above](#supported-formats), so you **should not** set this key globally in your `config.cson`. Even defining the key for a broad scope selector like `.text` or `.source` is probably not wise.

### Commands

Command                | Description
-----------------------|--------------
`hyperlink-helper:insert` | Inserts an anchor tag using the selected text as the anchor text and the clipboard contents as the URL.

### Keybindings

Command            | Linux  | OS X  | Windows
-------------------|--------|-------|----------
`hyperlink-helper` | <kbd>Ctrl-Alt-L</kbd> | <kbd>Ctrl-Opt-L</kbd> | <kbd>Ctrl-Alt-L</kbd>

Custom keybindings can be added by referencing the above commands.  To learn more, visit the [Using Atom: Basic Customization](https://atom.io/docs/latest/using-atom-basic-customization#customizing-key-bindings) or [Behind Atom: Keymaps In-Depth](https://atom.io/docs/latest/behind-atom-keymaps-in-depth) sections in the flight manual.

## TODO

* Possibly add more formats to the built-in guessing if it turns out I've underestimated the popularity of, say, Textile.
* Insert a modified snippet if the selection is empty so that the anchor text gets its own tab stop.

## Contributing

Always feel free to help out!  Whether it's filing bugs and feature requests or working on some of the open issues, Atom's [contributing guide](https://github.com/atom/atom/blob/master/CONTRIBUTING.md) will help get you started while the [guide for contributing to packages](https://github.com/atom/atom/blob/master/docs/contributing-to-packages.md) has some extra information.

## License

[MIT License](http://opensource.org/licenses/MIT) - see the [LICENSE](https://github.com/savetheclocktower/hyperlink-helper/blob/master/LICENSE.md) for more details.
