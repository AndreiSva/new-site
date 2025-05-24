precision highp float;

uniform vec3 balls[MAX_BALLS];
uniform vec2 size;

const vec3 FILL_COLOUR = vec3(0.0, 0.0, 0.0);
const vec3 NOFILL_COLOUR = vec3(1.0, 1.0, 1.0);
const float THRESHOLD = 3.3;

out vec4 fragColour;

void main() {
    float v = 0.0;
    for (int i = 0; i < MAX_BALLS; i++) {
        if (all(equal(balls[i], vec3(0.0)))) {
            break;
        }

        float dist = distance(gl_FragCoord.xy, balls[i].xy);
        v += balls[i].z * balls[i].z / (dist * dist + 0.0001);
    }

    float contour = smoothstep(THRESHOLD - 0.02, THRESHOLD + 0.02, v);
    vec3 colour = mix(NOFILL_COLOUR, FILL_COLOUR, contour);
    fragColour = vec4(colour, 1.0);
}
