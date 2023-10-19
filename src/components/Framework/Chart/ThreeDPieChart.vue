<template>
  <canvas ref="canvas"></canvas>
</template>

<script lang="ts" setup>
  import { onMounted, ref, toRefs, nextTick, watch, defineProps } from 'vue';
  import * as THREE from 'three';

  const props = defineProps({
    data: { type: Array },
  });

  const canvas = ref<HTMLCanvasElement | null>(null);
  const canvasData = ref([]);
  // 存储角度信息
  const angles = ref<{ start: number; end: number }[]>([]);

  let scene: THREE.Scene;
  let camera: THREE.Camera;
  let renderer: THREE.WebGLRenderer;

  // 初始化three.js场景等
  const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, 1, 1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: canvas.value });

    // 创建一个平行光源
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 0, 1);
    scene.add(light);
  };

  // 计算饼图参数
  const calcData = () => {
    // ....计算中心角、开口角等
    let total = 0;
    canvasData.value.forEach((d) => {
      if (Reflect.has(d, 'value')) {
        total += d.value as number;
      }
    });
    let lastEnd = 0;
    angles.value = canvasData.value.map((d, i) => {
      // 第一个扇形的起始角度是0
      let start = i === 0 ? 0 : lastEnd;
      let end = start + (d.value / total) * Math.PI * 2;
      d.startAngle = start;
      d.endAngle = lastEnd = end;
      return { start, end };
    });
  };

  // 创建饼图mesh
  const createPie = () => {
    camera.position.z = 30;
    canvasData.value.forEach((d) => {
      // 创建Geometry和Material
      const geometry = new THREE.RingGeometry(5, 10, 32);
      const material = new THREE.MeshBasicMaterial({
        color: d.color
      });
      const mesh = new THREE.Mesh(geometry, material);
      // 设置旋转角度
      mesh.rotation.x = Math.PI / 2;
      mesh.rotation.y = d.startAngle;

      geometry.startAngle = d.startAngle;
      geometry.endAngle = d.endAngle;

      // 创建Mesh并添加到场景
      scene.add(mesh);

      // 点光源
      const pointLight = new THREE.PointLight(0xffffff, 1);
      pointLight.position.set(10, 10, 10);
      scene.add(pointLight);

      // 环境光
      const ambientLight = new THREE.AmbientLight(0x404040);
      scene.add(ambientLight);

      renderer.setClearColor('#fff'); // 设置背景色
      renderer.shadowMap.enabled = true; // 开启阴影
    });
  };

  // 渲染循环
  const render = () => {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };

  onMounted(() => {
    canvasData.value = props.data as [];
    nextTick(() => {
      setTimeout(() => {
        init();
        calcData();
        createPie();
        render();
      }, 3000);
    });
  });
</script>
