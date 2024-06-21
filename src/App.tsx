import { Environment, useGLTF } from '@react-three/drei';
import { Canvas, PrimitiveProps, useFrame } from '@react-three/fiber';
import { useScroll, useSpring, useTransform } from 'framer-motion';
import { useControls } from 'leva';
import { useRef } from 'react';
import './App.css';

function Model({
  x,
  y,
  z,
  scale,
  rotationX,
  rotationY,
  rotationZ,
}: Omit<PrimitiveProps, 'object'>) {
  const ref = useRef<PrimitiveProps>();
  const { scene } = useGLTF('./model.gltf');

  useFrame(() => {
    const xValue = x.get();
    const yValue = y.get();
    const zValue = z.get();

    const scaleValue = scale.get();
    const rotationXValue = rotationX.get();
    const rotationYValue = rotationY.get();
    const rotationZValue = rotationZ.get();

    if (ref.current) {
      ref.current.position.set(xValue, yValue, zValue);
      ref.current.scale.set(scaleValue, scaleValue, scaleValue);
      ref.current.rotation.set(rotationXValue, rotationYValue, rotationZValue);
    }
  });

  return (
    <primitive ref={ref} object={scene} position={[-20, 15, 0]} scale={1} />
  );
}

function App() {
  const container = useRef(null);
  const { scene } = useGLTF('./model.gltf');

  const {
    scale: scaleControl,
    rotationX: rotationXControl,
    rotationY: rotationYControl,
    rotationZ: rotationZControl,
    ...position
  } = useControls({
    x: { value: -20, min: -100, max: 100 },
    y: { value: 15, min: -100, max: 100 },
    z: { value: 0, min: -100, max: 100 },
    scale: { value: 1, min: 0, max: 2 },
    rotationX: { value: 0, min: -Math.PI, max: Math.PI },
    rotationY: { value: 0, min: -Math.PI, max: Math.PI },
    rotationZ: { value: 0, min: -Math.PI, max: Math.PI },
  });
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  const x = useTransform(scrollYProgress, [0, 0.5, 1], [-20, 20, -16]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [15, -15, -31]);
  const z = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0, 4]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1.5, 1.8]);
  const rotationX = useTransform(scrollYProgress, [0, 1], [0, -0.5]);
  const rotationY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0, Math.PI / 2, 2]
  );
  const rotationZ = useTransform(scrollYProgress, [0, 1], [0, -0.5]);

  const xSpring = useSpring(x, { damping: 40 });
  const ySpring = useSpring(y, { damping: 40 });
  const zSpring = useSpring(z, { damping: 30 });
  const scaleSpring = useSpring(scale, { damping: 40 });
  const rotationXSpring = useSpring(rotationX, { damping: 40 });
  const rotationYSpring = useSpring(rotationY, { damping: 40 });
  const rotationZSpring = useSpring(rotationZ, { damping: 40 });

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
          {/* <primitive
            object={scene}
            position={[position.x, position.y, position.z]}
            scale={scaleControl}
            rotation={[rotationXControl, rotationYControl, rotationZControl]}
          /> */}
          {/* <Model
            x={x}
            y={y}
            z={z}
            scale={scale}
            rotationX={rotationX}
            rotationY={rotationY}
            rotationZ={rotationZ}
          /> */}
          <Model
            x={xSpring}
            y={ySpring}
            z={zSpring}
            scale={scaleSpring}
            rotationX={rotationXSpring}
            rotationY={rotationYSpring}
            rotationZ={rotationZSpring}
          />
          <axesHelper args={[8]} />
        </Canvas>
      </div>
    </main>
  );
}

export default App;
