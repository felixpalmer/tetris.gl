define( ['three', 'camera', 'controls', 'geometry', 'light', 'material', 'renderer', 'rtt', 'scene', 'texture', 'shader!simple.vert', 'shader!copy.frag', 'shader!shift.frag', 'shader!spawn.frag', 'shader!tetris.frag'],
function ( THREE, camera, controls, geometry, light, material, renderer, RenderToTarget, scene, texture, simpleVert, copyFrag, shiftFrag, spawnFrag, tetrisFrag ) {
  var app = {
    addPass: function ( fragmentShader, input ) {
      var size = 16.0;
      fragmentShader.define( 'STEP', 1 / size );
      var mat = new THREE.ShaderMaterial( {
        uniforms: {
          uTexture: { type: 't', value: input },
          uRandom: { type: 'f', value: 0 }
        },
        vertexShader: simpleVert.value,
        fragmentShader: fragmentShader.value
      });
      return new RenderToTarget( mat, size );
    },
    init: function () {
      app.mesh = new THREE.Mesh( geometry.plane, material.shader );
      scene.add( app.mesh );

      // Spawn pass (create new stuff)
      app.spawnPass = app.addPass( spawnFrag, null ); // Will add target later

      // Shift pass (move it along)
      app.shiftPass = app.addPass( shiftFrag, null ); // Will add target later

      // Solidify pass (detect we've hit something)
      app.solidifyPass = app.addPass( tetrisFrag, app.shiftPass.renderTarget  );

      // Copy pass (copy from shift, so shift can read)
      app.copyPass = app.addPass( copyFrag, app.solidifyPass.renderTarget  );

      // Bootstrapped, now point spawn and shift at copy to complete loop
      app.spawnPass.material.uniforms.uTexture.value = app.copyPass.renderTarget;
      app.shiftPass.material.uniforms.uTexture.value = app.copyPass.renderTarget;

      // Copy to display layer
      material.shader.uniforms.uTexture.value = app.copyPass.renderTarget;
    },
    frame: 0,
    simulationFrame: 0,
    simulationRate: 1, // How many simulations frames are done per render step
    renderThrottle: 10, // How rAF calls we have per render step (1 for no throttling)
    simulate: function () {
      // Pipeline
      if ( app.simulationFrame % 20 === 0 ) { // Spawn rate (one every 100 frames)
        // Spawn new block
        app.spawnPass.material.uniforms.uRandom.value = Math.random();
        app.spawnPass.process();

        // When we spawn, want to have solidify read from spawn...
        app.solidifyPass.material.uniforms.uTexture.value = app.spawnPass.renderTarget;
        app.solidifyPass.process();
        app.copyPass.process();
      } else {
        // ...otherwise, read from shift
        app.solidifyPass.material.uniforms.uTexture.value = app.shiftPass.renderTarget;
        app.shiftPass.process();
        app.solidifyPass.process();
        app.copyPass.process();
      }
      app.simulationFrame++;
    },
    animate: function () {
      window.requestAnimationFrame( app.animate );
      controls.update();

      if ( app.frame % app.renderThrottle === 0 ) {
        for ( var i = 0; i < app.simulationRate; i++ ) { app.simulate(); }
      }
      app.frame++;

      renderer.render( scene, camera );
    }
  };
  return app;
} );
