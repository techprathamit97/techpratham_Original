
import React, { useState, useEffect, useRef, useCallback } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
// --- INTERFACES ---
interface IconItem {
 icon?: string;        // for Font Awesome
  img?: string;         // for SVG or PNG images
  color?: string;
}

interface SphereProps {
  content: IconItem[];
}
const useResponsiveRadius = () => {
  const [radius, setRadius] = useState(170);

  useEffect(() => {
    const updateRadius = () => {
      const width = window.innerWidth;

      if (width < 640) setRadius(110);         // Mobile
      else if (width < 1024) setRadius(140); // Tablet
      else setRadius(170);                   // Desktop
    };

    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  return radius;
};

// --- ICON CONTENT (TypeScript Array) ---
const ICON_CONTENT: IconItem[] = [
  // Full Font Awesome classes used: (fa-solid/fa-brands)
  { icon: "fa-solid fa-code", color: "#3178C6" },
  { icon: "fa-brands fa-react", color: "#61DAFB" },
  { icon: "fa-brands fa-js", color: "#F7DF1E" },
  { icon: "fa-brands fa-js", color: "#F7DF1E" },
  { img: "about/icons/SAP.png" },
  { icon: "fa-brands fa-node-js", color: "#8CC84B" },
  { icon: "fa-brands fa-node-js", color: "#8CC84B" },
  { icon: "fa-brands fa-python", color: "#3776AB" },
  { icon: "fa-brands fa-css3-alt", color: "#1572B6" },
  { icon: "fa-brands fa-html5", color: "#E34F26" },
  { img: "about/icons/oracle.png" },
  { icon: "fa-brands fa-github", color: "#181717" },
  { icon: "fa-brands fa-git-alt", color: "#F05032" },
  { icon: "fa-brands fa-html5", color: "#E34F26" },
  { img: "about/icons/microd.png" },
  { icon: "fa-brands fa-angular", color: "#DD0031" },
  { icon: "fa-brands fa-vuejs", color: "#4FC08D" },
  { icon: "fa-brands fa-docker", color: "#2496ED" },
  { icon: "fa-brands fa-docker", color: "#2496ED" },
  { img: "about/icons/odoo.png" },

  { icon: "fa-brands fa-vuejs", color: "#4FC08D" },
  { img: "about/icons/miro.png" },
  { icon: "fa-brands fa-aws", color: "#FF9900" },
  { icon: "fa-brands fa-google", color: "#4285F4" },
  { icon: "fa-solid fa-database", color: "#00758F" },
  { img: "about/icons/guidewire.png" },
  { icon: "fa-solid fa-terminal", color: "#20C20E" },
  { icon: "fa-solid fa-terminal", color: "#20C20E" },
  { icon: "fa-solid fa-terminal", color: "#20C20E" },
  { icon: "fa-solid fa-leaf", color: "#8BC34A" },
  { icon: "fa-solid fa-bolt", color: "#FFD700" },
  { img: "about/icons/Workday.png" },

  { icon: "fa-solid fa-bolt", color: "#FFD700" },
  { img: "about/icons/serviceN.svg" },
  { icon: "fa-solid fa-bolt", color: "#FFD700" },
  { icon: "fa-solid fa-bolt", color: "#FFD700" },
  { icon: "fa-solid fa-cube", color: "#7E57C2" },
  { icon: "fa-solid fa-robot", color: "#90CAF9" },
  { img: "about/icons/Workday.png" },
  { img: "about/icons/odoo.png" },
  { img: "about/icons/oracle.png" },
  { img: "about/icons/SAP.png" },
  { img: "about/icons/serviceN.svg" },
  { img: "about/icons/guidewire.png" },
  { img: "about/icons/Pega.png" },
  { img: "about/icons/miro.png" },
  { img: "about/icons/microd.png" },
  { icon: "fa-solid fa-robot", color: "#90CAF9" },
  { icon: "fa-solid fa-robot", color: "#90CAF9" },
  { icon: "fa-solid fa-bezier-curve", color: "#FF7043" },
  { img: "about/icons/Workday.png" },

  { icon: "fa-solid fa-bezier-curve", color: "#FF7043" },
  { icon: "fa-solid fa-rocket", color: "#E91E63" },
  { img: "about/icons/Pega.png" },
  { icon: "fa-solid fa-briefcase", color: "#F05032" }, // Representing Workday/HR
  { icon: "fa-solid fa-users-gear", color: "#5F4B8B" }, // Representing Odoo/ERP/Custom Management
  { icon: "fa-solid fa-money-check-dollar", color: "#007F66" },
];

// const [radius, setRadius] = useState(170);
// --- SPHERE CONSTANTS ---

const CONTAINER_SIZE = 300;
const ICON_SIZE = 200;


const generateSpherePoints = (count: number) => {
  const points: { x: number; y: number; z: number }[] = [];
  const offset = 2 / count;
  const increment = Math.PI * (3 - Math.sqrt(5)); 

  for (let i = 0; i < count; i++) {
    const y = i * offset - 1 + offset / 2;
    const r = Math.sqrt(1 - y * y);
    const phi = i * increment;
    const x = Math.cos(phi) * r;
    const z = Math.sin(phi) * r;
    points.push({ x, y, z });
  }

  return points;
};

const TextSphere: React.FC<SphereProps> = ({ content }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const RADIUS = useResponsiveRadius();
  const AUTO_ROTATE_SPEED = { x: .5, y: .5 };
  
  // Drag Logic Refs
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // --- Auto-Rotation Loop ---
  useEffect(() => {
    let frame: number;
    const animate = () => {
      // FIX 1: Only rotate automatically if not currently dragging
      if (!isDragging.current) {
        setRotation((prev) => ({
          x: prev.x + AUTO_ROTATE_SPEED.x,
          y: prev.y + AUTO_ROTATE_SPEED.y,
        }));
      }
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [AUTO_ROTATE_SPEED.x, AUTO_ROTATE_SPEED.y]);

  // --- Drag Event Handlers ---

  const onMouseUp = () => {
    isDragging.current = false;
    if (containerRef.current) {
        containerRef.current.style.cursor = 'grab';
    }
  };

  const onMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    
    // Determine coordinates based on mouse or touch event
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    lastPos.current = { x: clientX, y: clientY };
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grabbing';
    }
  };

  const onMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging.current) return;

    // Determine coordinates based on mouse or touch event
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

    const dx = clientX - lastPos.current.x;
    const dy = clientY - lastPos.current.y;

    setRotation((prev) => ({
      // Invert Y rotation for natural drag feel
      x: prev.x - dy * 0.3,
      y: prev.y + dx * 0.3,
    }));

    lastPos.current = { x: clientX, y: clientY };
  };
  
  // Helper for touch events
  const onTouchMove = (e: React.TouchEvent) => onMouseMove(e.touches[0] as unknown as TouchEvent);
  const onTouchEnd = () => onMouseUp();

  // --- Add/Remove Global Listeners ---
  useEffect(() => {
    // FIX 2: Attach listeners to the document for robust dragging when leaving the container
    document.addEventListener("mousemove", onMouseMove as unknown as (this: Document, ev: MouseEvent) => any);
    document.addEventListener("mouseup", onMouseUp as unknown as (this: Document, ev: MouseEvent) => any);
    
    return () => {
      document.removeEventListener("mousemove", onMouseMove as unknown as (this: Document, ev: MouseEvent) => any);
      document.removeEventListener("mouseup", onMouseUp as unknown as (this: Document, ev: MouseEvent) => any);
    };
  }, []); // Run once on mount

  const points = generateSpherePoints(content.length);
  const sphereTransform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;


  return (
    <>
      {/* Font Awesome CSS Link (Best placement for this environment) */}
    


      <div
        ref={containerRef}
        onMouseDown={onMouseDown as React.MouseEventHandler<HTMLDivElement>}
        onTouchStart={onMouseDown as React.TouchEventHandler<HTMLDivElement>}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          width: CONTAINER_SIZE,
          // height: CONTAINER_SIZE,
          perspective: "1000px",
          cursor: 'grab',
         
          // Cursor managed by onMouseDown/onMouseUp handlers
        }}
        // FIX 3: Added background and shadow for visibility
        className="relative flex items-center justify-center rounded-xl "
      >
        <div
          style={{
            transform: sphereTransform,
            transformStyle: "preserve-3d",
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          {content.map((item, i) => {
            const p = points[i];

            const x = p.x * RADIUS;
            const y = p.y * RADIUS;
            const z = p.z * RADIUS;

            // Opacity scaling based on depth (z in range -1 to 1)
            // const opacity = p.z >= 0 ? 1.0 : 0.3;
            const counterRotate = `rotateY(${-rotation.y}deg) rotateX(${-rotation.x}deg)`;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: ICON_SIZE,
                  height: ICON_SIZE,
                  marginLeft: -ICON_SIZE / 2,
                  marginTop: -ICON_SIZE / 2,
                  // backgroundColor: item.color,
                  // opacity: opacity,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "10px",
                  // Position the element in 3D space using the calculated Fibonacci coordinates
                  transform: `translate3d(${x}px, ${y}px, ${z}px) ${counterRotate}`,
                  // Z-index based on depth (crucial for visual sorting)
                  zIndex: Math.round(z * 100 + 100), 
                }}
                className=" hover:scale-110 duration-150 transition-[opacity,transform,background]"
                title={item.icon}
              >
                {/* Correct use of the full class name */}
                {/* <i className={`${item.icon} text-3xl`} style={{ color: item.color }}/> */}
                {item.icon && (
  <i className={item.icon} style={{ color: item.color, fontSize: "28px" }} />
)}

{item.img && (
  <img
    src={item.img}
    alt="logo"
    style={{ width: 70, height: 40, color: item.color, objectFit: "contain" }}
  />
)}

              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

// Wrapper App
export default function App() {
  return (
    <div className="min-h-screen  flex flex-col items-center justify-center p-4 font-inter">
      
      <TextSphere content={ICON_CONTENT} />
     
    </div>
  );
}