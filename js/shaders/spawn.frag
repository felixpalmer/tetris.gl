uniform sampler2D uTexture;
uniform float uTime;

varying vec2 vUv;

void main() {
  // Copy in current value
  vec4 color = texture2D( uTexture, vUv );

  // Create new pixels on top
  float x = 0.99 * fract( uTime );
  if ( x < vUv.x && vUv.x < x + 0.01 &&
       0.05 < vUv.y && vUv.y < 0.1 ) {
    color.y = 1.0;
  }

  gl_FragColor = color;
}
