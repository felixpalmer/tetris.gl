uniform sampler2D uTexture;

varying vec2 vUv;

#define STEP 0.03125

// Only consider if block below us is solid. Fails to work if we have a non-solid
// block below us, below which is a solid block. In this case, we "fall through"
bool naiveHitBlock() {
  vec4 below = texture2D( uTexture, vUv - vec2( 0.0, STEP ) );
  return below.g > 0.5;
}

// Also consider up to 7 blocks below us if we have a moving block below
bool betterHitBlock() {
  for ( float offset = STEP; offset < 7.0 * STEP; offset += STEP ) {
    vec4 below = texture2D( uTexture, vUv - vec2( 0.0, offset ) );
    if ( below.g > 0.5 ) {
      // Block below us is solid. We have a hit!
      return true;
    }
    if ( below.r > 0.5 ) {
      // There is a non-solid block below us, need to check below it
      continue;
    }

    // Otherwise, we have empty space
    return false;
  }
}

void main() {
  vec4 here = texture2D( uTexture, vUv );

  // If we at bottom, solidify by writing out into G channel instead
  bool alive = here.r > 0.5; // Block is alive (moving)
  //if ( alive && naiveHitBlock ) {
  if ( alive && betterHitBlock() ) {
    // To mark a block as settled, change it from red to green
    here.rg = here.gr;
  }

  gl_FragColor = here;
}
