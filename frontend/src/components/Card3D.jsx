import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { Lock, Eye, EyeOff } from 'lucide-react';

function BlackGoldCardMesh({ cardNumber, name, balance, expiryDate, cvv, isUnlocked, isSample }) {
  const meshRef = useRef();

  useFrame((state) => {
    meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.2) * 0.05;
  });

  // Format 10-digit account into card number layout
  const formattedCardNo = isSample
    ? "4532 •••• •••• 8892"
    : (cardNumber ? `4000 ${cardNumber.slice(0, 4)} ${cardNumber.slice(4)}` : "1000 0000 0000");

  return (
    <group ref={meshRef}>
      {/* Front & Back Base */}
      <RoundedBox args={[3.4, 2.1, 0.08]} radius={0.12} smoothness={4}>
        <meshStandardMaterial color="#0A0F1D" roughness={0.3} metalness={0.9} />
      </RoundedBox>

      {/* Gold Trim */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.44, 2.14, 0.06]} />
        <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.1} />
      </mesh>

      {/* FRONT SIDE */}
      <group position={[0, 0, 0.05]}>
        <mesh position={[-1.1, 0.35, 0]}>
          <planeGeometry args={[0.42, 0.32]} />
          <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
        </mesh>

        <Text position={[1.1, 0.5, 0]} fontSize={0.14} color="#D4AF37" anchorX="right font-bold">
          APEX BLACK
        </Text>

        {/* Card Number Unmasking */}
        <Text position={[0, -0.15, 0]} fontSize={0.16} color="#FFFFFF" anchorX="center">
          {isUnlocked || isSample ? formattedCardNo : `•••• •••• •••• ${cardNumber ? cardNumber.slice(-4) : "0000"}`}
        </Text>

        <Text position={[-1.3, -0.65, 0]} fontSize={0.11} color="#94A3B8" anchorX="left">
          {name ? String(name).toUpperCase() : "SAMPLE CARDHOLDER"}
        </Text>

        <Text position={[0.2, -0.65, 0]} fontSize={0.10} color="#D4AF37" anchorX="center">
          EXP: {expiryDate || "08/29"}
        </Text>

        <Text position={[1.3, -0.65, 0]} fontSize={0.12} color="#D4AF37" anchorX="right">
          ${balance !== undefined ? Number(balance).toFixed(2) : "50,000.00"}
        </Text>
      </group>

      {/* BACK SIDE */}
      <group position={[0, 0, -0.05]} rotation={[0, Math.PI, 0]}>
        <mesh position={[0, 0.45, 0]}>
          <planeGeometry args={[3.38, 0.4]} />
          <meshStandardMaterial color="#000000" roughness={0.9} />
        </mesh>

        <mesh position={[-0.2, -0.1, 0]}>
          <planeGeometry args={[2.0, 0.3]} />
          <meshStandardMaterial color="#E2E8F0" />
        </mesh>

        <Text position={[0.9, -0.1, 0.01]} fontSize={0.12} color="#000000">
          CVV: {isUnlocked ? (cvv || "892") : "•••"}
        </Text>
      </group>
    </group>
  );
}

export default function Card3D({ cardNumber, name, balance, expiryDate, cvv, userPin, isSample = false }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passError, setPassError] = useState('');

  const handleUnlock = (e) => {
    e.preventDefault();
    const correctPin = userPin || "1234";
    if (passcode === correctPin) {
      setIsUnlocked(true);
      setShowModal(false);
      setPasscode('');
      setPassError('');
    } else {
      setPassError(`Incorrect PIN. (Entered PIN must match your card security PIN)`);
    }
  };

  return (
    <div className="relative w-full">
      <div className="h-64 w-full cursor-grab active:cursor-grabbing">
        <Canvas camera={{ position: [0, 0, 3.8], fov: 45 }}>
          <primitive object={new THREE.AmbientLight(0xffffff, 1.2)} />
          <primitive object={new THREE.DirectionalLight(0xffd700, 2.5)} position={[5, 5, 5]} />
          <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 3} />
          <BlackGoldCardMesh
            cardNumber={cardNumber}
            name={name}
            balance={balance}
            expiryDate={expiryDate}
            cvv={cvv}
            isUnlocked={isUnlocked}
            isSample={isSample}
          />
        </Canvas>
      </div>

      {!isSample && (
        <div className="flex justify-center mt-2">
          <button
            onClick={() => {
              if (isUnlocked) setIsUnlocked(false);
              else setShowModal(true);
            }}
            className="flex items-center gap-2 text-xs bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 px-4 py-1.5 rounded-full transition"
          >
            {isUnlocked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {isUnlocked ? 'Hide Card Details' : 'Authenticate PIN to Unmask Full Card Info'}
          </button>
        </div>
      )}

      {showModal && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md rounded-2xl flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-xs text-center space-y-3">
            <Lock className="w-8 h-8 text-amber-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">Security PIN Verification</h4>
            <p className="text-xs text-slate-400">Enter your 4-digit Card PIN to unmask number & CVV</p>

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
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 text-xs bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 text-xs bg-amber-400 text-slate-950 font-bold rounded-xl">
                  Verify PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}