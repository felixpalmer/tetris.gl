Render to texture iOS bug
=========================

Example of bug where rendering to a floating point buffer fails on iOS.

[Live demo](http://felixpalmer.github.io/render-2-texture) of this repository can be found at [https://github.com/felixpalmer/render-2-texture](http://felixpalmer.github.io/render-2-texture)

Take a look `rtt.js`, changing the type from `THREE.FloatType` to `THREE.UnsignedByteType` to demonstrate the issue.

![](https://github.com/felixpalmer/render-2-texture/raw/master/rtt.png)

Running
=======

Just host this directory with a webserver of your choice. You can also use the `webserver.sh` script included (provided you have Python) to set up a simple development server.

Then visit http://localhost:4444 in your browser. To view on an iOS device, connect the iOS device to the same network as your computer and then access via the computer's local IP, e.g. 10.0.0.1:4444

