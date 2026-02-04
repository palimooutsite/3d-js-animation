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

    const coreGeometry = new THREE.TorusKnotGeometry(1.1, 0.35, 160, 24);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x7ef9ff,
      emissive: 0x0f3b6f,
      roughness: 0.2,
      metalness: 0.8
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);

    const ringGeometry = new THREE.RingGeometry(1.8, 2.1, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI * 0.5;
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
      coreMesh.rotation.x = elapsed * 0.35;
      coreMesh.rotation.y = elapsed * 0.55;
      ringMesh.rotation.z = elapsed * 0.25;
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
      coreGeometry.dispose();
      coreMaterial.dispose();
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
          <h1>Landing page dengan animasi Three.js untuk presentasi produk futuristik.</h1>
          <p className="subtitle">
            Kembangkan pengalaman interaktif dengan Next.js dan Three.js. Desain ini menonjolkan
            visual 3D yang lembut, fokus pada pesan brand, dan call-to-action yang jelas.
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
            <h3>Real-time 3D</h3>
            <p>Animasi ringan dengan kontrol penuh, mudah disesuaikan untuk kampanye atau demo produk.</p>
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
