

function getTextFromHtml(htmlString: string): string {
  if (!htmlString) return "";
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlString;
  return tempDiv.textContent || tempDiv.innerText || "";
} 
const CourseCard = ({ course, index = 0 }: any) => {
  // Get first letter of course title (or fallback to "?")
  const plainTitle = getTextFromHtml(course.title);
  const firstLetter = plainTitle.charAt(0).toUpperCase() || "?";

  // Alternate the accent strip colour (red / navy) like the design.
  const stripColor = index % 2 === 0 ? "bg-[#ff2a3b]" : "bg-[#1b1340]";
  const avatarColor = index % 2 === 0 ? "text-[#ff2a3b]" : "text-[#1b1340]";

  return (
    <div className="group w-full min-h-[90px] bg-white rounded-2xl shadow-sm flex overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">

      {/* LEFT STRIP with letter avatar */}
      <div className={`w-16 flex items-center justify-center ${stripColor}`}>
        <div
          className={`bg-white w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold shadow ${avatarColor}`}
        >
          {firstLetter}
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-2 relative">

        {course.rating && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-600 flex items-center gap-0.5">
            <span className="text-[#ff2a3b]">★</span> {course.rating}
          </div>
        )}

        <h3
          className="text-sm font-semibold text-gray-900 leading-snug pr-2"
          dangerouslySetInnerHTML={{ __html: course.title }}
        />

        <div className="text-xs text-gray-500 ">
          {course.level && <span>{course.level} · </span>}
          Live Online
        </div>

        <div className="mt-1">
          <a
            href={`/courses/${course.link}`}
            className="text-sm text-[#ff2a3b] font-semibold hover:underline inline-flex items-center gap-1 group-hover:gap-1.5 transition-all"
          >
            View Details →
          </a>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
