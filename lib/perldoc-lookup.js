'use babel';

import { CompositeDisposable } from 'atom';
import { spawn } from 'child_process';

export default {

  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'perldoc-lookup:lookup-perldoc':  () => this.lookup('perldoc'),
      'perldoc-lookup:lookup-metacpan': () => this.lookup('metacpan')
    }));

    function isPerlGrammar(event) {
        const editor = atom.workspace.getActiveTextEditor();
        if (editor && editor.getGrammar().id === 'source.perl') {
            return true;
        }
        return false;
    }

    atom.contextMenu.add({
      'atom-text-editor': [
          {
            "label": "Lookup on perldoc.perl.org",
            "command": "perldoc-lookup:lookup-perldoc",
            "shouldDisplay": isPerlGrammar
          },
          {
            "label": "Lookup on MetaCPAN",
            "command": "perldoc-lookup:lookup-metacpan",
            "shouldDisplay": isPerlGrammar
          }
      ]
    });


  },

  deactivate() {
    this.subscriptions.dispose();
  },

  lookup(type) {
      const editor = atom.workspace.getActiveTextEditor()
      if (editor) {
          const selection = editor.getSelectedText();
          let URL;
          if (type === 'perldoc') {
              URL = 'http://perldoc.org/search.html?q=' + encodeURIComponent(selection);
          }
          else {
              URL = 'https://metacpan.org/pod/' + encodeURIComponent(selection);
          }

          // Find the right command to use on every platform.
          //    See https://www.dwheeler.com/essays/open-files-urls.html
          if (process.platform === 'darwin') {
              spawn('open', [URL]);
          }
          else if (process.platform === 'win32') {
              spawn('cmd', ['/c', 'start', URL]);
          }
          else {
              spawn('xdg-open', [URL]);
          }
      }
  }
};
