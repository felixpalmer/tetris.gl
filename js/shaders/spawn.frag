uniform sampler2D uTexture;
uniform float uTime;

varying vec2 vUv;

#define STEP 0.03125

void main() {
  // Copy in current value
  vec4 color = texture2D( uTexture, vUv );

  // Create new pixels on top
  float x = 0.99 * fract( uTime );
  if ( x < vUv.x && vUv.x < x + STEP &&
       1.0 - ( 2.0 * STEP ) < vUv.y && vUv.y < 1.0 - STEP ) { // Spawn near top, with gap
    color.x = 1.0;
  }

  gl_FragColor = color;
}
