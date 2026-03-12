// import Image from "next/image";

// const CourseCard = ({ course }: any) => {
//   return (
//     <div className="w-full bg-white rounded-lg shadow-md flex overflow-hidden">

//       {/* LEFT COLOR STRIP */}
      
//       <div className="w-28 flex items-center justify-center bg-gradient-to-tl from-[#C6151D] to-[#600A0E]">
//         <Image
//           src={course.logo}
//           alt="logo"
//           width={70}
//           height={70}
//           className="bg-white rounded-full p-2"
//         />
//       </div>

//       {/* RIGHT CONTENT */}
//       <div className="flex-1 p-2 relative">

//         {/* Rating */}
//         <div className="absolute top-4 right-0 flex items-center gap-1 text-sm">
//           ⭐⭐⭐⭐⭐
//           <span className="text-gray-600">
//             {course.rating} ({course.reviews})
//           </span>
//         </div>

//         {/* Title */}
//         <h3 className="text-sm font-semibold text-gray-900 leading-snug pr-24">
//           <div
//                       className="text-sm text-gray-700"
//                       dangerouslySetInnerHTML={{ __html: course.title }}
//                     />
//         </h3>

//         {/* Meta */}
//         <div className="flex items-center gap-2 text-sm text-gray-500 ">
//           <span>📘 {course.learners} Learners</span>
//           <span>📅 Weekend/Weekday</span>
//           <span>🎥 Live Class</span>
//         </div>

//         {/* Features */}
     

//         {/* Buttons */}
//         <div className="mt-4 flex gap-3">
//           <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium">
//             View Details
//           </button>

         
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseCard;
function getTextFromHtml(htmlString: string): string {
  if (!htmlString) return "";
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlString;
  return tempDiv.textContent || tempDiv.innerText || "";
} 
const CourseCard = ({ course }: any) => {
  // Get first letter of course title (or fallback to "?")
const plainTitle = getTextFromHtml(course.title);
  const firstLetter = plainTitle.charAt(0).toUpperCase() || "?";

  return (
    <div className="w-full bg-white rounded-lg shadow flex overflow-hidden border">

      {/* LEFT STRIP with letter avatar */}
      <div className="w-16 flex items-center justify-center bg-gradient-to-tl from-[#C6151D] to-[#600A0E]">
        <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-[#C6151D]">
          {firstLetter}
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-3 relative">

        {course.rating && (
          <div className="absolute top-2 right-2 text-xs text-gray-600">
            ⭐ {course.rating}
          </div>
        )}

        <h3
          className="text-sm font-semibold text-gray-900 leading-snug"
          dangerouslySetInnerHTML={{ __html: course.title }}
        />

        <div className="text-xs text-gray-500 mt-1">
          {course.level && <span>{course.level} · </span>}
          Live Online
        </div>

        <div className="mt-3">
          <a
            href={`/courses/${course.link}`}
            className="text-sm text-blue-600 font-medium hover:underline"
          >
            View Details →
          </a>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
