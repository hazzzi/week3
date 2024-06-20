import { Environment, useGLTF } from '@react-three/drei';
import { Canvas, PrimitiveProps, useFrame } from '@react-three/fiber';
import { useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import './App.css';

function Model({
  progress,
}: Omit<PrimitiveProps, 'object'> & {
  progress: ReturnType<typeof useSpring>;
}) {
  const ref = useRef<PrimitiveProps>();
  const { scene } = useGLTF('./model.gltf');

  useFrame(() => {
    const [x, y, z, scale, rotationX, rotationY, rotationZ] = progress.get();
    if (ref.current) {
      ref.current.position.set(x, y, z);
      ref.current.scale.set(scale, scale, scale);
      ref.current.rotation.set(rotationX, rotationY, rotationZ);
    }
  });

  return (
    <primitive ref={ref} object={scene} position={[-20, 15, 0]} scale={1} />
  );
}

function App() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });
  const progress = useTransform(
    scrollYProgress,
    [0, 1],
    [
      [-20, 15, 0, 0.5, 0, 0, 0],
      [20, -15, 0, 1.5, 0, Math.PI / 2, 0], // 스크롤 중간 위치
    ]
  );
  const progressSpring = useSpring(progress, { damping: 40 });

  return (
    <main ref={container}>
      <header>
        <h1>Tree</h1>
      </header>
      <div id="canvas-container">
        <Canvas camera={{ position: [-10, 10, 70], fov: 50 }}>
          <Environment preset="apartment" />
          <directionalLight intensity={2} position={[0, 2, 3]} />
          <ambientLight />
          <Model progress={progressSpring} />
          <axesHelper args={[8]} />
        </Canvas>
      </div>
    </main>
  );
}

export default App;
