uniform sampler2D uTexture;

varying vec2 vUv;

void main() {
  vec3 color = texture2D( uTexture, vUv ).rgb;
  gl_FragColor = vec4( 100.0 * color, 1.0 );
}
