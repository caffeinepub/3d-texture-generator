import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { type TextureParameters } from '../hooks/useTextureParameters';
import { generateAlbedoMap, generateNormalMap, generateRoughnessMap, generateMetalnessMap } from '../utils/textureMapGenerator';

interface MaterialSphereProps {
  params: TextureParameters;
}

function MaterialSphere({ params }: MaterialSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  const textures = useMemo(() => {
    const genParams = {
      baseColor: params.baseColor,
      roughness: params.roughness,
      metalness: params.metalness,
      bumpIntensity: params.bumpIntensity,
      patternScale: params.patternScale,
      colorVariation: params.colorVariation,
      patternStyle: params.patternStyle,
      colorPalette: params.colorPalette,
      tilingScale: params.tilingScale,
      size: 256,
    };

    const albedoCanvas = generateAlbedoMap(genParams);
    const normalCanvas = generateNormalMap(genParams);
    const roughnessCanvas = generateRoughnessMap(genParams);
    const metalnessCanvas = generateMetalnessMap(genParams);

    const albedoTex = new THREE.CanvasTexture(albedoCanvas);
    const normalTex = new THREE.CanvasTexture(normalCanvas);
    const roughnessTex = new THREE.CanvasTexture(roughnessCanvas);
    const metalnessTex = new THREE.CanvasTexture(metalnessCanvas);

    albedoTex.wrapS = albedoTex.wrapT = THREE.RepeatWrapping;
    normalTex.wrapS = normalTex.wrapT = THREE.RepeatWrapping;
    roughnessTex.wrapS = roughnessTex.wrapT = THREE.RepeatWrapping;
    metalnessTex.wrapS = metalnessTex.wrapT = THREE.RepeatWrapping;

    return { albedoTex, normalTex, roughnessTex, metalnessTex };
  }, [
    params.baseColor,
    params.roughness,
    params.metalness,
    params.bumpIntensity,
    params.patternScale,
    params.colorVariation,
    params.patternStyle,
    params.colorPalette,
    params.tilingScale,
  ]);

  useEffect(() => {
    return () => {
      textures.albedoTex.dispose();
      textures.normalTex.dispose();
      textures.roughnessTex.dispose();
      textures.metalnessTex.dispose();
    };
  }, [textures]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.4, 64, 64]} />
      <meshStandardMaterial
        ref={materialRef}
        map={textures.albedoTex}
        normalMap={textures.normalTex}
        roughnessMap={textures.roughnessTex}
        metalnessMap={textures.metalnessTex}
        roughness={params.roughness}
        metalness={params.metalness}
        normalScale={new THREE.Vector2(params.bumpIntensity, params.bumpIntensity)}
      />
    </mesh>
  );
}

interface TexturePreview3DProps {
  params: TextureParameters;
}

export default function TexturePreview3D({ params }: TexturePreview3DProps) {
  return (
    <div className="w-full h-full" style={{ background: '#0a0a0f' }}>
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#fff8e8" />
        <directionalLight position={[-3, -2, -3]} intensity={0.4} color="#c8d8ff" />
        <pointLight position={[0, 3, 2]} intensity={0.8} color="#ffcc66" />
        <Environment preset="studio" />
        <MaterialSphere params={params} />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={2}
          maxDistance={6}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
