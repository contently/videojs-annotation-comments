---
layout: default
title: VAC Demo & Documentation
---

### Background

Collaboration between videographers and clients can be tedious, with emails and phone calls that waste time trying to reference specific frames and areas of the screen. This plugin enables more efficient collaboration from the browser.

This plugin was conceived and developed as a Hack Week project at [Contently](http://www.contently.com) by [Evan Carothers](http://www.github.com/ecaroth) and [Jack Pope](http://www.github.com/jackpope). Continuing our focus and commitment to multimedia support at Contently, the entire team productized and bulletproofed the plugin as a flexible solution to be used in our product and other open-source use cases.

### Goals

- **Efficient for videographers and clients alike** - Provides useful collaboration features including annotations, comments/replies, ranged time markers, and more, with intuitive controls.
- **SIMPLE & LIGHTWEIGHT** - Everything is contained within the plugin and player element. There is no need to build additional UI components. Just install VideoJS, register the plugin, setup whatever backend storage you wish, and start collaborating.
- **EXTENSIBLE** - The plugin can be integrated with existing commenting systems (as we did within Contently), and makes very few assumptions about how to store annotations. Custom events are available for communicating with external APIs, providing support for on-page interactions and data persistence. Simple CSS overrides can also allow for branding customizations with minimal effort, or completely custom UI/UX.

### Add it to your VideoJS player

```javascript
var player = videojs('video-id');
var plugin = player.annotationComments({})
```

[VideoJS Annotation Comments is documented on Github](https://github.com/contently/videojs-annotation-comments).

#### License

This plugin is [licensed](license.md) under the Apache License, Version 2.0, which is the same license used by Video.js
