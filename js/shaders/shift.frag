uniform sampler2D uTexture;

varying vec2 vUv;

#define STEP 0.03125

void main() {
  // Copy in current value with offset
  vec4 color = texture2D( uTexture, vUv + vec2( 0.0, STEP ) );
  gl_FragColor = color;
}
