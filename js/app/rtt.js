define( ['three', 'material', 'renderer'], function ( THREE, material, renderer ) {
  var RenderToTarget = function () {
    this.camera = null;
    this.renderTarget = null;
    this.scene = new THREE.Scene();
    this.material = null;
  };

  RenderToTarget.prototype.init = function () {
    console.log( 'Initializing RTT' );
    // Define parameters for render target
    var parameters = {
      format: THREE.RGBAFormat,
      // If we do not disable the depth buffer get these errors:
      // [Warning] WebGL: INVALID_FRAMEBUFFER_OPERATION: clear: framebuffer not complete (three.min.js, line 428)
      // [Warning] WebGL: INVALID_FRAMEBUFFER_OPERATION: drawElements: framebuffer not complete (three.min.js, line 449)
      depthBuffer: false,
      stencilBuffer: false,
      type: THREE.FloatType, // Works on desktop, fails on iOS
      //type: THREE.UnsignedByteType, // works on both
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping
      //magFilter: THREE.NearestFilter // makes no difference
      //minFilter: THREE.LinearMipMapNearestFilter // makes no difference
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
    var plane = new THREE.Mesh( new THREE.PlaneGeometry( 1, 1 ), material.rtt );
    rtt.scene.add( plane );
  };

  RenderToTarget.prototype.process = function () {
    console.log( 'Processing RTT' );
    renderer.render( rtt.scene, rtt.camera, rtt.renderTarget, true );
    material.shader.uniforms.uTexture.value = rtt.renderTarget;
    console.log( 'Processed RTT' );
  };

  var rtt = new RenderToTarget();

  rtt.init();
  rtt.process();
  return rtt;
} );
