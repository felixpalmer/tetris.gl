define( ['three', 'camera', 'controls', 'geometry', 'light', 'material', 'renderer', 'rtt', 'scene', 'texture', 'shader!simple.vert', 'shader!copy.frag', 'shader!shift.frag', 'shader!spawn.frag', 'shader!tetris.frag'],
function ( THREE, camera, controls, geometry, light, material, renderer, RenderToTarget, scene, texture, simpleVert, copyFrag, shiftFrag, spawnFrag, tetrisFrag ) {
  var app = {
    addPass: function ( fragmentShader, input ) {
      var size = 32.0;
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
      app.shiftPass = app.addPass( shiftFrag, app.spawnPass.renderTarget  );

      // Solidify pass (detect we've hit something)
      app.solidifyPass = app.addPass( tetrisFrag, app.shiftPass.renderTarget  );

      // Copy pass (copy from shift, so shift can read)
      app.copyPass = app.addPass( copyFrag, app.solidifyPass.renderTarget  );

      // Bootstrapped, now point spawn at copy to complete loop
      app.spawnPass.material.uniforms.uTexture.value = app.copyPass.renderTarget;

      // Copy to display layer
      material.shader.uniforms.uTexture.value = app.copyPass.renderTarget;
    },
    frame: 0,
    simulate: function () {
      //if ( app.frame % 11 !== 0 ) { // Throttle rate
      //  return;
      //}

      // Pipeline
      if ( app.frame % 100 === 0 ) { // Spawn rate
        app.spawnPass.material.uniforms.uRandom.value = Math.random();
        app.spawnPass.process();

        // When we spawn, want to have shift read from spawn...
        app.shiftPass.material.uniforms.uTexture.value = app.spawnPass.renderTarget;
      } else {
        // ...otherwise, just use the copy buffer
        app.shiftPass.material.uniforms.uTexture.value = app.copyPass.renderTarget;
      }
      app.shiftPass.process();
      app.solidifyPass.process();
      app.copyPass.process();
      app.frame++;
    },
    animate: function () {
      window.requestAnimationFrame( app.animate );
      //controls.update();

      for ( var i = 0; i < 1; i++ ) {
        app.simulate();
      }
      renderer.render( scene, camera );
    }
  };
  return app;
} );
