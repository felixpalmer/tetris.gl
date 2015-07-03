define( ['three', 'camera', 'controls', 'geometry', 'light', 'material', 'renderer', 'rtt', 'scene', 'texture', 'shader!simple.vert', 'shader!copy.frag', 'shader!shift.frag', 'shader!spawn.frag'],
function ( THREE, camera, controls, geometry, light, material, renderer, RenderToTarget, scene, texture, simpleVert, copyFrag, shiftFrag, spawnFrag ) {
  var app = {
    init: function () {
      app.mesh = new THREE.Mesh( geometry.cube, material.shader );
      scene.add( app.mesh );

      var m = new THREE.ShaderMaterial( {
        uniforms: {
          uTexture: { type: 't', value: texture.grass }
        },
        vertexShader: simpleVert.value,
        fragmentShader: copyFrag.value
      });
      app.copyPass = new RenderToTarget();
      app.copyPass.init( m );
      material.shader.uniforms.uTexture.value = app.copyPass.renderTarget;
    },
    animate: function () {
      window.requestAnimationFrame( app.animate );
      controls.update();

      app.mesh.rotation.x += 0.005;
      app.mesh.rotation.y += 0.01;

      // Pipeline
      app.copyPass.process();

      renderer.render( scene, camera );
    }
  };
  return app;
} );
