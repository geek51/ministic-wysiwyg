define(function(){
  // overrides the default add event listener to add a few workarrounds
  var defaultAddEvent = HTMLElement.prototype.addEventListener;

  function get_transition_eventname(type, element) {
    var transitions = {
        'animation':'animationend',
        'WebkitAnimation':'webkitAnimationEnd',
        'OAnimation':'oAnimationEnd',
        'MozAnimation':'animationend',
      },
      t;

    for(t in transitions){
        if( element.style[t] !== undefined ){
            return transitions[t];
        }
    }

    return 'animationend'; // default value
  }

  HTMLElement.prototype.addEventListener = function(type, listener) {
    if (type == 'animationend') {
      type = get_transition_eventname(type, this);
    }

    defaultAddEvent.call(this, type, listener, false);
  }

  return {
    /**
     * Searches in the DOM for new instances.
     * @param  Obect savedInstances Hashmap with instances already created
     * @return Array An array of nodes that will be used to create new instaces
     */
    getNewEditors: function(savedInstances) {
      var elements = document.getElementsByClassName('ministic-editor'),
          newElements = [];

      for (var i = 0, total = elements.length; i < total; i++) {

        var instanceId = elements[i].id;

        if (typeof instanceId == 'undefined' || instanceId.length == 0) {
          throw new Error('Each Ministic instance must have an id');
        }

        if (instanceId in savedInstances) continue;

        // create a wrapper that will be used id DOM/Styles manipulation
        this.wrap(elements[i], this.create('div', {'class':'ministic-wrapper', 'styles':{'position':'relative'}}));

        newElements.push(elements[i]);
      }

      return newElements;
    },
    /**
     * Creates a new DOM element
     * @param  String tagName    the tagname to create
     * @param  Object properties DOM element propertiens
     * @return HTMLElement
     */
    create: function(tagName, properties) {
      var element = document.createElement(tagName);

      for (var propertyName in properties) {
        switch (propertyName) {
          case 'text':
            element.appendChild(document.createTextNode(properties[propertyName]));
          break;
          case 'styles':
            var styles = properties[propertyName];
            for (var name in styles) {
              element.style[name] = styles[name];
            }
          break;
          default:
            element.setAttribute(propertyName, properties[propertyName]);
        }

      }

      return element;
    },
    /**
     * Returns the element first child ignoring text nodes
     * @param  HTMLElement element
     * @return Mixed the HTMLElement or false if the element is empty.
     */
    first: function(element){
      if (element.firstChild.nodeType != 3) return element.firstChild;

      for (var i = 0, total = element.childElementCount; i < total; i++) {
        if (element.children[i].nodeType == 1) return element.children[i];
      }

      return false;
    },
    /**
     * Wraps an existet element with the specified new element
     * @param  HTMLElement element     The element to be wrapped
     * @param  HTMLElement wrap_element The wrap element
     */
    wrap: function(element, wrap_element) {
      element.parentNode.insertBefore(wrap_element, element);
      wrap_element.appendChild(element);
    },
    /**
     * Creates a new link tag.
     * @param  String src
     */
    addLinkTag: function(src) {
      document.getElementsByTagName('head')[0].appendChild(
        this.create('link', {href: src, type: 'text/css', rel: 'stylesheet'})
      );
    },
    /**
     * Adds the pased css class to the element
     * @param  HTMLElement element
     * @param  String class
     */
    addClass: function(element, new_class) {
      var existentClasess = element.className? element.className.split(' ') : [];

      if (~existentClasess.indexOf(new_class)) return;

      existentClasess.push(new_class);
      element.className = existentClasess.join(' ');
    },
    /**
     * Removes the pased css class to the element
     * @param  HTMLElement element
     * @param  String class
     */
    removeClass: function(element, old_class) {
      var existentClasess = element.className? element.className.split(' ') : [],
          index = existentClasess.indexOf(old_class);

      if (~index) {
        existentClasess.splice(index, 1);
        element.className = existentClasess.join(' ');
      }
    },
    /**
     * Checks if the child is son of the parent
     * @param  HTMLElement parent
     * @param  HTMLElement child
     * @return Boolean true if the child was found inside parent, false otherwise.
     */
    contains: function(parent, child) {
      var parentNode = child.parentNode;

      if (!parentNode) return false;

      if (parentNode == parent) return true;

      // checks all the parent until it gets to the wanted parent or the body tag
      while (parentNode != parent) {
        if (parentNode == document.body) return false;

        parentNode = parentNode.parentNode;

        if (parentNode == null) return false;
      }

      return true;
    }
  }
});
