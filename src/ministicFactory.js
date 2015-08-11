define(['src/DOMHandler'], function(DOMHandler) {
  /**
   * Hold each instance created.
   * @type Object
   */
  var instances = {},
      /**
       * Class that defines a ministic instance.
       * @param  HTMLElement DOMElement The DOM element that will hold the editor instace.
       */
      MinisticInstance = function(DOMElement){
        this.element = DOMElement;
        this.id = DOMElement.id;
        this.config = parse_config(DOMElement);
        this.placeHolder = null;
      };

  /**
   * Uses the data-X attributes to create the configuration for this instance.
   *
   * The current configurations that are supported are:
   *
   * data-placeholder: Used to set a placeholder when the edior is empty.
   * data-toolbars: The toolbats that will be placed in this editor instace.
   *
   * @see src/toolbar.js
   * @private
   * @param  HTMLElement DOMElement the configuration are saved as data-X attributes.
   * @return Object the parsed configuration.
   */
  function parse_config(DOMElement) {
    var config = {},
        toolbars = DOMElement.getAttribute('data-toolbars');

    config.placeholder = DOMElement.getAttribute('data-placeholder') || 'Edit content...';
    config.toolbars = toolbars ?  toolbars.split(',') : [];

    return config;
  }

  /**
   * Generate a placeholder for this infusion
   * @param  HTMLElement target
   * @param  String text the placeholder text
   * @return HTMLElement The placeholder element
   */
  function get_placeholder(target, text) {
    var place_holder = DOMHandler.create('p',{
        'class': 'ministic-placeholder',
        'styles': {'position':'absolute', 'zIndex': 99, 'top': '2px', 'margin': '0px'},
        'text': text
    });

    place_holder.addEventListener('click', function(){
      target.focus();
    });

    return place_holder;
  }

  MinisticInstance.prototype = {
    /**
     * Sets the placeholder when the editor instance is empty.
     * @return MinisticInstance
     */
    setPlaceHolder: function() {
      var mInstance = this,
          mElement = this.element;
      // if the element is not empty, skip this process.
      if (!this.isEmpty() || this.config.placeholder.length == 0) return this;

      this.placeHolder = get_placeholder(mElement, this.config.placeholder);
      mElement.parentNode.appendChild(this.placeHolder);

      mElement.addEventListener('keyup', function() {
        if (mInstance.isEmpty()){
            mInstance.placeHolder.style.display = 'block';
          return;
        }

        mInstance.placeHolder.style.display = 'none';
      });

      return this;
    },
    /**
     * Sets the contenteditable property to the editor instance.
     * @return MinisticInstance
     */
    enable: function() {
      this.element.setAttribute('contenteditable', true);
      return this;
    },
    /**
     * Removes the contenteditable property to the editor instance.
     * @return MinisticInstance
     */
    disable: function() {
      this.element.removeAttribute('contenteditable');
      return this;
    },
    isEmpty: function() {
      return this.element.innerText.replace(/^\s+|\s$/g, '').length == 0;
    }
  }

  return {
    /**
     * Create a new MinisticInstance object
     * @param  HTMLElement DOMElement
     * @return MinisticInstance
     */
    create: function(DOMElement) {
      return instances[DOMElement.id] = new MinisticInstance(DOMElement);
    },
    /**
     * Returns all the MinisticInstance instances
     * @return Object Hashmap with all the MinisticInstance instances, the key is the instance id.
     */
    getInstances: function() {
      return instances;
    }
  }
});
