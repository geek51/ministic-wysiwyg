define(['src/DOMHandler', 'require'], function(DOMHandler, require) {
  /**
   * Stores the last used buttons.
   * @see Handler.highlightButton
   * @type Array
   */
  var current_selected_buttons = [];

  /**
   * Get the button tag that represents
   * @param  Object currentElement The button descriotion
   * @return String the button tag that represents
   */
  function get_button_tag(currentElement) {
    return currentElement.argument || currentElement.text || currentElement.command;
  }

  /**
   * If the user selects a element that executes a formatBlock action, it doesn't
   * toogle the element, this function take cares of this action.
   * @param Object btn The button cofiguration
   * @return Object {
   *   stopProcess: true|false tells if the process should be stoped
   * }
   */
  function toggle_element(btn) {
    var range = window.getSelection().getRangeAt(0),
        node_to_replace,
        new_parent;

    // if the selected elements are more than one, doesn't do anything
    if (range.startContainer != range.endContainer) {
      return {'stopProcess': false};
    }

    // finds the element to be replaced
    if (range.startContainer.tagName == btn.argument) {
      node_to_replace = range.startContainer;
    } else {
      node_to_replace = DOMHandler.getParentByTag(range.startContainer, btn.argument);
    }

    // if the element wasn't found return and continue with the process
    if (!node_to_replace) {
      return {'stopProcess': false};
    }

    // by default replace the element with a paragraph
    new_parent = DOMHandler.create('p');
    DOMHandler.replace(new_parent, node_to_replace);

    // finally select the new node
    var currentSelection = window.getSelection(),
        newRange = document.createRange();

    currentSelection.removeAllRanges();

    newRange.selectNodeContents(new_parent);
    currentSelection.addRange(newRange);

    return {'stopProcess': true};
  }


  /**
   * Init all the instance data and events
   * @param  MinisticInsance ministicInsance
   */
  var Handler = function(ministicInsance) {
    this.ministicInstance = ministicInsance;
    this.toolbar =  null;
    this.visible = false;

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
        'text': 'I',
        'command': 'italic'
      },
      {
        'text': 'U',
        'command': 'underline'
      },
      {
        'text': 'H1',
        'command': 'formatBlock',
        'argument': 'H1',
        'preprocess': toggle_element
      },
      {
        'text': 'H2',
        'command': 'formatBlock',
        'argument': 'H2',
        'preprocess': toggle_element
      },
      {
        'text': 'H3',
        'command': 'formatBlock',
        'argument': 'H3',
        'preprocess': toggle_element
      },
      {
        'icon': 'quotes-left',
        'command': 'formatBlock',
        'argument': 'BLOCKQUOTE',
        'preprocess': toggle_element
      },
      {
        'icon': 'paragraph-center',
        'command': 'justifyCenter'
      },
      {
        'icon': 'paragraph-left',
        'command': 'justifyLeft'
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

        if (Selection.isCollapsed || !DOMHandler.contains(mInstance.ministicInstance.element, range.startContainer) ) {
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

      this.highlightButton();
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

      if (btn.preprocess) {
        var response = btn.preprocess(btn);

        if (response.stopProcess) return;
      }

      document.execCommand(btn.command, false, btn.argument || null);
      this.highlightButton();
    },
    /**
     * Selects the toolbar buttons according to the selected range
     */
    highlightButton: function() {
      // Deselects all the current highlighted button
      if (current_selected_buttons.length > 0) {
        for (var i = 0, total_selected = current_selected_buttons.length; i < total_selected; i++) {
          DOMHandler.removeClass(current_selected_buttons[i], 'ministic-fancy-toolbar-button-selected');
        }

        current_selected_buttons.length = 0;
      }

      var range = window.getSelection().getRangeAt(0),
          toolbar_buttons,
          toolbar_tags,
          current_element,
          button_index,
          button_found,
          align_style;

      // When the user selects more than one element, take the common container
      // as current_element
      if (range.startContainer != range.endContainer) {
        current_element = range.commonAncestorContainer

        if (current_element == this.ministicInstance.element) return;
      } else {
        current_element = range.startContainer;
      }

      toolbar_buttons = this.toolbar.children;
      toolbar_tags = this.buttons.map(get_button_tag);


      // Loop thru the parents and select the buttons according the element style
      while (current_element != this.ministicInstance.element) {
        button_index = toolbar_tags.indexOf(current_element.tagName);
        if (~button_index) {
          button_found = toolbar_buttons[button_index];
          DOMHandler.addClass(button_found, 'ministic-fancy-toolbar-button-selected');
          current_selected_buttons.push(button_found);
        }

        if (current_element.style && (current_element.style.textAlign == 'center' || current_element.style.textAlign == 'left')) {
          align_style = current_element.style.textAlign;
          button_index = toolbar_tags.indexOf('justify' + align_style[0].toUpperCase() + align_style.substring(1));
          button_found = toolbar_buttons[button_index];
          DOMHandler.addClass(button_found, 'ministic-fancy-toolbar-button-selected');
          current_selected_buttons.push(button_found);
        }

        current_element = current_element.parentNode;
      }

    },
    /**
     * Creates the toolbar if it wasn't created, otherwise it only assings The
     * current toolbar.
     */
    create: function() {
      var toolbar, buttons, btn_conf;
      // One toolbar is shared with all Ministic instances.
      if (toolbar = document.getElementById('ministic-fancy-toolbar')) {
        this.toolbar = toolbar;
        return;
      }

      this.loadAssets();

      toolbar = DOMHandler.create('div', {'id': 'ministic-fancy-toolbar', 'class':'ministic-fancy-toolbar'})
      buttons = this.buttons;

      for (var i = 0, total = buttons.length; i < total; i++) {
        btn_conf = {
          'class':'ministic-fancy-toolbar-button',
          'data-index-cmd': i
        };

        if (buttons[i].text) {
          btn_conf.text = buttons[i].text;
        }

        if (buttons[i].icon) {
          btn_conf.class += ' toolbar-icon-' + buttons[i].icon;
        }

        toolbar.appendChild(DOMHandler.create('button', btn_conf));
      }

      // when the animation ends hide the toolbar
      toolbar.addEventListener("animationend", function(e) {
        if (e.animationName != 'hideToolbar') return;
        e.target.style.display = 'none';
      });

      toolbar.addEventListener('click', this.excAction.bind(this));

      document.body.appendChild(toolbar);
      this.toolbar = toolbar;
    },
    /**
     * Loads all the assets required by this toolbar.
     * This function must be called only one time.
     */
    loadAssets: function() {
      DOMHandler.addLinkTag(require.toUrl('') + 'src/toolbars/toolbar-fancy.css');
    }
  };

  return Handler;
});
