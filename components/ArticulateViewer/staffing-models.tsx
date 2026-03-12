

'use client'; 

import React, { useEffect } from 'react';


const HARDCODED_LESSON_URL = 'https://content.techpratham.com/workday-staffing-module/index.html#/lessons/g83KMCLJMtFIEy1FvSfxF1txtwG1kWaV';

export default function ArticulateViewer() {
  return (
   <div  style={{ 
        width: '100%', 
        height: 'calc(100vh - 100px)', 
        overflow: 'hidden',
        userSelect: 'none', 
      }}>
      <iframe
        src={HARDCODED_LESSON_URL} 
        title="Articulate Lesson Viewer"
        width="100%"
        height="100%"
        style={{ border: 'none' }}
        allowFullScreen={true}
        
      />
   </div>
  );
}