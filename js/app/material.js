define( ['three', 'boardSize', 'shader!display.frag', 'shader!simple.vert', 'shader!simple.frag'],
function ( THREE, boardSize, displayFrag, simpleVert, simpleFrag ) {
  displayFrag.define( 'STEP', 1 / boardSize );
  var material = {
    display: new THREE.ShaderMaterial( {
      uniforms: {
        uTexture: { type: 't', value: null }
      },
      vertexShader: simpleVert.value,
      fragmentShader: displayFrag.value
    }),
    createDebugShader: function ( texture ) {
      return new THREE.ShaderMaterial( {
        uniforms: {
          uTexture: { type: 't', value: texture }
        },
        vertexShader: simpleVert.value,
        fragmentShader: simpleFrag.value
      });
    }
  };

  return material;
} );
