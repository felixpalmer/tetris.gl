define( ['three', 'camera', 'controls', 'geometry', 'light', 'material', 'renderer', 'rtt', 'scene', 'texture', 'shader!simple.vert', 'shader!copy.frag', 'shader!shift.frag', 'shader!spawn.frag', 'shader!tetris.frag'],
function ( THREE, camera, controls, geometry, light, material, renderer, RenderToTarget, scene, texture, simpleVert, copyFrag, shiftFrag, spawnFrag, tetrisFrag ) {
  var app = {
    addPass: function ( fragmentShader, input ) {
      var size = 128.0;
      fragmentShader.define( 'STEP', 1 / size );
      var mat = new THREE.ShaderMaterial( {
        uniforms: {
          uTexture: { type: 't', value: input },
          uTime: { type: 'f', value: 0 }
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
      app.spawnPass = app.addPass( spawnFrag, texture.grass );

      // Shift pass (move it along)
      app.shiftPass = app.addPass( tetrisFrag, app.spawnPass.renderTarget  );

      // Copy pass (copy from shift, so shift can read)
      app.copyPass = app.addPass( copyFrag, app.shiftPass.renderTarget  );

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
    simulate: function () {
      // Pipeline
      if ( app.frame % 1 === 0 ) {
        var t = Date.now() / 1000.0 % 1000;
        t *= 53.481274928371;
        t = Math.random();
        app.spawnPass.material.uniforms.uTime.value = t;
        app.spawnPass.process();

        // When we spawn, want to have shift read from spawn...
        app.shiftPass.material.uniforms.uTexture.value = app.spawnPass.renderTarget;
      } else {
        // ...otherwise, just use the copy buffer
        app.shiftPass.material.uniforms.uTexture.value = app.copyPass.renderTarget;
      }
      app.shiftPass.process();
      app.copyPass.process();
    },
    animate: function () {
      app.frame++;
      window.requestAnimationFrame( app.animate );
      //controls.update();

      for ( var i = 0; i < 10; i++ ) {
        app.simulate();
      }
      renderer.render( scene, camera );
    }
  };
  return app;
} );
