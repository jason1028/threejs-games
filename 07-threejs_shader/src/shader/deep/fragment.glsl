// 通知GPU按低精度计算
precision lowp float;

varying vec2 vUv;
uniform float uTime;
uniform float uScale;

#define PI 3.1415926;

// 随机效果，函数声明必须放前面，语法；
float random (vec2 st) {
    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}

// 旋转
vec2 rotate(vec2 uv, float rotation, vec2 mid) {
    return vec2(
        cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
        cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

// 噪声
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

void main() {
    // 通过顶点对应的uv，决定每一个像素图像的位置，通过这个位置x,y来决定颜色
    // gl_FragColor = vec4(vUv, 0.0, 1.0);

    // 2对第一种变形
    // gl_FragColor = vec4(vUv, 1.0, 1.0);

    // 利用uv实现渐变，从左到右，从下到上
    // float strength = vUv.x;
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 利用uv实现渐变，从上到下
    // float strength = 1.0 - vUv.y;
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 实现剧烈一点的变化
    // float strength = vUv.y * 10.0;
    
    // 通过取模实现反复渐变
    // float strength = mod(vUv.y * 10.0, 1.0);

    // 通过step(edge, x)如果 <edge, 返回0.0, 否则返回1.0 黑白相间(斑马条纹)
    // float strength = mod(vUv.y * 10.0, 1.0);
    // strength = step(0.6, strength);


    // 通过step(edge, x)如果 <edge, 返回0.0, 否则返回1.0 黑白相间(斑马条纹)
    // float strength = mod(vUv.x * 10.0, 1.0);
    // strength = step(0.6, strength);

    // x, y条纹相加
    // float strength = step(0.6, mod(vUv.x * 10.0, 1.0));
    // strength = strength + step(0.6, mod(vUv.y * 10.0, 1.0));

    // x, y条纹相乘
    // float strength = step(0.6, mod(vUv.x * 10.0, 1.0));
    // strength *= step(0.6, mod(vUv.y * 10.0, 1.0));

    // x, y条纹相减
    // float strength = step(0.6, mod(vUv.x * 10.0, 1.0));
    // strength -= step(0.6, mod(vUv.y * 10.0, 1.0));

    // 方块填充
    // float strength = step(0.2, mod(vUv.x * 10.0, 1.0));
    // strength *= step(0.2, mod(vUv.y * 10.0, 1.0));
     // gl_FragColor = vec4(vUv, 1.0, strength);

    // barX动画
    // float barX = step(0.4, mod((vUv.x + uTime * 0.1) * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
    // float barY = step(0.4, mod(vUv.y * 10.0, 1.0)) * step(0.8, mod(vUv.x * 10.0, 1.0));
    // float strength = barX + barY;
    // gl_FragColor = vec4(vUv, 1.0, strength);

    // T字型
    // float barX = step(0.4, mod(vUv.x * 10.0 - 0.2, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
    // float barY = step(0.4, mod(vUv.y * 10.0, 1.0)) * step(0.8, mod(vUv.x * 10.0, 1.0));
    // float strength = barX + barY;
    // gl_FragColor = vec4(vUv, 1.0, strength);

    // 利用绝对值，取消负数
    // float strength = abs(vUv.x - 0.5);

    // 取2个值的最小值
    // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

    // 取2个值的最大值
    // float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

    // 大于0.2就是1， 小于0.2就是0, 小正方形
    // float strength = 1.0 - step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

    // 利用取整实现条纹渐变
    // float strength = floor(vUv.x * 10.0) / 10.0;
    // float strength = floor(vUv.y * 10.0) / 10.0;

    // 向下取整实现渐变格子
    // float strength = floor(vUv.x * 10.0) / 10.0 * floor(vUv.y * 10.0) / 10.0;

    // 向上取整实现渐变格子
    // float strength = ceil(vUv.x * 10.0) / 10.0 * ceil(vUv.y * 10.0) / 10.0;

    // 随机
    // float strength = random(vUv);

    // 随机 + 格子
    // float strength = ceil(vUv.x * 10.0) / 10.0 * ceil(vUv.y * 10.0) / 10.0;
    // strength = random(vec2(strength, strength));

    // 依据length返回向量长度
    // float strength = length(vUv);

    // 根据distance计算2个向量的距离
    // float strength = 1.0 - distance(vUv, vec2(0.5, 0.5));

    // 根据相除，实现星星
    // float strength = 0.15 / distance(vUv, vec2(0.5, 0.5));

    // 实现小太阳
    // float strength = 0.15 / distance(vUv, vec2(0.5, 0.5)) - 1.0;

    // 十字交叉的星星
    // float strength =  0.15 / distance(vec2(vUv.x, (vUv.y - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 1.0;
    // strength += 0.15 / distance(vec2(vUv.y, (vUv.x - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 1.0;

    // 旋转十字交叉的星星
    // vec2 rotateUv = rotate(vUv, 3.1415926 * 0.25, vec2(0.5, 0.5));

    // 开始自动旋转
    // vec2 rotateUv = rotate(vUv, -uTime, vec2(0.5, 0.5));
    // float strength =  0.15 / distance(vec2(rotateUv.x, (rotateUv.y - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 1.0;
    // strength += 0.15 / distance(vec2(rotateUv.y, (rotateUv.x - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 1.0;

    
    // 画圆
    // float strength = 1.0 - step(0.3, distance(vUv, vec2(0.5, 0.5)));
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 画同心圆
    // float strength = step(0.5, distance(vUv, vec2(0.5, 0.5)) + 0.35);
    // strength *= (1.0 - step(0.5, distance(vUv, vec2(0.5, 0.5)) + 0.25));
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 模糊环
    // float strength = abs(distance(vUv, vec2(0.5, 0.5)) - 0.25);
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 打靶圆环
    // float strength = 1.0 - step(0.1, abs(distance(vUv, vec2(0.5, 0.5)) - 0.25));
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 圆环
    // float strength = step(0.1, abs(distance(vUv, vec2(0.5, 0.5)) - 0.25));
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 波浪环
    // vec2 waveUv = vec2(
    //     vUv.x,
    //     vUv.y + sin(vUv.x * 30.0) * 0.1
    // );
    // float strength =1.0 - step(0.01, abs(distance(waveUv, vec2(0.5, 0.5)) - 0.25));
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 波浪环X
    // vec2 waveUv = vec2(
    //     vUv.x + sin(vUv.y * 30.0) * 0.1,
    //     vUv.y + sin(vUv.x * 30.0) * 0.1
    // );
    // float strength =1.0 - step(0.01, abs(distance(waveUv, vec2(0.5, 0.5)) - 0.25));
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 
    // vec2 waveUv = vec2(
    //     vUv.x + sin(vUv.y * 100.0) * 0.1,
    //     vUv.y + sin(vUv.x * 100.0) * 0.1
    // );
    // float strength =1.0 - step(0.01, abs(distance(waveUv, vec2(0.5, 0.5)) - 0.25));
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 正切的角度显示颜色
    // float angle = atan(vUv.x, vUv.y);
    // float strength = angle;
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 41 根据角度实现螺旋渐变
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // float strength = (angle + 3.14) / 6.28;
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 实现雷达扫射
    // float alpha = 1.0 - step(0.5, distance(vUv, vec2(0.5, 0.5)));
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // float strength = (angle + 3.14) / 6.28;
    // gl_FragColor = vec4(strength, strength, strength, alpha);

    // 实现雷达扫射动态旋转
    // vec2 rotateUv = rotate(vUv, -uTime * 2.0, vec2(0.5, 0.5));
    // float alpha = 1.0 - step(0.5, distance(rotateUv, vec2(0.5, 0.5)));
    // float angle = atan(rotateUv.x - 0.5, rotateUv.y - 0.5);
    // float strength = (angle + 3.14) / 6.28;
    // gl_FragColor = vec4(strength, strength, strength, alpha);

    // 实现万花筒的效果
    // float angle = atan(vUv.x - 0.5, vUv.y -0.5) / PI;
    // float strength = mod(angle * 10.0, 1.0);
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 实现光芒四射
    // float angle = atan(vUv.x - 0.5, vUv.y -0.5) / PI;
    // float strength = sin(angle * 50.0);
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 使用噪声实现烟雾波纹的效果
    // float strength = noise(vUv * 10.0);
    // gl_FragColor = vec4(strength, strength, strength, 1);

    float strength = step(uScale, noise(vUv * 10.0));
    gl_FragColor = vec4(strength, strength, strength, 1);
}