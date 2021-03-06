# v1.0.4
## Bug Fixes
### Mw List Module
- Fixed bug that the wrong link was executed when double clicking on a row. 
This happened when not every row had a mw-listable-link-show-bb` directive`
Bug is fixed and a double click will execute the correct link. 

# v1.0.3
## Features
### Modal Module
- Modal got a function to watch its scope attributes. It is not recommended to call `modal.getScope()` and add a watcher 
because the scope will be destroyed on hide so the watchers are gone. If you want to watch on scope attributes
use the `modal.watchScope(expression, callback)`. It delegates to the angular `scope.$watch` and ensures that you will 
always watch on the right scope.

# v1.0.2
## Features
### Ui Module
- The directive `mw-hide-on-request` was added to hide the transcluded content and show a spinner as long
as the backbone model or collection is syncing
    ```html
    <div mw-hide-on-reqeust="backboneModel">
      Content that sould be hidden while the model is beeing synched
     </div>
    ``` 

# v1.0.1
## Bugfixes
### List module
- The loading spinner of `mw-list-footer` will be only displayed when the collection is fetching data
and has a next page (#19)

## Features
### Backbone Module
- Collection got a request method that works as the request method of the model. 
This method can make plain ajax request that are not bound to the collection url.
- You can define a `hostName` and a `basePath` that should be used by the 
collections and models to generate the url for the remote calls.
The `hostName` and `basePath` can be defined globally by setting 
`mwUI.Backbone.hostName` and `mwUI.Backbone.basePath` and the attribute 
can be overwritten per `Model` and `Collection`

### Modal Module
- Modal can be configured with controllerAs that is exposed to the modal template
- Modal can be configured with preresolvers. All preresolvers will be resolved and injected into the controller
before the modal is opened
- Modal triggers the following events: 
    - $modalOpenStart
    - $modalResolveDependenciesStart
    - $modalResolveDependenciesSuccess
    - $modalOpenSuccess / $modalOpenError
    - $modalCloseStart
    - $modalCloseSuccess
    
### i18n Module
- Translations can be added during run time. Previously it was only possible to 
define translations in the angular config phase.
Already existing translations for keys will be overwritten.  
    ```
    i18n.extendForLocale('de_DE', {common: {helloWord: 'Hallo Welt'}});
    i18n.extend({de_DE: {common: {helloWord: 'Hallo Welt'}}, en_US: {common: {helloWord: 'Hello World'}}};
    ```

## Breaking Changes
### Backbone Module
- The attribute `baseUrl` is replaced by the new attributes `hostName` and `basePath`

### Utils Module
- The `concatUrlParts` method was moved from the `Utils` module 
into the `Backbone` module.
You have to call `mwUI.Backbone.Utils.concatUrlParts` 
instead of `window.mwUI.Utils.shims.concatUrlParts`