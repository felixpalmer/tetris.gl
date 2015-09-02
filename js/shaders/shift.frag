uniform sampler2D uTexture;

varying vec2 vUv;

#define STEP 0.03125

void main() {
  vec4 above = texture2D( uTexture, vUv + vec2( 0.0, STEP ) );
  vec4 here = texture2D( uTexture, vUv );

  // Shift block from above us (only blocks in R)
  here.r = above.r;

  gl_FragColor = here;
}

