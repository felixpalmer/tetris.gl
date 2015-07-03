uniform sampler2D uTexture;

varying vec2 vUv;

void main() {
  // Copy in current value with offset
  vec4 color = texture2D( uTexture, vUv - vec2( 0.01, 0.0 ) );
  gl_FragColor = color;
}
