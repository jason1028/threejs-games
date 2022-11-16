/**********
 * 目标： 设置银河系
 * 主要内容：
 *      
***********/

import * as THREE from 'three';
// 导入动画库
import gsap from 'gsap';
// 导入ui界面控制库
import * as dat from 'dat.gui';

// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// 创建一个场景(场景就是要创建一个环境)
const scene = new THREE.Scene();

// 创建一个相机(相机，相当于一个的眼睛)
const camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 0.1, 1000);

// 设置相机位置x，y，z  (vector3 三维向量)
camera.position.set(0, 0, 40);
// 将相机添加至场景
scene.add(camera);

const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshBasicMaterial({
    // 设置边框
    wireframe: true
});
const redMaterial = new THREE.MeshBasicMaterial({
    color: '#ff0000'
});

// 创建1000立方体
let cubeArr = [];
let cubeGroup = new THREE.Group();
for(let i = 0; i < 5; i++) {
    for(let j = 0; j < 5; j++) {
        for(let z = 0; z < 5; z++) {
            const cube = new THREE.Mesh(cubeGeometry, material);
            cube.position.set(i * 2 - 5, j * 2 - 5, z * 2 - 5);
            cubeGroup.add(cube);
            cubeArr.push(cube);
        }
    }
}

scene.add(cubeGroup);

var sjxMesh;
const sjxGroup = new THREE.Group();
// 创建酷炫三角形
for (let i = 0; i < 30; i++) {
    // 每一个三角形由3个顶点，每个顶点需要3个值作为坐标
    const geometry = new THREE.BufferGeometry();
    const positionArray = new Float32Array(9);
    for(var j = 0; j < 9; j++) {
        positionArray[j] = Math.random() * 10 - 5;
        if(j%3 === 1) {
            positionArray[j] = Math.random() * 10 - 5;
        } else {
            positionArray[j] = Math.random() * 10 - 5;
        }
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
    let color = new THREE.Color(Math.random(), Math.random(), Math.random());
    // - 设置材质(基础网格材质) 比如物体的颜色等等
    const material = new THREE.MeshBasicMaterial({ 
        color, 
        transparent: true, 
        opacity: 0.5,
        side: THREE.DoubleSide
    });
    // 生成物体
    sjxMesh = new THREE.Mesh(geometry, material);
    sjxGroup.add(sjxMesh);
}
sjxGroup.position.set(0, -30, 0);
scene.add(sjxGroup);


/**
 * 弹跳小球
*/

const sphereGroup = new THREE.Group();

// 设置材质
const sphereMaterial = new THREE.MeshStandardMaterial({// side: DoubleSide // emissive: 0xff6600
    metalness: 0.3
});


// 创建一个球体几何模型（1，20，20）
const sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20);
// 生成mesh物体
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
// 球体设置阴影
sphereMesh.castShadow = true;
// 添加mesh
sphereGroup.add(sphereMesh);

// 添加一个平面
const planeGeometry = new THREE.PlaneBufferGeometry(30, 30);
const plane = new THREE.Mesh(planeGeometry, sphereMaterial);
plane.position.set(0, -1, 0);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true; // 接收光源
sphereGroup.add(plane);

// 创建一个发光的小球
const smallBall = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 20, 20),
    new THREE.MeshBasicMaterial({ color: 0x00ffff }) // 蓝色
)
smallBall.position.set(2, 2, 2);

// 添加光源(环境光)
const light = new THREE.AmbientLight(0xffffff, 1);
sphereGroup.add(light);

// 添加光源（点光源）
const pointLight = new THREE.PointLight(0x00ffff, 2);
// 设置光源位置
pointLight.position.set(2, 2, 2);
// 开始渲染阴影
pointLight.castShadow = true;
// 设置阴影贴图当中的20px模糊度
pointLight.shadow.radius = 20;
// 设置底部阴影贴图的分辨率(默认512， 512，看起来比较模糊)
pointLight.shadow.mapSize.set(512, 512);
// 设置距离
pointLight.distance = 0;
// 灯光从边缘衰减效果
pointLight.penumbra = 0;
// 灯光亮度衰减
pointLight.decay = 0;

// 将点光源添加至小球中
smallBall.add(pointLight);
// 将小球添加到场景中
sphereGroup.add(smallBall);

sphereGroup.position.set(0, -60, 0);
scene.add(sphereGroup);

let arrGroup = [cubeGroup, sjxGroup, sphereGroup];

// 创建投射光线对象
const rayCaster = new THREE.Raycaster();

// 鼠标的位置对象
const mouse = new THREE.Vector2();

const cemClock = new THREE.Clock();

// 监听鼠标的位置
window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
    // 设置投射
    rayCaster.setFromCamera(mouse, camera);
    // 得到鼠标的有效物体结果集
    const result = rayCaster.intersectObjects(cubeArr);
    // 拿到距离摄像机最近的物体，将其设置为redMeterail材质
    result[0].object.material = redMaterial;
});

// 摇晃相机
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) - 0.5; // 将坐标控制在-0.5 到 0.5这个范围
    mouse.y = -((event.clientY / window.innerHeight) - 0.5);
    camera.position.x = mouse.x;
});

// 设置当前页
let currentPage = 0;
// 监听滚动事件
window.addEventListener('scroll', (event) => {
    // 控制当前滚动的页数
    const newPage = Math.round(window.scrollY / window.innerHeight);
    if(newPage !== currentPage) {
        currentPage = newPage;
        gsap.to(arrGroup[currentPage].rotation, {
            z: "+=" + Math.PI * 2,
            x: "+=" + Math.PI * 2,
            duration: 2,
            onComplete: () => {
                console.log("旋转完成");
            }
        });

        // gsap.to(`.page${currentPage} h1`, {
        //     rotate: "+=" + 360,
        //     duration: 1
        // });

        gsap.fromTo(`.page${currentPage} h1`, { x: -300 }, { x: 0, rotate: 360, duration: 1 });
    }
});


// 初始化渲染器, 渲染器透明
const renderer = new THREE.WebGL1Renderer({ alpha: true });
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 开启场景中的阴影贴图
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true;


// 将webgl渲染的canvas内容添加到body上
document.body.appendChild(renderer.domElement);

// 创建轨道控制器，控制器控制camera(相机)，指定渲染器里面的domElement元素
// const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器的阻尼（惯性，看起来更加有真实的效果）, 必须在我们动画循环里面调用.update()
// controls.enableDamping = true;

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);


window.addEventListener('dblclick', () => {
    const fullScreenElement = document.fullscreenElement;
    // 判断是否有全屏元素
    if(!fullScreenElement) {
        // 屏幕双击时全屏 (canvas全屏)
        renderer.domElement.requestFullscreen();
    }else {
        // 退出全屏
        document.exitFullscreen();
    }
});

const clock = new THREE.Clock();

// 方形动画
gsap.to(cubeGroup.rotation, {
    x: "+=" + Math.PI,
    y: "+=" + Math.PI,
    duration: 5,
    ease: "power2.inOut",
    repeat: -1
});

// 三角形动画
gsap.to(sjxGroup.rotation, {
    x: "+=" + Math.PI,
    z: "+=" + Math.PI,
    duration: 6,
    ease: "power2.inOut",
    repeat: -1
});

// 小球运动
gsap.to(smallBall.position, {
    x: -3,
    duration: 4,
    ease: "power2.inOut",
    repeat: -1,
    yoyo: true
});

gsap.to(smallBall.position, {
    y: 0,
    duration: 1,
    ease: "power2.inOut",
    repeat: -1,
    yoyo: true
});


// 渲染函数
function render() {
    // 如果前面设置了阻尼(惯性)效果，每次渲染就必须要调用.update()
    // controls.update();
    // let time = clock.getElapsedTime();
    let deltaTime = clock.getDelta();
    // cubeGroup.rotation.x = time * 0.2;
    // cubeGroup.rotation.y = time * 0.2;

    // // 三角形动画
    // sjxGroup.rotation.z = time * 0.3;

    // // 弹跳小球
    // smallBall.position.x = Math.sin(time) * 3;
    // smallBall.position.y = 2 + Math.sin(time * 10) / 2;
    // smallBall.position.z = Math.cos(time) * 3;

    // sphereGroup.rotation.x = Math.sin(time) * 0.05;
    // sphereGroup.rotation.z = Math.sin(time) * 0.05;

    // 根据滚动的scrollY，去设置相机移动的位置
    camera.position.y = -(window.scrollY/window.innerHeight) * 30;

    // camera.position.x = (mouse.x * 10 - camera.position.x) * deltaTime;

    // 使用渲染器，通过相机将场景渲染进来
    renderer.render(scene, camera);
    // 下一帧执行渲染
    requestAnimationFrame(render);
}

// 开始渲染
render();

// 监听浏览器窗口变化，更新渲染画面
window.addEventListener('resize', () => {
    // console.log('画面变化了...');
    // 更新摄像头宽高比
    camera.aspect = window.innerWidth / window.innerHeight;
    // 更新摄像机的投影矩阵
    camera.updateProjectionMatrix();
    // 更新渲染器高宽
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 设置渲染器的像素比(其实就是分辨率)
    renderer.setPixelRatio(window.devicePixelRatio);
});