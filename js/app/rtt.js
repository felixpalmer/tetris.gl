define( ['three', 'material', 'shader!simple.vert', 'renderer'], function ( THREE, material, simpleVert, renderer ) {
  var RenderToTarget = function () {
    this.camera = null;
    this.renderTarget = null;
    this.scene = new THREE.Scene();
    this.material = null;
  };

  RenderToTarget.prototype.init = function ( shader ) {
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
    this.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 10000 );
    this.scene.add( this.camera );
    this.camera.position.z = 1.0;
    this.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
    this.camera.left = -1;
    this.camera.right = 1;
    this.camera.top = 1;
    this.camera.bottom = -1;
    this.camera.updateProjectionMatrix();

    // Render a green square in the center of the render target
    this.renderTarget = new THREE.WebGLRenderTarget( width, width, parameters );

    this.material = new THREE.ShaderMaterial( {
      vertexShader: simpleVert.value,
      fragmentShader: shader.value
    });
    var plane = new THREE.Mesh( new THREE.PlaneGeometry( 1, 1 ), this.material );
    this.scene.add( plane );
  };

  RenderToTarget.prototype.process = function () {
    console.log( 'Processing RTT' );
    renderer.render( this.scene, this.camera, this.renderTarget, true );
    material.shader.uniforms.uTexture.value = this.renderTarget;
    console.log( 'Processed RTT' );
  };

  return RenderToTarget;
} );
