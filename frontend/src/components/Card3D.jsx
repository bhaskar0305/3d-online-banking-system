import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { Lock, Eye, EyeOff } from 'lucide-react';

function BlackGoldCardMesh({ cardNumber, name, balance, isUnlocked }) {
  const meshRef = useRef();

  useFrame((state) => {
    // Gentle floating motion when idle
    meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.2) * 0.05;
  });

  return (
    <group ref={meshRef}>
      {/* Front & Back Main Card Base */}
      <RoundedBox args={[3.4, 2.1, 0.08]} radius={0.12} smoothness={4}>
        <meshStandardMaterial color="#0A0F1D" roughness={0.3} metalness={0.9} />
      </RoundedBox>

      {/* Gold Trim Border Accent */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.44, 2.14, 0.06]} />
        <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.1} />
      </mesh>

      {/* FRONT SIDE CONTENT */}
      <group position={[0, 0, 0.05]}>
        {/* Metallic Gold Chip */}
        <mesh position={[-1.1, 0.35, 0]}>
          <planeGeometry args={[0.42, 0.32]} />
          <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
        </mesh>

        {/* Bank Logo */}
        <Text position={[1.1, 0.5, 0]} fontSize={0.14} color="#D4AF37" anchorX="right font-bold">
          APEX BLACK
        </Text>

        {/* Masked / Unmasked Card Number */}
        <Text position={[0, -0.15, 0]} fontSize={0.17} color="#FFFFFF" anchorX="center">
          {isUnlocked
            ? cardNumber || "4532 •••• •••• 8892"
            : "•••• •••• •••• " + (cardNumber ? cardNumber.slice(-4) : "8892")}
        </Text>

        {/* Account Holder Name */}
        <Text position={[-1.3, -0.65, 0]} fontSize={0.11} color="#94A3B8" anchorX="left">
          {name ? String(name).toUpperCase() : "VALUED MEMBER"}
        </Text>

        {/* Card Balance */}
        <Text position={[1.3, -0.65, 0]} fontSize={0.12} color="#D4AF37" anchorX="right">
          ${balance ? Number(balance).toFixed(2) : "0.00"}
        </Text>
      </group>

      {/* BACK SIDE CONTENT */}
      <group position={[0, 0, -0.05]} rotation={[0, Math.PI, 0]}>
        {/* Magnetic Black Strip */}
        <mesh position={[0, 0.45, 0]}>
          <planeGeometry args={[3.38, 0.4]} />
          <meshStandardMaterial color="#000000" roughness={0.9} />
        </mesh>

        {/* Signature Box & CVV */}
        <mesh position={[-0.2, -0.1, 0]}>
          <planeGeometry args={[2.0, 0.3]} />
          <meshStandardMaterial color="#E2E8F0" />
        </mesh>

        <Text position={[0.9, -0.1, 0.01]} fontSize={0.12} color="#000000">
          CVV: {isUnlocked ? "892" : "•••"}
        </Text>
      </group>
    </group>
  );
}

function Lighting() {
  return (
    <>
      <primitive object={new THREE.AmbientLight(0xffffff, 1.2)} />
      <primitive object={new THREE.DirectionalLight(0xffd700, 2.5)} position={[5, 5, 5]} />
      <primitive object={new THREE.PointLight(0xffffff, 1)} position={[-5, -5, -5]} />
    </>
  );
}

export default function Card3D({ cardNumber, name, balance }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passError, setPassError] = useState('');

  const handleUnlock = (e) => {
    e.preventDefault();
    if (passcode === '1234' || passcode.length >= 4) { // Simulation password check
      setIsUnlocked(true);
      setShowPasswordModal(false);
      setPasscode('');
      setPassError('');
    } else {
      setPassError('Incorrect Security PIN. (Try 1234)');
    }
  };

  return (
    <div className="relative w-full">
      {/* 3D Canvas Rendering Area */}
      <div className="h-64 w-full cursor-grab active:cursor-grabbing">
        <Canvas camera={{ position: [0, 0, 3.8], fov: 45 }}>
          <Lighting />
          <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 3} />
          <BlackGoldCardMesh cardNumber={cardNumber} name={name} balance={balance} isUnlocked={isUnlocked} />
        </Canvas>
      </div>

      {/* Card Detail Unlock Toggle */}
      <div className="flex justify-center mt-2">
        <button
          onClick={() => {
            if (isUnlocked) setIsUnlocked(false);
            else setShowPasswordModal(true);
          }}
          className="flex items-center gap-2 text-xs bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 px-4 py-1.5 rounded-full transition"
        >
          {isUnlocked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {isUnlocked ? 'Hide Sensitive Details' : 'Authenticate to Unmask CVV/Card No'}
        </button>
      </div>

      {/* Password Prompt Modal */}
      {showPasswordModal && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md rounded-2xl flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-xs text-center space-y-3">
            <Lock className="w-8 h-8 text-amber-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">Enter Card Passcode</h4>
            <p className="text-xs text-slate-400">Enter your 4-digit PIN to unmask sensitive numbers</p>
            
            {passError && <p className="text-[11px] text-rose-400">{passError}</p>}

            <form onSubmit={handleUnlock} className="space-y-2">
              <input
                type="password"
                maxLength={4}
                autoFocus
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••"
                className="w-full text-center bg-slate-900 border border-slate-700 rounded-xl py-2 text-white text-lg tracking-widest focus:outline-none focus:border-amber-400"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2 text-xs bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs bg-amber-400 text-slate-950 font-bold rounded-xl"
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}