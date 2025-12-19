"use client";

import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface House3DProps {
  scrollProgress: number;
}

function House({ scrollProgress }: House3DProps) {
  const houseRef = useRef<THREE.Group>(null);

  // Анимация появления элементов в зависимости от скролла
  const foundationProgress = Math.min(scrollProgress * 2, 1); // 0-0.5
  const wallsProgress = Math.min((scrollProgress - 0.25) * 2, 1); // 0.25-0.75
  const roofProgress = Math.min((scrollProgress - 0.5) * 2, 1); // 0.5-1
  const detailsProgress = Math.min((scrollProgress - 0.7) * 1.5, 1); // 0.7-1

  return (
    <group ref={houseRef} position={[0, -1, 0]} scale={[1, 1, 1]}>
      {/* Фундамент */}
      <mesh
        position={[0, foundationProgress * 0.1 - 0.1, 0]}
        scale={[1, foundationProgress, 1]}
      >
        <boxGeometry args={[2, 0.2, 2]} />
        <meshStandardMaterial
          color="#722F37"
          opacity={foundationProgress}
          transparent
        />
      </mesh>

      {/* Стены - передняя и задняя */}
      <group scale={[1, wallsProgress, 1]}>
        <mesh position={[0, 0.5, 1]} visible={wallsProgress > 0.1}>
          <boxGeometry args={[2, 1, 0.1]} />
          <meshStandardMaterial
            color="#737373"
            opacity={wallsProgress}
            transparent
          />
        </mesh>
        <mesh position={[0, 0.5, -1]} visible={wallsProgress > 0.1}>
          <boxGeometry args={[2, 1, 0.1]} />
          <meshStandardMaterial
            color="#737373"
            opacity={wallsProgress}
            transparent
          />
        </mesh>

        {/* Стены - левая и правая */}
        <mesh position={[-1, 0.5, 0]} visible={wallsProgress > 0.1}>
          <boxGeometry args={[0.1, 1, 2]} />
          <meshStandardMaterial
            color="#737373"
            opacity={wallsProgress}
            transparent
          />
        </mesh>
        <mesh position={[1, 0.5, 0]} visible={wallsProgress > 0.1}>
          <boxGeometry args={[0.1, 1, 2]} />
          <meshStandardMaterial
            color="#737373"
            opacity={wallsProgress}
            transparent
          />
        </mesh>
      </group>

      {/* Крыша - правильная двускатная (через правильные координаты) */}
      <group visible={roofProgress > 0.1} scale={[1, roofProgress, 1]}>
        {/* Крыша как одна геометрия - без position, координаты уже правильные */}
        <mesh>
          <bufferGeometry>
            {/* Вершины для двускатной крыши */}
            <bufferAttribute
              attach="attributes-position"
              count={5}
              array={new Float32Array([
                // Конёк (верхняя точка) - на высоте 1.5 над стенами
                0, 1.5, 0,
                // Нижние углы крыши - на уровне верха стен (Y=1.0)
                -1.1, 1.0, 1.1,   // Левый передний
                1.1, 1.0, 1.1,    // Правый передний
                -1.1, 1.0, -1.1,  // Левый задний
                1.1, 1.0, -1.1,   // Правый задний
              ])}
              itemSize={3}
            />
            {/* Индексы для треугольников */}
            <bufferAttribute
              attach="index"
              count={12}
              array={new Uint16Array([
                // Левый скат (вдоль оси Z)
                0, 3, 1,  // Конёк - левый зад - левый перед
                // Правый скат (вдоль оси Z)
                0, 2, 4,  // Конёк - правый перед - правый зад
                // Фронтон передний (треугольник)
                0, 1, 2,  // Конёк - левый перед - правый перед
                // Фронтон задний (треугольник)
                0, 4, 3,  // Конёк - правый зад - левый зад
              ])}
              itemSize={1}
            />
          </bufferGeometry>
          <meshStandardMaterial
            color="#722F37"
            opacity={roofProgress}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Окна - левое */}
      <mesh
        position={[-0.6, 0.5, 1.06]}
        visible={detailsProgress > 0.1}
        scale={[detailsProgress, detailsProgress, 1]}
      >
        <boxGeometry args={[0.4, 0.4, 0.05]} />
        <meshStandardMaterial
          color="#87CEEB"
          opacity={detailsProgress}
          transparent
        />
      </mesh>

      {/* Окна - правое */}
      <mesh
        position={[0.6, 0.5, 1.06]}
        visible={detailsProgress > 0.1}
        scale={[detailsProgress, detailsProgress, 1]}
      >
        <boxGeometry args={[0.4, 0.4, 0.05]} />
        <meshStandardMaterial
          color="#87CEEB"
          opacity={detailsProgress}
          transparent
        />
      </mesh>

      {/* Дверь */}
      <mesh
        position={[0, 0.3, 1.06]}
        visible={detailsProgress > 0.3}
        scale={[detailsProgress, detailsProgress, 1]}
      >
        <boxGeometry args={[0.5, 0.7, 0.05]} />
        <meshStandardMaterial
          color="#722F37"
          opacity={detailsProgress}
          transparent
        />
      </mesh>

      {/* Труба */}
      <mesh
        position={[0.8, 1.4, 0.5]}
        visible={detailsProgress > 0.5}
        scale={[1, detailsProgress, 1]}
      >
        <boxGeometry args={[0.2, 0.3, 0.2]} />
        <meshStandardMaterial
          color="#525252"
          opacity={detailsProgress}
          transparent
        />
      </mesh>

      {/* Дым */}
      {detailsProgress > 0.6 && (
        <mesh
          position={[0.8, 1.7 + (detailsProgress - 0.6) * 0.5, 0.5]}
          scale={[(detailsProgress - 0.6) * 2, (detailsProgress - 0.6) * 2, 1]}
        >
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial
            color="#737373"
            opacity={(detailsProgress - 0.6) * 0.5}
            transparent
          />
        </mesh>
      )}
    </group>
  );
}

function Scene({ scrollProgress }: House3DProps) {
  return (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true, alpha: true }}
    >
      <PerspectiveCamera makeDefault position={[0, 1, 5]} fov={50} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2.2}
      />
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <directionalLight position={[-5, 3, -5]} intensity={0.8} />
      <pointLight position={[0, 2, 0]} intensity={0.6} />
      <House scrollProgress={scrollProgress} />
    </Canvas>
  );
}

export default function House3D({ scrollProgress }: House3DProps) {
  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center">
      <div className="w-full h-full">
        <Scene scrollProgress={scrollProgress} />
      </div>
    </div>
  );
}

