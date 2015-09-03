define( ['three', 'boardSize', 'camera', 'controls', 'geometry', 'light', 'material', 'renderer', 'rtt', 'scene', 'texture', 'shader!simple.vert', 'shader!copy.frag', 'shader!shift.frag', 'shader!solidify.frag', 'shader!spawn.frag'],
function ( THREE, boardSize, camera, controls, geometry, light, material, renderer, RenderToTarget, scene, texture, simpleVert, copyFrag, shiftFrag, solidifyFrag, spawnFrag ) {
  var app = {
    addPass: function ( fragmentShader, input ) {
      fragmentShader.define( 'STEP', 1 / boardSize );
      var mat = new THREE.ShaderMaterial( {
        uniforms: {
          uTexture: { type: 't', value: input },
          uRandom: { type: 'f', value: 0 }
        },
        vertexShader: simpleVert.value,
        fragmentShader: fragmentShader.value
      });
      return new RenderToTarget( mat, boardSize );
    },
    init: function () {
      // Spawn pass (create new stuff)
      app.spawnPass = app.addPass( spawnFrag, null ); // Will add target later

      // Shift pass (move it along)
      app.shiftPass = app.addPass( shiftFrag, null ); // Will add target later

      // Solidify pass (detect we've hit something)
      app.solidifyPass = app.addPass( solidifyFrag, app.shiftPass.renderTarget  );

      // Copy pass (copy from shift, so shift can read)
      app.copyPass = app.addPass( copyFrag, app.solidifyPass.renderTarget  );

      // Bootstrapped, now point spawn and shift at copy to complete loop
      app.spawnPass.material.uniforms.uTexture.value = app.copyPass.renderTarget;
      app.shiftPass.material.uniforms.uTexture.value = app.copyPass.renderTarget;

      // Copy to display layer
      material.display.uniforms.uTexture.value = app.copyPass.renderTarget;

      // Add game board to visible stage
      var mesh = new THREE.Mesh( geometry.plane, material.display );
      scene.add( mesh );

      // Add debug passes above main game
      var spacing = 600;
      var offset = -spacing;
      [app.spawnPass, app.shiftPass, app.solidifyPass].forEach( function ( pass ) {
        mesh = new THREE.Mesh( geometry.plane, material.createDebugShader( pass.renderTarget ) );
        mesh.position.x = offset;
        mesh.position.y = spacing;
        offset += spacing;
        scene.add( mesh );
      } );
    },
    frame: 0,
    simulationFrame: 0,
    simulationRate: 1, // How many simulations frames are done per render step
    renderThrottle: 40, // How rAF calls we have per render step (1 for no throttling)
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
