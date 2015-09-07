define( ['three', 'boardSize', 'camera', 'container', 'controls', 'dat', 'geometry', 'light', 'material', 'renderer', 'rtt', 'scene', 'texture', 'shader!simple.vert', 'shader!copy.frag', 'shader!shift.frag', 'shader!solidify.frag', 'shader!spawn.frag'],
function ( THREE, boardSize, camera, container, controls, dat, geometry, light, material, renderer, RenderToTarget, scene, texture, simpleVert, copyFrag, shiftFrag, solidifyFrag, spawnFrag ) {
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

      // Listen for clicks
      container.addEventListener( 'click', app.raycast );

      // GUI controls
      var gui = new dat.GUI();
      gui.add( app, 'simulationRate', 1, 100 ).step( 1 );
      gui.add( app, 'renderThrottle', 1, 100 ).step( 1 );
      gui.add( app, 'clear');
    },
    blank: new THREE.Texture(),
    needsClear: false,
    clear: function () {
      app.needsClear = true;
    },
    frame: 0,
    simulationFrame: 0,
    simulationRate: 1, // How many simulations frames are done per render step
    renderThrottle: 40, // How rAF calls we have per render step (1 for no throttling)
    simulate: function () {
      if ( app.needsClear ) {
        // Read blank texture into copyPass to clear out game state
        app.copyPass.material.uniforms.uTexture.value = app.blank;
        app.copyPass.process();
        app.copyPass.material.uniforms.uTexture.value = app.solidifyPass.renderTarget;
        app.needsClear = false;
      }

      if ( app.simulationFrame % 5 === 0 ) { // Spawn rate
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
      //controls.update();

      if ( app.frame % app.renderThrottle === 0 ) {
        for ( var i = 0; i < app.simulationRate; i++ ) { app.simulate(); }
      }
      app.frame++;
      
      // Move camera towards target location
      if ( app.cameraTarget ) {
        camera.position.lerp( app.cameraTarget, 0.1 );
      }
      renderer.render( scene, camera );
    },
    cameraTarget: new THREE.Vector3( 0, 0, 400 ),
    raycast: function ( e ) {
      // Reliably get mouse position across browsers
      var target = e.target || e.srcElement,
      rect = target.getBoundingClientRect(),
      offsetX = e.clientX || e.pageX,
      offsetY = e.clientY || e.pageY;
      offsetX -= rect.left,
      offsetY -= rect.top;

      var mouse = {
        x: ( offsetX / container.offsetWidth ) * 2 - 1, // -1 -> 1
        y: -( offsetY / container.offsetHeight ) * 2 + 1 // 1 -> -1
      };
      var vector = new THREE.Vector3( mouse.x, mouse.y, camera.near );
      vector.unproject( camera );
      var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
      // See if the ray from the camera into the world hits one of our meshes
      var intersects = raycaster.intersectObjects( scene.children, true );
      if ( intersects.length > 0 ) {
        var object = intersects[0].object;
        app.cameraTarget = object.position.clone();
        app.cameraTarget.z = 400;
      } else {
        app.cameraTarget.set( 0, 300, 1200 );
      }
    }
  };

  return app;
} );
