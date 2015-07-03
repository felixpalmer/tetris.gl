uniform sampler2D uTexture;

varying vec2 vUv;

void main() {
  // Copy in current value
  vec4 color = texture2D( uTexture, vUv );

  // Create new pixels on left
  if ( vUv.y > 0.81 ) {
    color.r = 1.0;
  }

  if ( 0.01 < vUv.y && vUv.y < 0.02 ) {
    color.b = 1.0;
  }

  gl_FragColor = color;
}
