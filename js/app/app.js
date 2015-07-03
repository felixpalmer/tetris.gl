define( ['three', 'camera', 'controls', 'geometry', 'light', 'material', 'renderer', 'rtt', 'scene', 'shader!simple.vert', 'shader!rtt.frag'],
function ( THREE, camera, controls, geometry, light, material, renderer, RenderToTarget, scene, simpleVert, rttFrag ) {
  var app = {
    init: function () {
      app.mesh = new THREE.Mesh( geometry.cube, material.shader );

      var m =  new THREE.ShaderMaterial( {
        vertexShader: simpleVert.value,
        fragmentShader: rttFrag.value
      });
      var rtt = new RenderToTarget();
      rtt.init( m );
      material.shader.uniforms.uTexture.value = rtt.renderTarget;
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
