import Image from "next/image";

const TechPrathamLogo = () => {
  return (
    <div className="flex items-center gap-0">

      {/* TP IMAGE */}
      <div className="flex items-end">
        <Image
          src="/navbar/tp.svg"
          alt="tp logo"
          width={55}
          height={23}
          className="object-contain"
        />
      </div>

      {/* TEXT SECTION */}
      <div className="flex flex-col leading-[0.8]">

        {/* OVERLAP PART */}
        <div className="-ml-3 flex flex-col font-serpentine pb-1 pt-1 ">
          <span className="text-white text-[17px]  pt-1">
            tech
          </span>

          <span className="text-white text-[17px] ">
            pratham
          </span>
        </div>

        {/* NORMAL POSITION */}
        <span className="text-white text-[8px] ">
          Technology First
        </span>

      </div>


      {/* DIVIDER */}
      <div className="h-9 w-[1px] bg-white opacity-90 mx-1 mt-2" />

      {/* YEARS */}
      <div className="flex flex-col ">
        <span className="text-white font-playfair text-[32px] font-fjalla leading-none">
          10
        </span>

        <span className="text-white font-extrabold text-[12px] ">
          YEARS
        </span>
      </div>

    </div>
  );
};

export default TechPrathamLogo;
