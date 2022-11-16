// 高精度highp -2^16 ~ 2^16
// 中精度mediump -2^10 ~ 2^10
// 低精度lowp -2^8 ~ 2^8
precision lowp float;

// 生命属性
attribute vec3 position;
attribute vec2 uv;

// 矩阵，集合一般用uniform声明，一般用于通用属性
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
// 获取时间
uniform float uTime;

// 声明一个可传入片元着色器的二维变量uVu
varying vec2 vUv;

// 声明一个海拔高度
varying float vElevation;



void main() {
    // 将uv传入片元着色器
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    // modelPosition.x += 1.0;
    // modelPosition.z += 1.0;

    modelPosition.z = sin((modelPosition.x + uTime) * 10.0) * 0.05;
    modelPosition.z += sin((modelPosition.y + uTime) * 10.0) * 0.05;

    // 传入片元着色器
    vElevation = modelPosition.z;

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}