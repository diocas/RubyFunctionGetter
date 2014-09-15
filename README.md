# RubyFunctionGetter

## How to use

1. Config the Parser Server with the url to listen to request.
2. Include all dependencies and pass the parameter "data-manual" to Prism library.
3. Create an object of the type RubyFunctionGetter, passing a config object.
4. Set all file calls inside HTML elements with "gettify" class.
5. Call the gettify method from the RubyFunctionGetter objetct.

## Config Syntax

*user*
The username of the repository owner.

*repository*
The repository name.

*branch*
The branch to get the code.

###

## File Call Syntax

file[:version]#method [-l lines_to_highlight] [-sl] 

*file*
Includes the path to the file separated by '/'.

*version*
Sha code from GitHub.

*method*
Path to method, including class ou module names, separated by '.'.

## Dependencies

### External Libraries

* jQuery 2.1.0
* Underscore
* Json2
* JsStorage
* Prism

### Libraries

* Gh3 (adapted)
* GitHubAccess
* Beautifier
* CodeParser
* RubyFunctionGetter


