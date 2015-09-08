uniform sampler2D uTexture;
uniform float uRandom;

varying vec2 vUv;

#define STEP 0.03125

bool shouldSpawn( vec2 p ) {
  return ( p.x < vUv.x && vUv.x < p.x + STEP && // One step range in x-direction
           p.y < vUv.y && vUv.y < p.y + STEP ); // One step range in y-direction
}

void main() {
  // Copy in current value
  vec4 color = texture2D( uTexture, vUv );

  // Create new pixels on top
  float x = ( 1.0 - STEP ) * fract( uRandom );
  if ( shouldSpawn( vec2( x, 1.0 - 2.0 * STEP ) ) ) { // Spawn one block from top, to avoid edge clamping
    color.r = 1.0;
  }

  //// Spawn "pairs"
  //if ( shouldSpawn( vec2( x, 1.0 - 3.0 * STEP ) ) ) {
  //  color.r = 1.0;
  //}

  // Ground
  if ( vUv.y < STEP ) {
    color.g = 1.0;
  }

  gl_FragColor = color;
}
