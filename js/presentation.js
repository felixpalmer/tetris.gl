/*global shower*/
// Start the app
require( ['detector', 'app', 'container', 'material', 'renderer'], function ( Detector, app, container, material, renderer ) {
  if ( ! Detector.webgl ) {
    Detector.addGetWebGLMessage();
    container.innerHTML = "";
  }

  var onHover = function() {
    renderer.setContainer( this );
  };
  app.init();
  app.tick();
  var lastSlideNumber = -1;
  var rendering = false;
  var tick = function() {
    window.requestAnimationFrame( tick );
    if ( shower.isSlideMode() ) {
      var slideNumber = shower.getCurrentSlideNumber();
      if ( slideNumber !== lastSlideNumber ) {
        // Have changed slide
        lastSlideNumber = slideNumber;

        // Check for presence of threejs container in new slide
        var slideId = shower.getSlideHash( slideNumber ).slice( 1 );
        var c = document.querySelector( "[id='" + slideId + "'] .threejs-container" );
        if ( c ) {
          rendering = true;
          renderer.setContainer( c );
          c.removeEventListener( 'mouseover', onHover );
          c.addEventListener( 'mouseover', onHover );
          c.removeEventListener( 'mouseout', onHover );
          c.addEventListener( 'mouseout', onHover );
        } else {
          rendering = false;
        }

        // Insert slide specific setup here
        if ( slideNumber === 1 ) {
          app.gui.domElement.style.display = 'block';
        } else {
          app.gui.domElement.style.display = 'none';
        }
      }

      if ( rendering ) {
        app.tick();
      }
    }
  };
  tick();
} );
