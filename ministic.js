require(['src/toolbar', 'src/DOMHandler', 'src/ministicFactory'], function(Toolbar, DOMHandler, Factory) {
  var initialEditors = DOMHandler.getNewEditors([]);

  for (var i = 0, total = initialEditors.length; i < total; i++) {
    Toolbar.init(Factory.create(initialEditors[i]).enable().setPlaceHolder());
  }
});
