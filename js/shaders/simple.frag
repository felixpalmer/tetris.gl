uniform sampler2D uTexture;

varying vec2 vUv;

void main() {
  vec3 color = texture2D( uTexture, vUv ).rgb;
  color += vec3( 0.1 );
  gl_FragColor = vec4( color, 1.0 );
}
