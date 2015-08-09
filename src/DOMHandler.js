define(function(){
  return {
    /**
     * Searches in the DOM for new instances.
     * @param  Obect savedInstances Hashmap with instances already created
     * @return Array An array of nodes that will be used to create new instaces
     */
    'getNewEditors' : function(savedInstances) {
      var elements = document.getElementsByClassName('ministic-editor'),
          newElements = [];

      for (var i = 0, total = elements.length; i < total; i++) {

        var instanceId = elements[i].id;

        if (typeof instanceId == 'undefined') {
          throw new Error('Each Ministic instance must have an id');
        }

        if (instanceId in savedInstances) continue;

        newElements.push(elements[i]);
      }

      return newElements;
    }
  }
});
