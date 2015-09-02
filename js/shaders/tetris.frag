uniform sampler2D uTexture;

varying vec2 vUv;

#define STEP 0.03125

bool naiveHitBlock() {
  vec4 below = texture2D( uTexture, vUv - vec2( 0.0, STEP ) );
  return below.g > 0.5;
}

void main() {
  vec4 above = texture2D( uTexture, vUv + vec2( 0.0, STEP ) );
  vec4 here = texture2D( uTexture, vUv );

  // First shift (only blocks in R)
  here.r = above.r;

  // If we at bottom, solidify by writing out into G channel instead
  bool atBottom = here.r > 0.5 && vUv.y < 0.1; // Block exists and is below threshold
  bool alive = here.r > 0.5; // Block is alive (moving)
  if ( alive && ( atBottom || naiveHitBlock() ) ) {
    // To mark a block as settled, change it from red to green
    here.rg = here.gr;
  }

  if ( here.g > 0.0 ) {
    here.b += 0.01;
  }

  gl_FragColor = here;
}
