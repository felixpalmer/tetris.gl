define( ['three', 'renderer'], function ( THREE, renderer ) {
  var RenderToTarget = function ( material, width ) {
    this.camera = null;
    this.renderTarget = null;
    this.scene = new THREE.Scene();
    this.material = null;

    // Define parameters for render target
    var parameters = {
      format: THREE.RGBAFormat,
      depthBuffer: false,
      stencilBuffer: false,
      type: THREE.UnsignedByteType,
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter
    };
    width = width | 64;

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

    // Render onto quad
    this.renderTarget = new THREE.WebGLRenderTarget( width, width, parameters );
    this.material = material;
    var plane = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), this.material );
    this.scene.add( plane );
  };

  RenderToTarget.prototype.process = function () {
    renderer.render( this.scene, this.camera, this.renderTarget, true );
  };

  return RenderToTarget;
} );
