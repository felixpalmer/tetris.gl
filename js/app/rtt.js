define( ['three', 'renderer'],
function ( THREE, renderer ) {
  var rtt = {
    camera: null,
    renderTarget: null,
    scene: new THREE.Scene(),
    material: null,
    init: function () {
      // Define parameters for render target
      var parameters = {
        format: THREE.RGBAFormat,
        stencilBuffer: false,
        type: THREE.UnsignedByteType,
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping
      };
      var width = 2048;

      // Create a camera that will capture a square from -1 to 1
      rtt.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 10000 );
      rtt.scene.add( rtt.camera );
      rtt.camera.position.z = 1.0;
      rtt.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
      rtt.camera.left = -1;
      rtt.camera.right = 1;
      rtt.camera.top = 1;
      rtt.camera.bottom = -1;
      rtt.camera.updateProjectionMatrix();

      // Render a green square in the center of the render target
      rtt.renderTarget = new THREE.WebGLRenderTarget( width, width, parameters );
      var plane = new THREE.Mesh( new THREE.PlaneGeometry( 1, 1 ), new THREE.MeshBasicMaterial( {color: 'green'} ) );
      rtt.scene.add( plane );
    },
    process: function () {
      renderer.render( rtt.scene, rtt.camera, rtt.renderTarget, true );
    }
  };

  rtt.init();
  rtt.process();
  return rtt;
} );
