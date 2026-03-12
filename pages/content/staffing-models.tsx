"use client";

import { useEffect } from "react";
import StaffingModelsViewer from '@/components/ArticulateViewer/staffing-models';
import Header from '@/src/common/Navbar/Navbar';
import Footer from '@/src/common/Footer/Footer';

export default function ArticulatePage() {
 return (
    <div >
      <Header />
      <div className="py-10">
          <StaffingModelsViewer  />
      </div>
    
      <Footer />

    </div>
  );
}
