uniform sampler2D uTexture;

varying vec2 vUv;

#define STEP 0.03125

void main() {
  // Get data about game state
  vec3 color = texture2D( uTexture, vUv ).rgb;
  bool block =  length( color ) > 0.0;

  // Add grid
  color += 0.1 * step( 0.99, cos( 6.283185307179586 * vUv.x / STEP ) );
  color += 0.1 * step( 0.99, cos( 6.283185307179586 * vUv.y / STEP ) );

  gl_FragColor = vec4( color, 1.0 );
}
