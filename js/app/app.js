define( ['three', 'camera', 'controls', 'geometry', 'light', 'material', 'renderer', 'rtt', 'scene', 'texture', 'shader!simple.vert', 'shader!copy.frag', 'shader!shift.frag', 'shader!spawn.frag'],
function ( THREE, camera, controls, geometry, light, material, renderer, RenderToTarget, scene, texture, simpleVert, copyFrag, shiftFrag, spawnFrag ) {
  var app = {
    init: function () {
      app.mesh = new THREE.Mesh( geometry.cube, material.shader );
      scene.add( app.mesh );

      // Spawn pass (create new stuff)
      var mat = new THREE.ShaderMaterial( {
        uniforms: {
          uTexture: { type: 't', value: texture.grass }
        },
        vertexShader: simpleVert.value,
        fragmentShader: spawnFrag.value
      });
      app.spawnPass = new RenderToTarget();
      app.spawnPass.init( mat );

      // Shift pass (move it along)
      mat = new THREE.ShaderMaterial( {
        uniforms: {
          uTexture: { type: 't', value: app.spawnPass.renderTarget }
        },
        vertexShader: simpleVert.value,
        fragmentShader: shiftFrag.value
      });
      app.shiftPass = new RenderToTarget();
      app.shiftPass.init( mat );

      // Copy pass (copy from shift, so shift can read)
      mat = new THREE.ShaderMaterial( {
        uniforms: {
          uTexture: { type: 't', value: app.shiftPass.renderTarget }
        },
        vertexShader: simpleVert.value,
        fragmentShader: copyFrag.value
      });
      app.copyPass = new RenderToTarget();
      app.copyPass.init( mat );

      // Initial render
      app.spawnPass.process();
      app.shiftPass.process();
      app.copyPass.process();

      // Bootstrapped, now point spawn at copy to complete loop
      app.spawnPass.material.uniforms.uTexture.value = app.copyPass.renderTarget;

      // Copy to graphical layer
      material.shader.uniforms.uTexture.value = app.copyPass.renderTarget;
    },
    frame: 0,
    animate: function () {
      app.frame++;
      window.requestAnimationFrame( app.animate );
      controls.update();

      app.mesh.rotation.x += 0.005;
      app.mesh.rotation.y += 0.01;

      // Pipeline
      if ( app.frame % 2 === 0 ) {
        app.spawnPass.process();
      }
      app.shiftPass.process();
      app.copyPass.process();

      renderer.render( scene, camera );
    }
  };
  return app;
} );
