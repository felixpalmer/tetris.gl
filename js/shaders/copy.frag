uniform sampler2D uTexture;

varying vec2 vUv;

void main() {
  // Copy across current value (ensure 0 or 1)
  gl_FragColor = floor( texture2D( uTexture, vUv ) );
}
