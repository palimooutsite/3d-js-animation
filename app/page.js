"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Home() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0b0f1f, 6, 18);

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0.5, 7);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const ambientLight = new THREE.AmbientLight(0x9db3ff, 0.6);
    const pointLight = new THREE.PointLight(0x7ef9ff, 1.2, 20);
    pointLight.position.set(4, 2, 6);
    scene.add(ambientLight, pointLight);

    const character = new THREE.Group();

    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x7ef9ff,
      emissive: 0x0f3b6f,
      roughness: 0.35,
      metalness: 0.6
    });
    const accentMaterial = new THREE.MeshStandardMaterial({
      color: 0x9d82ff,
      emissive: 0x1d0f3f,
      roughness: 0.4,
      metalness: 0.5
    });
    const darkMaterial = new THREE.MeshStandardMaterial({
      color: 0x0b0f1f,
      roughness: 0.6,
      metalness: 0.2
    });

    const headGeometry = new THREE.SphereGeometry(0.55, 32, 32);
    const bodyGeometry = new THREE.CapsuleGeometry(0.45, 0.9, 12, 24);
    const limbGeometry = new THREE.CapsuleGeometry(0.18, 0.55, 6, 16);
    const eyeGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const antennaGeometry = new THREE.CylinderGeometry(0.06, 0.08, 0.4, 16);
    const orbGeometry = new THREE.SphereGeometry(0.12, 16, 16);

    const headMesh = new THREE.Mesh(headGeometry, accentMaterial);
    headMesh.position.set(0, 1.25, 0);

    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bodyMesh.position.set(0, 0.35, 0);

    const leftArm = new THREE.Mesh(limbGeometry, bodyMaterial);
    leftArm.position.set(-0.7, 0.5, 0);
    leftArm.rotation.z = Math.PI * 0.12;

    const rightArm = new THREE.Mesh(limbGeometry, bodyMaterial);
    rightArm.position.set(0.7, 0.5, 0);
    rightArm.rotation.z = -Math.PI * 0.12;

    const leftLeg = new THREE.Mesh(limbGeometry, accentMaterial);
    leftLeg.position.set(-0.25, -0.65, 0);
    leftLeg.rotation.z = Math.PI * 0.05;

    const rightLeg = new THREE.Mesh(limbGeometry, accentMaterial);
    rightLeg.position.set(0.25, -0.65, 0);
    rightLeg.rotation.z = -Math.PI * 0.05;

    const leftEye = new THREE.Mesh(eyeGeometry, darkMaterial);
    leftEye.position.set(-0.18, 1.32, 0.48);

    const rightEye = new THREE.Mesh(eyeGeometry, darkMaterial);
    rightEye.position.set(0.18, 1.32, 0.48);

    const antenna = new THREE.Mesh(antennaGeometry, bodyMaterial);
    antenna.position.set(0, 1.7, -0.05);

    const antennaOrb = new THREE.Mesh(orbGeometry, accentMaterial);
    antennaOrb.position.set(0, 1.95, -0.05);

    character.add(
      headMesh,
      bodyMesh,
      leftArm,
      rightArm,
      leftLeg,
      rightLeg,
      leftEye,
      rightEye,
      antenna,
      antennaOrb
    );
    scene.add(character);

    const ringGeometry = new THREE.TorusGeometry(1.4, 0.06, 16, 100);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0x9d82ff,
      emissive: 0x1d0f3f,
      roughness: 0.4,
      metalness: 0.7,
      transparent: true,
      opacity: 0.6
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI * 0.35;
    ringMesh.position.y = 0.2;
    scene.add(ringMesh);

    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 240;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      const radius = 2.8 + Math.random() * 2.5;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 2.4;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x8ae4ff,
      size: 0.04,
      transparent: true,
      opacity: 0.75
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    const resizeRenderer = () => {
      if (!canvas.parentElement) {
        return;
      }
      const { clientWidth, clientHeight } = canvas.parentElement;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight, false);
    };

    resizeRenderer();
    window.addEventListener("resize", resizeRenderer);

    let frameId;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      character.rotation.y = elapsed * 0.45;
      character.position.y = Math.sin(elapsed * 1.4) * 0.08;
      leftArm.rotation.x = Math.sin(elapsed * 2) * 0.35;
      rightArm.rotation.x = -Math.sin(elapsed * 2) * 0.35;
      leftLeg.rotation.x = -Math.sin(elapsed * 2) * 0.25;
      rightLeg.rotation.x = Math.sin(elapsed * 2) * 0.25;
      ringMesh.rotation.z = elapsed * 0.35;
      particles.rotation.y = elapsed * 0.15;
      camera.position.y = Math.sin(elapsed * 0.4) * 0.2 + 0.3;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      window.removeEventListener("resize", resizeRenderer);
      headGeometry.dispose();
      bodyGeometry.dispose();
      limbGeometry.dispose();
      eyeGeometry.dispose();
      antennaGeometry.dispose();
      orbGeometry.dispose();
      bodyMaterial.dispose();
      accentMaterial.dispose();
      darkMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <main className="page">
      <section className="hero">
        <div className="hero__copy">
          <p className="eyebrow">Nebula One Platform</p>
          <h1>Landing page dengan karakter 3D interaktif untuk presentasi produk futuristik.</h1>
          <p className="subtitle">
            Kembangkan pengalaman interaktif dengan Next.js dan Three.js. Desain ini menonjolkan
            karakter 3D yang ramah, fokus pada pesan brand, dan call-to-action yang jelas.
          </p>
          <div className="actions">
            <button className="primary">Mulai Demo</button>
            <button className="ghost">Lihat Dokumentasi</button>
          </div>
          <div className="stats">
            <div>
              <span className="stat">+42%</span>
              <span className="label">Engagement</span>
            </div>
            <div>
              <span className="stat">24/7</span>
              <span className="label">Realtime Monitor</span>
            </div>
            <div>
              <span className="stat">99.98%</span>
              <span className="label">Uptime</span>
            </div>
          </div>
        </div>
        <div className="hero__visual">
          <canvas ref={canvasRef} aria-label="Animasi 3D" />
          <div className="glow" />
        </div>
      </section>

      <section className="features">
        <h2>Kenapa Nebula One?</h2>
        <div className="feature-grid">
          <article>
            <h3>Karakter 3D</h3>
            <p>Maskot 3D yang bisa dianimasikan untuk menyampaikan pesan brand dengan lebih hangat.</p>
          </article>
          <article>
            <h3>Performa Next.js</h3>
            <p>Dirancang untuk kecepatan, caching otomatis, dan pengalaman pengguna yang mulus.</p>
          </article>
          <article>
            <h3>UI Terstruktur</h3>
            <p>Layout bersih dengan hierarki konten yang memperkuat pesan brand.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
