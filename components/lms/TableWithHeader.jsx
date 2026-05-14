"use client";

import { DropZone } from "@measured/puck";

export default function TableWithHeader({
  rows = 6,
  cols = 5,

  headerBg = "#0f4c64",
  headerText = "#ffffff",

  rowBg = "#ffffff",
  altRowBg = "#f1f5f9",

  borderColor = "#e5e7eb",
}) {
  // Calculate minimum width based on number of columns
  const minColumnWidth = 120; // Minimum width per column
  const minTableWidth = Math.max(cols * minColumnWidth, 300); // At least 300px wide

  return (
    <section className="w-full">
      {/* Responsive wrapper with horizontal scroll */}
      <div className="overflow-x-auto overflow-y-hidden">
        <div
          style={{
            minWidth: `${minTableWidth}px`,
            border: `1px solid ${borderColor}`,
            borderRadius: "12px",
            overflow: "hidden", // Changed from scroll to hidden
          }}
        >
          {/* GRID */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${cols}, minmax(${minColumnWidth}px, 1fr))`,
            }}
          >
            {/* HEADER */}
            {Array.from({ length: cols }).map((_, colIndex) => (
              <div
                key={`header-${colIndex}`}
                style={{
                  background: headerBg,
                  color: headerText,
                  padding: "14px 8px", // Reduced horizontal padding for mobile
                  fontWeight: 600,
                  borderRight: colIndex < cols - 1 ? `1px solid ${borderColor}` : 'none',
                  fontSize: "14px", // Responsive font size
                  lineHeight: "1.2",
                  wordBreak: "break-word", // Handle long text
                }}
              >
                <DropZone zone={`kpi-header-${colIndex}`} />
              </div>
            ))}

            {/* BODY */}
            {Array.from({ length: rows }).map((_, rowIndex) =>
              Array.from({ length: cols }).map((_, colIndex) => (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  style={{
                    padding: "12px 8px", // Reduced horizontal padding for mobile
                    background: rowIndex % 2 === 0 ? rowBg : altRowBg,
                    borderTop: `1px solid ${borderColor}`,
                    borderRight: colIndex < cols - 1 ? `1px solid ${borderColor}` : 'none',
                    fontSize: "13px", // Slightly smaller font for mobile
                    lineHeight: "1.3",
                    wordBreak: "break-word", // Handle long text
                    minHeight: "40px", // Minimum height for touch targets
                  }}
                >
                  <DropZone zone={`kpi-cell-${rowIndex}-${colIndex}`} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile scroll indicator */}
      <div className="block sm:hidden text-xs text-gray-500 mt-2 text-center">
        ← Scroll horizontally to see more →
      </div>
    </section>
  );
}

