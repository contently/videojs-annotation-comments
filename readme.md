### Gulp commands

`gulp watch`: fires up webserver @ http://localhost:3004/test.html and watches for any file changes in /src (which repackages and transpiles to unminified file in "/build/")

`gulp transpile`: Transpiles modules/files to build file in "./build" with JS maps

`gulp build`: runs transpile then minifies to distributino filename in "./build" with attribution