define(function() {
  var instances = {},
      BaseObject = function(DOMElement){
        this.element = DOMElement;
        this.id = '';
        this.config = {};
      };

  BaseObject.prototype = {
    enable: function() {
      this.element.setAttribute('contenteditable', true);
    },
    disable: function() {
      this.element.removeAttribute('contenteditable');
    }
  }

  return {
    create: function(DOMElement) {
      return instances[DOMElement.id] = new BaseObject(DOMElement);
    },
    getInstances: function() {
      return instances;
    }
  }
});
