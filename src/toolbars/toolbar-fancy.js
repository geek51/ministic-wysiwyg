define(['src/DOMHandler', 'require'], function(DOMHandler, require) {
  /**
   * Init all the instance data and events
   * @param  MinisticInsance ministicInsance
   */
  var Handler = function(ministicInsance) {
    this.ministicInstance = ministicInsance;
    this.toolbar =  null;
    this.visible = false;

    DOMHandler.addLinkTag(require.toUrl('') + 'src/toolbars/toolbar-fancy.css');

    this.create();

    // Due the lack of a selection event, we create a workarround...
    // ... adding and removing a global (attached to the document) event
    var fn_toggle = this.toggle.bind(this),
        editor = ministicInsance.element,
        onSelectionEnd = function(e) {
          fn_toggle(e);
          document.removeEventListener('mouseup', onSelectionEnd);
        },
        onSelectionStart = function() {
          document.addEventListener('mouseup', onSelectionEnd);
        };

    editor.addEventListener('keyup', fn_toggle);
    editor.addEventListener('mousedown', onSelectionStart);
  }

  Handler.prototype = {
    /**
     * The Buttons that will be shown in the toolbarº
     * @type Array
     */
    buttons : [
      {
        'text': 'B',
        'command': 'bold'
      },
      {
        'text': 'i',
        'command': 'italic'
      },
      {
        'text': 'U',
        'command': 'underline'
      },
      {
        'text': 'H1',
        'command': 'formatBlock',
        'argument': 'H1'
      },
      {
        'text': 'H2',
        'command': 'formatBlock',
        'argument': 'H2'
      },
      {
        'text': 'H3',
        'command': 'formatBlock',
        'argument': 'H3'
      },
      {
        'text': '"',
        'command': 'formatBlock',
        'argument': 'BLOCKQUOTE'
      },
      {
        'text': '-',
        'command': 'justifyCenter'
      }
    ],
    /**
     * Shows/Hides the toolbar
     * @param  EventObject e Data that is passed to the event callback
     */
    toggle: function(e) {
      var Selection,
          target = e.target,
          toolbar = this.toolbar,
          mInstance = this;

      if (target == toolbar || target.parentNode == toolbar) return;

      // The selection takes a little bit to remove...
      // ... we need to wait a until the selection is cleared...
      // ... otherwise the toolbar won't hide.
      setTimeout(function(){
        var Selection = window.getSelection(),
            range = Selection.getRangeAt(0);

        if (Selection.type != 'Range' || !DOMHandler.contains(mInstance.ministicInstance.element, range.startContainer) ) {
          if (mInstance.visible) mInstance.hide();
          return;
        }

        mInstance.show(Selection.getRangeAt(0).getClientRects()[0]);
      }, 100);

    },
    /**
     * Shows the toolbar
     * @param  ClientRect rects The position of the selection.
     */
    show: function(rects) {
      var toolbar = this.toolbar,
          rects;

      this.visible = true;

      DOMHandler.removeClass(toolbar, 'ministic-fancy-toolbar-hide');
      toolbar.style.display = 'block';
      DOMHandler.addClass(toolbar, 'ministic-fancy-toolbar-show');

      toolbar.style.top = (rects.top + document.body.scrollTop) + 'px';
      toolbar.style.left = rects.left + 'px';
    },
    /**
     * Hides de toolbar
     */
    hide: function() {
      this.visible = false;
      DOMHandler.addClass(this.toolbar, 'ministic-fancy-toolbar-hide');
      DOMHandler.removeClass(this.toolbar, 'ministic-fancy-toolbar-show');
    },
    /**
     * Executes a browser command.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
     * @param  Object e Data passed to the click callback
     */
    excAction: function(e) {
      var button_index, btn;

      if (!(button_index = e.target.getAttribute('data-index-cmd'))) return;

      btn = this.buttons[button_index];
      document.execCommand(btn.command, false, btn.argument || null);
    },
    /**
     * Creates the toolbar if it wasn't created, otherwise it only assings The
     * current toolbar.
     */
    create: function() {
      var toolbar, buttons;
      // One toolbar is shared with all Ministic instances.
      if (toolbar = document.getElementById('ministic-fancy-toolbar')) {
        this.toolbar = toolbar;
        return;
      }

      toolbar = DOMHandler.create('div', {'id': 'ministic-fancy-toolbar', 'class':'ministic-fancy-toolbar'})
      buttons = this.buttons;

      for (var i = 0, total = buttons.length; i < total; i++) {
        toolbar.appendChild(DOMHandler.create('button', {
          'class':'ministic-fancy-toolbar-button',
          'text': buttons[i].text,
          'data-index-cmd': i
        }));
      }

      // when the animation ends hide the toolbar
      toolbar.addEventListener("animationend", function(e) {
        if (e.animationName != 'hideToolbar') return;
        e.target.style.display = 'none';
      });

      toolbar.addEventListener('click', this.excAction.bind(this));

      document.body.appendChild(toolbar);
      this.toolbar = toolbar;
    }
  };

  return Handler;
});
