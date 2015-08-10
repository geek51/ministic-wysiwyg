define(function(){
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
    }
  }
});
