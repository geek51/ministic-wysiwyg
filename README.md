# Ministic WYSIWYG

The Ministic WYSIWYG is a rich editor for modern browsers that is simple and beautiful.

## Requirements

### Requerejs

This plugin is built from several modules and joined together  via  requerjs.

### R.js

R.js is used to optimize the code and run in the production site.

## File Structure

Next, a brief overview of each field:

### ministic.js

Contains the plugin core controller, it controls the main functionality of the WYSIWYG.

This sub-module controls:
* Show/Hides the placeholder.
* Exposes the API, see the API section.
* Init the toolbar for each instance

### src/range.js

Has all the functions for controlling the selection range that the user performs in the WYSIWYG.

### src/toolbar.js

The controller that shows the toolbar and set the styles using the range data.
It can use different toolbars configured in the settings.
Right now only the toolbar-fancy-widget is available.

### src/widgets/toolbar-fancy-widget.js

Controls the toolbar UI, basically it controls how the toolbar is shown and the buttons to show.
This widget shows the toolbar above the user selection.
Each button has a command that tells the toolbar.js controller what action execute.

### src/widgets/toolbar-fancy-widget.css

Makes the toolbar looks beautiful.

### src/widgets/toolbar-media-widget.js

Controls the media toolbar UI, this widget shows a button when the user places
the cursor on a new line.
The button displays the toolbar that is used by the user to add:

* A video using a defined URL (this uses an iframe to wrap the video)
* An image, using a defined URL.
* A separator.

### widgets/toolbar-media-widget.css

Makes the media toolbar looks beautiful.

## API

### HTML data-* configuration

* toolbars, sets the list of toolbars to show.
* placeholder, the placeholder that will be shown when the editor is empty.
* toolbars, a comma separated string of toolbars widgets ids. If this attribute is not defined only the basic editor is loaded.

### JS methods
The following JS methods are exposed:

* getData - Gets the editor HTML.

## Browser support

Legacy browsers are not supported, this plugin works on IE 9+, Firefox, Chrome and Safari.
