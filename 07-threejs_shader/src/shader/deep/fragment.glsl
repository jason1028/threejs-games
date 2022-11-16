// 通知GPU按低精度计算
precision lowp float;

varying vec2 vUv;

void main() {
    // 通过顶点对应的uv，决定每一个像素图像的位置，通过这个位置x,y来决定颜色
    // gl_FragColor = vec4(vUv, 0.0, 1.0);

    // 2对第一种变形
    // gl_FragColor = vec4(vUv, 1.0, 1.0);

    // 利用uv实现渐变，从左到右，从下到上
    // vUv.x = 
    float strength = 1.0 - vUv.y;
    gl_FragColor = vec4(strength, strength, strength, 1);
}