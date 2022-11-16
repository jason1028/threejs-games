// 高精度highp -2^16 ~ 2^16
// 中精度mediump -2^10 ~ 2^10
// 低精度lowp -2^8 ~ 2^8
precision lowp float;

varying vec2 vUv;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vUv = uv;
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}