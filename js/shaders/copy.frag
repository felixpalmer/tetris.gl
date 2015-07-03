uniform sampler2D uTexture;

varying vec2 vUv;

void main() {
  // Copy across current value
  gl_FragColor = texture2D( uTexture, vUv );
}
