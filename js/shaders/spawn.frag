uniform sampler2D uTexture;

varying vec2 vUv;

void main() {
  // Copy in current value
  vec4 color = texture2D( uTexture, vUv );

  // Create new pixels on left
  if ( vUv.x < 0.01 ) {
    color.r = 1.0;
  }

  gl_FragColor = color;
}
