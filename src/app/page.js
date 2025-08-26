"use client"
import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import * as THREE from 'three';
import { Button } from "@/components/ui/button"; // Assuming Shadcn UI is set up
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js';
import Link from 'next/link';

export default function Home() {
  const canvasRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Detect dark mode
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeQuery.matches);
    const handleThemeChange = (e) => setIsDarkMode(e.matches);
    darkModeQuery.addEventListener('change', handleThemeChange);

    // Mouse move handler
    const handleMouseMove = (event) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    if (!canvasRef.current) return;

    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasRef.current.appendChild(renderer.domElement);

    // Set scene background based on mode
    scene.background = new THREE.Color(isDarkMode ? 0x000000 : 0xffffff);

    // Lighting
    const ambientLight = new THREE.AmbientLight(isDarkMode ? 0xffffff : 0x000000, 0.5);
    scene.add(ambientLight);

    // Particle system
    const particleCount = 500;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = (Math.random() - 0.5) * 20;
      velocities[i] = 0;
      velocities[i + 1] = 0;
      velocities[i + 2] = 0;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: isDarkMode ? 0xffffff : 0x000000,
      size: 0.05,
    });
    const particles = new THREE.Points(particlesGeometry, particleMaterial);
    scene.add(particles);

    // Simplex noise for organic motion
    const noise = new SimplexNoise();
    const timeScale = 0.000001;
    const noiseScale = 0.0005;
    const mouseInfluence = 0.001;

    // Camera motion parameters
    const radius = 10; // Distance from center
    const angularSpeed = 0.0001; // Extremely slow rotation
    let angle = 4;

    camera.position.z = radius;
    camera.lookAt(0, 0, 0);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      const time = Date.now() * timeScale;
      const positions = particles.geometry.attributes.position.array;

      // Update particle positions
      for (let i = 0; i < particleCount * 3; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        const z = positions[i + 2];

        // Simplex noise for fluid motion
        velocities[i] += noise.noise3d(x * 0.1, y * 0.1, time) * noiseScale;
        velocities[i + 1] += noise.noise3d(y * 0.1, z * 0.1, time + 1000) * noiseScale;
        velocities[i + 2] += noise.noise3d(z * 0.1, x * 0.1, time + 2000) * noiseScale;

        // Mouse influence
        const dx = mouse.current.x * 10 - x;
        const dy = mouse.current.y * 10 - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 5) {
          const force = (5 - distance) * mouseInfluence;
          velocities[i] += (dx / distance) * force;
          velocities[i + 1] += (dy / distance) * force;
        }

        // Dampen velocities
        velocities[i] *= 0.95;
        velocities[i + 1] *= 0.95;
        velocities[i + 2] *= 0.95;

        // Update positions
        positions[i] += velocities[i];
        positions[i + 1] += velocities[i + 1];
        positions[i + 2] += velocities[i + 2];

        // Wrap particles
        if (positions[i] > 10) positions[i] -= 20;
        if (positions[i] < -10) positions[i] += 20;
        if (positions[i + 1] > 10) positions[i + 1] -= 20;
        if (positions[i + 1] < -10) positions[i + 1] += 20;
        if (positions[i + 2] > 10) positions[i + 2] -= 20;
        if (positions[i + 2] < -10) positions[i + 2] += 20;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Update camera position (slow circular motion)
      angle += angularSpeed;
      camera.position.x = radius * Math.sin(angle);
      camera.position.z = radius * Math.cos(angle);
      camera.position.y = 0; // Keep y constant for horizontal orbit
      camera.lookAt(0, 0, 0); // Always face the center

      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Update colors on theme change
    const updateTheme = () => {
      scene.background = new THREE.Color(isDarkMode ? 0x000000 : 0xffffff);
      particleMaterial.color.set(isDarkMode ? 0xffffff : 0x000000);
      ambientLight.color.set(isDarkMode ? 0xffffff : 0x000000);
    };
    updateTheme();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      darkModeQuery.removeEventListener('change', handleThemeChange);
      if (canvasRef.current && renderer.domElement) {
        canvasRef.current.removeChild(renderer.domElement);
      }
    };
  }, [isDarkMode]);

  return (
    <>
      <Head>
        <title>Assi Coupon System</title>
        <meta name="description" content="Simplify coupon management for students with natural language commands" />
      </Head>
      <div className="relative min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Three.js Canvas */}
        <div ref={canvasRef} className="absolute inset-0 z-0" />
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
          <h1 className="text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Assi Coupon System</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-md mb-6">
            Simplify coupon management for students with natural language commands. Track distributions and query records effortlessly.
          </p>
          <Link href="/dashboard">
          <Button className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white">
            Start Managing Coupons
          </Button>
          </Link>
        </div>
      </div>
    </>
  );
}