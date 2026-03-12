
import WorkdayHCMViewer from '@/components/ArticulateViewer/WorkdayHCM'; 
import Header from '@/src/common/Navbar/Navbar'; 
import Footer from '@/src/common/Footer/Footer'; 


export default function ArticulatePage() {
  return (
   
    <div >
        <Header/>
         <div className="py-10">
                  <WorkdayHCMViewer />
              </div>
     
      <Footer/>
    </div>
  );
}