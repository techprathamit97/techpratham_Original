// components/ArticulateViewer.tsx

'use client'; 

import React, { useEffect } from 'react';
const HARDCODED_LESSON_URL = 'https://content.techpratham.com/workday-HCM/index.html#/lessons/jrCgvPeb47EVVKFC_Nswh1iM5h_ZDkOZ';

export default function ArticulateViewer() {
  return (
   <div  style={{ 
        width: '100%', 
        height: 'calc(100vh - 100px)', 
        marginBottom: '30px',
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