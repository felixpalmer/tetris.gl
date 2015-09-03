define( ['three', 'boardSize', 'shader!simple.vert', 'shader!simple.frag', 'texture'],
function ( THREE, boardSize, simpleVert, simpleFrag, texture ) {
  simpleFrag.define( 'STEP', 1 / boardSize );
  var material = {
    bump: new THREE.MeshPhongMaterial( { bumpMap: texture.grass } ),
    grass: new THREE.MeshBasicMaterial( { map: texture.grass } ),
    shader: new THREE.ShaderMaterial( {
      uniforms: {
        uColor: { type: 'c', value: new THREE.Color( '#ff0000' ) },
        uTexture: { type: 't', value: null }
      },
      vertexShader: simpleVert.value,
      fragmentShader: simpleFrag.value
    }),
    solid: new THREE.MeshLambertMaterial( {
      color: 0x00dcdc,
      shading: THREE.FlatShading
    }),
    wire: new THREE.MeshBasicMaterial( { wireframe: true } )
  };

  return material;
} );
