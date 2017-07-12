# Annotations Plugin for VideoJS

## Collaboration through in-player annotations

##### Goals:

- Provide useful collaboration features including annotations, comments/replies, ranged time markers, and more. All with intuitive controls.
- Everything is contained within the player. There is no need to build additional UI components. Just install VideoJS, register the plugin, and start collaborating.
- The plugin can be integrated with existing commenting systems. Custom events are available for communicating with external APIs, providing support for on-page interactions and data persistence. **(In the works)*

### VideoJS Plugins

[VideoJS](http://docs.videojs.com/) is a popular open source HTML5 video player library used by 400k+ sites. As of v6, there is an extendable plugin architecture which was used to create this plugin. Here are some [examples of other VideoJS plugins.](https://github.com/videojs/video.js/wiki/Plugins). This plugin is built against [VideoJS v 6.2.0](https://www.npmjs.com/package/video.js/)

### Develop and Build

We're using [npm](https://www.npmjs.com/) for package management and [gulp](https://github.com/gulpjs/gulp) as our build system. The fastest way to get started is to clone the repo, run `npm install`, and then `gulp watch`. Visit `http://localhost:3004/test.html` to see the magic happen.


#### Gulp commands

`gulp watch`: fires up webserver @ `http://localhost:3004/test.html` and watches for any file changes in `/src` (which repackages and transpiles to unminified file in `/build`)

`gulp transpile`: Transpiles modules/files to build file in `/build` with JS maps

`gulp build`: runs transpile then minifies to distributino filename in `/build` with attribution
