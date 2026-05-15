"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import type { VineyardOpportunity } from "@/lib/types";

type ActivePin = {
  id: string;
  name: string;
  region: string;
  country: string;
  score: number;
  x: number;
  y: number;
};

function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lng + 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function createEarthTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const ocean = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  ocean.addColorStop(0, "#071a24");
  ocean.addColorStop(0.5, "#0d2632");
  ocean.addColorStop(1, "#061019");
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(152, 190, 186, 0.12)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= canvas.width; x += canvas.width / 24) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += canvas.height / 12) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  const land = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  land.addColorStop(0, "rgba(83, 111, 91, 0.88)");
  land.addColorStop(0.55, "rgba(67, 88, 78, 0.92)");
  land.addColorStop(1, "rgba(50, 72, 68, 0.86)");
  ctx.fillStyle = land;

  const project = (lat: number, lng: number) => ({
    x: ((lng + 180) / 360) * canvas.width,
    y: ((90 - lat) / 180) * canvas.height
  });

  const ellipses = [
    { lat: 49, lng: -105, rx: 260, ry: 150, rot: -0.2 },
    { lat: 39, lng: -95, rx: 220, ry: 120, rot: 0.35 },
    { lat: 21, lng: -101, rx: 110, ry: 70, rot: 0.5 },
    { lat: 52, lng: 10, rx: 150, ry: 92, rot: 0.15 },
    { lat: 42, lng: -3, rx: 110, ry: 70, rot: -0.15 },
    { lat: 44, lng: 12, rx: 115, ry: 72, rot: 0.25 },
    { lat: 27, lng: 18, rx: 230, ry: 170, rot: 0.2 },
    { lat: 53, lng: 72, rx: 330, ry: 135, rot: -0.08 },
    { lat: -15, lng: -60, rx: 130, ry: 220, rot: -0.24 }
  ];

  for (const shape of ellipses) {
    const point = project(shape.lat, shape.lng);
    ctx.beginPath();
    ctx.ellipse(point.x, point.y, shape.rx, shape.ry, shape.rot, 0, Math.PI * 2);
    ctx.fill();
  }

  const vignette = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 120, canvas.width / 2, canvas.height / 2, 880);
  vignette.addColorStop(0, "rgba(255, 255, 255, 0.08)");
  vignette.addColorStop(1, "rgba(0, 0, 0, 0.24)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function makeArc(start: THREE.Vector3, end: THREE.Vector3) {
  const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(2.85);
  const curve = new THREE.CatmullRomCurve3([start, mid, end]);
  return new THREE.BufferGeometry().setFromPoints(curve.getPoints(42));
}

function addGlobeGrid(group: THREE.Group, radius: number) {
  const material = new THREE.LineBasicMaterial({ color: 0x8cc5c0, transparent: true, opacity: 0.16 });
  for (let lat = -60; lat <= 60; lat += 20) {
    const points = [];
    for (let lng = -180; lng <= 180; lng += 4) points.push(latLngToVector3(lat, lng, radius));
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material));
  }
  for (let lng = -180; lng < 180; lng += 30) {
    const points = [];
    for (let lat = -80; lat <= 80; lat += 4) points.push(latLngToVector3(lat, lng, radius));
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material));
  }
}

export function OpportunityMap({ vineyards }: { vineyards: VineyardOpportunity[] }) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const [active, setActive] = useState<ActivePin | null>(null);
  const topVineyards = useMemo(() => vineyards.slice(0, 8), [vineyards]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0.1, 6.75);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0x9fb7bf, 1.7);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xfff0cf, 2.4);
    key.position.set(-3, 2.5, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x80d6ff, 1.4);
    rim.position.set(3.5, -0.5, -2.5);
    scene.add(rim);

    const globeGroup = new THREE.Group();
    globeGroup.rotation.set(-0.16, -0.76, 0.04);
    scene.add(globeGroup);

    const earthTexture = createEarthTexture();
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(2, 96, 96),
      new THREE.MeshStandardMaterial({
        map: earthTexture ?? undefined,
        color: earthTexture ? 0xffffff : 0x0c2530,
        roughness: 0.82,
        metalness: 0.08
      })
    );
    globeGroup.add(earth);
    addGlobeGrid(globeGroup, 2.012);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(2.12, 96, 96),
      new THREE.MeshBasicMaterial({ color: 0x71c7ff, transparent: true, opacity: 0.08, side: THREE.BackSide })
    );
    globeGroup.add(atmosphere);

    const shanghai = latLngToVector3(31.23, 121.47, 2.035);
    const arcMaterial = new THREE.LineBasicMaterial({ color: 0xd8a24a, transparent: true, opacity: 0.18 });
    for (const vineyard of vineyards.slice(0, 64)) {
      const destination = latLngToVector3(vineyard.lat, vineyard.lng, 2.035);
      globeGroup.add(new THREE.Line(makeArc(shanghai, destination), arcMaterial));
    }

    const pinMeshes: THREE.Mesh[] = [];
    const pinGeometry = new THREE.SphereGeometry(0.026, 16, 16);
    const highMaterial = new THREE.MeshBasicMaterial({ color: 0x7fe7a4 });
    const midMaterial = new THREE.MeshBasicMaterial({ color: 0xd8a24a });
    const watchMaterial = new THREE.MeshBasicMaterial({ color: 0xf2dfc7 });
    for (const vineyard of vineyards) {
      const score = vineyard.overallFitScore;
      const pin = new THREE.Mesh(pinGeometry, score >= 84 ? highMaterial : score >= 78 ? midMaterial : watchMaterial);
      pin.position.copy(latLngToVector3(vineyard.lat, vineyard.lng, 2.08));
      const scale = 1 + Math.max(0, score - 70) / 38;
      pin.scale.setScalar(scale);
      pin.userData = {
        id: vineyard.id,
        name: vineyard.name,
        region: vineyard.region,
        country: vineyard.country,
        score
      };
      globeGroup.add(pin);
      pinMeshes.push(pin);
    }

    const starGeometry = new THREE.BufferGeometry();
    const starPositions: number[] = [];
    for (let index = 0; index < 900; index += 1) {
      const radius = 11 + Math.random() * 7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions.push(radius * Math.sin(phi) * Math.cos(theta), radius * Math.sin(phi) * Math.sin(theta), radius * Math.cos(phi));
    }
    starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starPositions, 3));
    scene.add(new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xf8f2e8, size: 0.025, transparent: true, opacity: 0.55 })));

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let hoveredId = "";
    let dragging = false;
    let moved = false;
    let lastX = 0;
    let lastY = 0;
    let animationFrame = 0;

    const resize = () => {
      const rect = mount.getBoundingClientRect();
      const width = Math.max(320, rect.width);
      const height = Math.max(360, rect.height);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const updateHover = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(pinMeshes, false)[0]?.object as THREE.Mesh | undefined;
      renderer.domElement.style.cursor = hit ? "pointer" : dragging ? "grabbing" : "grab";
      if (!hit) {
        hoveredId = "";
        setActive(null);
        return;
      }
      const data = hit.userData as Omit<ActivePin, "x" | "y">;
      hoveredId = data.id;
      setActive({ ...data, x: event.clientX - rect.left, y: event.clientY - rect.top });
    };

    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      moved = false;
      lastX = event.clientX;
      lastY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (dragging) {
        const dx = event.clientX - lastX;
        const dy = event.clientY - lastY;
        globeGroup.rotation.y += dx * 0.006;
        globeGroup.rotation.x += dy * 0.003;
        globeGroup.rotation.x = Math.max(-0.8, Math.min(0.55, globeGroup.rotation.x));
        lastX = event.clientX;
        lastY = event.clientY;
        moved = true;
      }
      updateHover(event);
    };
    const onPointerUp = (event: PointerEvent) => {
      dragging = false;
      renderer.domElement.releasePointerCapture(event.pointerId);
      if (!moved && hoveredId) router.push(`/app/vineyards/${hoveredId}`);
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointerleave", () => {
      dragging = false;
      hoveredId = "";
      setActive(null);
    });

    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    const animate = () => {
      if (!dragging) globeGroup.rotation.y += 0.0014;
      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      mount.removeChild(renderer.domElement);
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose();
        const material = mesh.material;
        if (Array.isArray(material)) material.forEach((item) => item.dispose());
        else material?.dispose();
      });
      earthTexture?.dispose();
      renderer.dispose();
    };
  }, [router, vineyards]);

  return (
    <div className="globe-map" role="img" aria-label={`${vineyards.length} seeded vineyard opportunities on a 3D globe`}>
      <div className="globe-canvas" ref={mountRef} />
      <div className="globe-overlay">
        <span>{vineyards.length} vineyard signals</span>
        <span>Drag to rotate</span>
      </div>
      {active ? (
        <div className="globe-tooltip" style={{ left: active.x, top: active.y }}>
          <strong>{active.name}</strong>
          <span>
            {active.region}, {active.country}
          </span>
          <span>{active.score}/100 fit</span>
        </div>
      ) : null}
      <div className="globe-fallback" aria-label="Top ranked vineyard links">
        {topVineyards.map((vineyard) => (
          <a href={`/app/vineyards/${vineyard.id}`} key={vineyard.id}>
            <span>{vineyard.name}</span>
            <strong>{vineyard.overallFitScore}</strong>
          </a>
        ))}
      </div>
    </div>
  );
}
