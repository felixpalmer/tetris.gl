uniform sampler2D uTexture;

varying vec2 vUv;

#define STEP 0.03125

void main() {
  // Get data about game state
  vec3 color = texture2D( uTexture, vUv ).rgb;

  // Not interested in colors anymore, just make green if we have block
  if ( length( color ) > 0.0 ) {
    color = vec3( vUv.y, 0.87, 0.6 ); // green
  } else {
    color = vec3( 0.0 ); // black
  }

  // Add background
  color += vec3( 0.1 );

  // Add grid
  color += 0.1 * step( 0.99, cos( 6.283185307179586 * vUv.x / STEP ) );
  color += 0.1 * step( 0.99, cos( 6.283185307179586 * vUv.y / STEP ) );

  gl_FragColor = vec4( color, 1.0 );
}
