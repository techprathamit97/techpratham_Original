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
  // Calculate if table should be full width or scrollable
  const getTableLayout = () => {
    if (typeof window !== 'undefined') {
      const screenWidth = window.innerWidth;
      const minColumnWidth = 120;
      const maxTableWidth = screenWidth - 40; // Account for padding
      const naturalTableWidth = cols * minColumnWidth;
      
      if (screenWidth < 640) {
        // Mobile: Always make scrollable to show all content
        const mobileColumnWidth = Math.max(100, 120); // Ensure readable width
        return {
          useFullWidth: false,
          columnWidth: mobileColumnWidth,
          tableWidth: cols * mobileColumnWidth,
          needsScroll: true, // Always scrollable on mobile
          isMobile: true
        };
      } else if (naturalTableWidth <= maxTableWidth) {
        // Desktop/Tablet: Table fits, use full width
        return {
          useFullWidth: true,
          columnWidth: Math.floor(maxTableWidth / cols),
          tableWidth: maxTableWidth,
          needsScroll: false,
          isMobile: false
        };
      } else {
        // Desktop/Tablet: Table too wide, make scrollable
        return {
          useFullWidth: false,
          columnWidth: minColumnWidth,
          tableWidth: naturalTableWidth,
          needsScroll: true,
          isMobile: false
        };
      }
    }
    
    // Fallback
    return {
      useFullWidth: true,
      columnWidth: 150,
      tableWidth: cols * 150,
      needsScroll: false,
      isMobile: false
    };
  };

  const layout = getTableLayout();

  return (
    <section className="w-full">
      {/* Container with proper mobile handling */}
      <div className="w-full" style={{ maxWidth: '100vw' }}>
        {/* Always scrollable wrapper for mobile, conditional for desktop */}
        <div 
          className="overflow-x-auto overflow-y-hidden"
          style={{ 
            maxWidth: '100%',
            WebkitOverflowScrolling: 'touch',
            // Ensure scrolling works on mobile
            overscrollBehaviorX: 'contain'
          }}
        >
          <div
            style={{
              width: layout.useFullWidth ? '100%' : `${layout.tableWidth}px`,
              minWidth: layout.isMobile ? `${layout.tableWidth}px` : 'auto',
              maxWidth: layout.useFullWidth ? '100%' : 'none',
              border: `1px solid ${borderColor}`,
              borderRadius: "8px",
              overflow: "hidden",
              backgroundColor: '#fff',
              margin: layout.useFullWidth ? '0' : '0 auto'
            }}
          >
            {/* GRID with responsive or fixed columns */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: layout.useFullWidth 
                  ? `repeat(${cols}, 1fr)` 
                  : `repeat(${cols}, ${layout.columnWidth}px)`,
                width: "100%",
              }}
            >
              {/* HEADER */}
              {Array.from({ length: cols }).map((_, colIndex) => (
                <div
                  key={`header-${colIndex}`}
                  style={{
                    background: headerBg,
                    color: headerText,
                    padding: layout.isMobile ? "10px 6px" : layout.useFullWidth ? "12px 8px" : "8px 4px",
                    fontWeight: 600,
                    borderRight: colIndex < cols - 1 ? `1px solid ${borderColor}` : 'none',
                    fontSize: layout.isMobile ? "12px" : layout.useFullWidth ? "14px" : "11px",
                    lineHeight: "1.2",
                    wordBreak: "break-word",
                    textAlign: "center",
                    minHeight: layout.isMobile ? "36px" : layout.useFullWidth ? "40px" : "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxSizing: "border-box",
                    width: layout.isMobile ? `${layout.columnWidth}px` : 'auto',
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
                      padding: layout.isMobile ? "8px 6px" : layout.useFullWidth ? "10px 8px" : "6px 3px",
                      background: rowIndex % 2 === 0 ? rowBg : altRowBg,
                      borderTop: `1px solid ${borderColor}`,
                      borderRight: colIndex < cols - 1 ? `1px solid ${borderColor}` : 'none',
                      fontSize: layout.isMobile ? "11px" : layout.useFullWidth ? "13px" : "10px",
                      lineHeight: "1.3",
                      wordBreak: "break-word",
                      minHeight: layout.isMobile ? "32px" : layout.useFullWidth ? "36px" : "28px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      boxSizing: "border-box",
                      width: layout.isMobile ? `${layout.columnWidth}px` : 'auto',
                    }}
                  >
                    <DropZone zone={`kpi-cell-${rowIndex}-${colIndex}`} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator - show on mobile or when scrollable */}
      {(layout.needsScroll || layout.isMobile) && (
        <div className="text-xs text-gray-500 mt-2 text-center">
          <span className="text-gray-400">
            ← Swipe to view all {cols} columns →
          </span>
        </div>
      )}
      
      {/* Enhanced scrollbar styling */}
      <style jsx>{`
        div::-webkit-scrollbar {
          height: 6px;
        }
        div::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        
        /* Mobile specific styles */
        @media (max-width: 640px) {
          section {
            padding: 0 !important;
          }
          
          /* Ensure smooth scrolling on mobile */
          div[style*="overflow-x-auto"] {
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
          }
        }
      `}</style>
    </section>
  );
}

