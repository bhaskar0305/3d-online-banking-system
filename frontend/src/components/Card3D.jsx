import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';

// 1. Inner Mesh component that uses R3F hooks (must stay INSIDE <Canvas>)
function BankCardModel({ cardNumber, name, balance }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.15;
      meshRef.current.rotation.x = Math.cos(state.clock.getElapsedTime() * 0.8) * 0.08;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Main Card Body */}
      <RoundedBox args={[3.4, 2.1, 0.08]} radius={0.12} smoothness={4}>
        <meshStandardMaterial color="#00529B" roughness={0.2} metalness={0.8} />
      </RoundedBox>

      {/* Chip */}
      <mesh position={[-1.1, 0.3, 0.05]}>
        <planeGeometry args={[0.4, 0.3]} />
        <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Card Details */}
      <Text position={[0, -0.2, 0.05]} fontSize={0.18} color="#FFFFFF" anchorX="center">
        {cardNumber || "•••• •••• •••• 1234"}
      </Text>
      
      <Text position={[-1.3, -0.65, 0.05]} fontSize={0.11} color="#CBD5E1" anchorX="left">
        {name ? String(name).toUpperCase() : "ACCOUNT HOLDER"}
      </Text>

      <Text position={[1.3, -0.65, 0.05]} fontSize={0.12} color="#00A3E0" anchorX="right">
        ${balance ? Number(balance).toFixed(2) : "0.00"}
      </Text>
    </group>
  );
}

// 2. Light setup using primitives to prevent constructor issues
function Lighting() {
  return (
    <>
      <primitive object={new THREE.AmbientLight(0xffffff, 1.5)} />
      <primitive object={new THREE.DirectionalLight(0xffffff, 2)} position={[5, 5, 5]} />
      <primitive object={new THREE.PointLight(0xffffff, 0.5)} position={[-5, -5, -5]} />
    </>
  );
}

// 3. Main Exported Component
export default function Card3D({ cardNumber, name, balance }) {
  return (
    <div className="h-64 w-full cursor-pointer">
      <Canvas camera={{ position: [0, 0, 3.8], fov: 45 }}>
        <Lighting />
        <BankCardModel cardNumber={cardNumber} name={name} balance={balance} />
      </Canvas>
    </div>
  );
}