uniform sampler2D uTexture;

varying vec2 vUv;

void main() {
  gl_FragColor = vec4( 0.1, 0.1, 0.1, 1.0 ) + texture2D( uTexture, vUv );
}
