import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import { DirectionalLight } from 'three';

function BankCardModel({ cardNumber, name, balance }) {
    const meshRef = useRef();

    useFrame((state) => {
        meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.15;
        meshRef.current.rotation.x = Math.cos(state.clock.getElapsedTime() * 0.8) * 0.08;
    });

    return (
        <group ref={meshRef}>
            {/* Main card Mesh */}
            <RoundedBox args={[3.4, 2.1, 0.08]} radius={0.12} smoothness={4}>
                <meshStandardMaterial color="#00529B" roughness={0.2} metalness={0.8} />
            </RoundedBox>

            {/* Metallic Chip */}
            <mesh position={[-1.1, 0.3, 0.05]}>
                <planeGeometry args={[0.4, 0.3]} />
                <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
            </mesh>

            {/* Card Details Text */}
            <Text position={[0, -0.2, 0.05]} fontSize={0.18} color="#FFFFFF" anchorX="center">
                {cardNumber || "•••• •••• •••• 1234"}
            </Text>

            <Text position={[-1.3, -0.65, 0.05]} fontSize={0.11} color="#CBD5E1" anchorX="left">
                {name ? name.toUpperCase() : "ACCOUNT HOLDER"}
            </Text>

            <Text position={[1.3, -0.65, 0.05]} fontSize={0.12} color="#00A3E0" anchorX="right">
                ${balance ? balance.toFixed(2) : "0.00"}
            </Text>
        </group>
    );
}

export default function Card3D({ cardNumber, name, balance}){
    return(
        <div className='h-64 w-full cursor-pointer'>
            <canvas camera={{position: [0,0,3.8], fov: 45}}>
                <ambientLight intensity={1.5}/>
                <DirectionalLight position={[5,5,5]} intensity={2}/>
                <pointLight position={[-5, -5, -5]} intensity={0.5}/>
                <BankCardModel cardNumber={cardNumber} name={name} balance={balance}/>
            </canvas>
        </div>
    );
}