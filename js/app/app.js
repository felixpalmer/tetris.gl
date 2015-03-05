define( ['three', 'camera', 'controls', 'geometry', 'light', 'material', 'renderer', 'rtt', 'scene'],
function ( THREE, camera, controls, geometry, light, material, renderer, rtt, scene ) {
  var app = {
    init: function () {
      app.mesh = new THREE.Mesh( geometry.cube, material.shader );
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
