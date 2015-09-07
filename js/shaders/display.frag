uniform sampler2D uTexture;

varying vec2 vUv;

#define STEP 0.03125

void main() {
  // Get data about game state
  vec3 color = texture2D( uTexture, vUv ).rgb;
  bool block =  length( color ) > 0.0;

  // Not interested in colors anymore, just make green if we have block
  if ( block ) {
    color = vec3( vUv.y, 0.987, 0.46 ); // green
  } else {
    color = vec3( 0.0 ); // black
  }

  // Add background
  color += vec3( 0.1 );

  // Add grid
  color += 0.1 * step( 0.99, cos( 6.283185307179586 * vUv.x / STEP ) );
  color += 0.1 * step( 0.99, cos( 6.283185307179586 * vUv.y / STEP ) );

  if ( block ) {
    vec2 blockUv = fract( vUv / STEP );
    
    // Shading
    color *= 0.3 + 0.7 * blockUv.x * blockUv.y;
    
    // Border
    vec2 border = step( vec2( 0.9 ), blockUv ) + step( blockUv, vec2( 0.1 ) );
    color -= 0.35 * ( border.x + border.y );
  }
  
  gl_FragColor = vec4( color, 1.0 );
}
