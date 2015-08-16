define(function(require) {
  var loadedToolbars = {};

  return {
    /**
     * Inits all the toolbars for the specified toolbar
     * @param  MinisticInsance ministicInsance
     */
    init: function(ministicInsance) {
      var toolbars = ministicInsance.config.toolbars,
          toolbar_id = toolbars[i];

      // async load of each toolbar
      for (var i = 0, total = toolbars.length; i < total; i++) {
        toolbar_id = toolbars[i];

        // if the toolbar is already loaded, only create the instance for this editor.
        if (toolbar_id in loadedToolbars) {
          new loadedToolbars[toolbar_id](ministicInsance);
          continue;
        }

        require(['./toolbars/toolbar-' + toolbar_id], function(Toolbar) {
          loadedToolbars[toolbar_id] = Toolbar;
           new Toolbar(ministicInsance);
        });
      }
    }
  }
});
