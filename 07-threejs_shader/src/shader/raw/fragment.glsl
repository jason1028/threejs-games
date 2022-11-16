// 通知GPU按低精度计算
precision lowp float;
// 创建接收来自顶点着色器的变量uVu
varying vec2 vUv;
// 创建海拔变量
varying float vElevation;

// 纹理图
uniform sampler2D uTexture;

void main() {
    // gl_FragColor = vec4(vUv, 0.0, 1.0);
    float deep = vElevation + 0.05 * 20.0;
    // gl_FragColor = vec4(1.0 * deep, 0.0, 0.0, 1.0);

    // 根据uv，取出对应的颜色
    vec4 textureColor = texture2D(uTexture, vUv);
    // 颜色的亮度根据deep的改变而改变
    textureColor.rgb *= deep;
    // 将颜色赋值给片元着色器，类似就是纹理贴图了
    gl_FragColor = textureColor;
}