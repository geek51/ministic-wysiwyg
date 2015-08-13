define(function(require) {

  return {
    /**
     * Inits all the toolbars for the specified toolbar
     * @param  MinisticInsance ministicInsance
     */
    init: function(ministicInsance) {
      var toolbars = ministicInsance.config.toolbars;

      // async load of each toolbar
      for (var i = 0, total = toolbars.length; i < total; i++) {
        require(['./toolbars/toolbar-' + toolbars[i]], function(toolbar){
           new toolbar(ministicInsance);
        });
      }
    }
  }
});
