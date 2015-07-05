uniform sampler2D uTexture;

varying vec2 vUv;

#define STEP 0.03125

void main() {
  vec4 above = texture2D( uTexture, vUv + vec2( 0.0, STEP ) );
  vec4 here = texture2D( uTexture, vUv );
  vec4 below = texture2D( uTexture, vUv - vec2( 0.0, STEP ) );

  // First shift (only blocks in R)
  here.r = above.r;

  // If we at bottom, solidify by writing out into G channel instead
  bool atBottom = here.r > 0.5 && vUv.y < 0.1; 
  bool hitBlock = below.g > 0.5;
  bool alive = here.r > 0.5;
  if ( alive && ( atBottom || hitBlock ) ) {
    here.rg = here.gr;
  }

  gl_FragColor = here;
}
