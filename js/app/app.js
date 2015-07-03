define( ['three', 'camera', 'controls', 'geometry', 'light', 'material', 'renderer', 'rtt', 'scene', 'shader!rtt.frag'],
function ( THREE, camera, controls, geometry, light, material, renderer, RenderToTarget, scene, rttFrag ) {
  var app = {
    init: function () {
      app.mesh = new THREE.Mesh( geometry.cube, material.shader );

      var rtt = new RenderToTarget();
      rtt.init( rttFrag );
      rtt.process();
      scene.add( app.mesh );
    },
    animate: function () {
      window.requestAnimationFrame( app.animate );
      controls.update();

      app.mesh.rotation.x += 0.005;
      app.mesh.rotation.y += 0.01;

      renderer.render( scene, camera );
    }
  };
  return app;
} );
