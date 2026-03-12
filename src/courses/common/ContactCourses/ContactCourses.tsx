// "use client";

// import React from "react";
// import { Home, Phone, Mail, MessageCircle } from "lucide-react";

// /* ================= DATA ================= */

// const items = [
//     {
//         title: "Head Office",
//         address: "G-31, 1st Floor, Sector-3, Noida - 201301",
//         imgIn:"/course/icons/inlogo.png",
//         imgUs:"/course/icons/uslogo.png",
//         phone: "+91-8882178896",
//         phoneUs: "+1 (343) 477-0926",
//         email: "info@techpratham.com",
//     },
//     {
//         title: "Noida Office",
//         address: "C-2, Sector-1, Noida, Uttar Pradesh - 201301",
//         phone: "+91-8882178896",
//         imgIn:"/course/icons/inlogo.png",
//         imgUs:"/course/icons/uslogo.png",
//         phoneUs: "+1 (343) 477-0926",
//         email: "info@techpratham.com",
//     },
//     {
//         title: "Hyderabad Office",
//         address: "LVS Arcade, 6th Floor, Hitech City, Hyderabad",
//         phone: "+91-8383058741",
//         imgIn:"/course/icons/inlogo.png",
//         imgUs:"/course/icons/uslogo.png",
//         phoneUs: "+1 (343) 477-0926",
//         email: "info@techpratham.com",
//     },
// ];

// /* ================= STYLES ================= */

// const gradients = [
//     "from-[#600A0E] to-[#CA8A04]",
//     "from-[#600A0E] to-[#CA8A04]",
//     "from-[#600A0E] to-[#CA8A04]",
// ];



// /* ================= MAIN ================= */

// export default function AddressCards() {
//     return (
//         <div className="max-w-6xl mx-auto p-6">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {items.map((item, index) => (
//                     <Item key={index} item={item} index={index} />
//                 ))}
//             </div>
//         </div>
//     );
// }

// /* ================= CARD ================= */

// const Item = ({ item, index }: any) => (
//     <div className="relative w-full  bg-gradient-to-tl from-[#C6151D] to-[#600A0E] h-[190px]">
//         {/* Card body */}
//         <div
//             className={`absolute inset-0 bg-gradient-to-r ${gradients[index % gradients.length]
//                 } rounded-br-[180px] shadow-lg`}
//         >
//             <div className="flex items-start h-full px-4 pt-4 gap-4">

//                 {/* Icon */}
//                 <div className="w-[64px] h-[64px] bg-gradient-to-tl from-[#C6151D] to-[#600A0E] rounded-full flex items-center justify-center shadow-md shrink-0">
//                     <Home size={30} className="text-white" />
//                 </div>

//                 {/* Content */}
//                 <div className="text-white space-y-1">
//                     <h4 className="text-sm font-bold tracking-wide uppercase">
//                         {item.title}
//                     </h4>

//                     <p className="text-xs leading-snug opacity-95">
//                         {item.address}
//                     </p>

//                     {/* Phone */}
//                     <a
//                         href={`tel:${item.phone.replace(/\D/g, "")}`}
//                         className="flex items-center gap-1 text-xs font-medium hover:underline"
//                     >
//                         <Phone size={14} />
//                         {item.phone}
//                     </a>

//                     {/* Email */}
//                     <a
//                         href={`mailto:${item.email}`}
//                         className="flex items-center gap-1 text-xs hover:underline"
//                     >
//                         <Mail size={14} />
//                         {item.email}
//                     </a>

//                     {/* WhatsApp Button */}
//                     <a
//                         href={`https://wa.me/${item.phone.replace(/\D/g, "")}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-md bg-gray-200 px-3 py-1.5 text-xs font-semibold text-black hover:bg-green-600 transition"
//                     >
//                         <MessageCircle size={14} />
//                         Chat on WhatsApp
//                     </a>

//                 </div>
//             </div>
//         </div>

//         {/* Number */}

//     </div>
// );


"use client";

import { MessageCircle } from "lucide-react";
import CategoryList from "./CategoryList";

const items = [
    {
        title: "Head Office",
        address: "G-31, 1st Floor, Sector-3, Noida - 201301",
        imgIn: "/course/icons/indian.jpg",
        imgUs: "/course/icons/uslogo.png",
        phone: "+91-8882178896",
        phoneUs: "+1 (343) 477-0926",
        email: "info@techpratham.com",
        country: "India",
        map: "https://maps.app.goo.gl/mZCbqzqTdnfrV5D76",
    },
    {
        title: "Noida Office",
        address: "C-2, Sector-1, Noida, Uttar Pradesh - 201301",
        phone: "+91-8882178896",
        imgIn: "/course/icons/indian.jpg",
        imgUs: "/course/icons/uslogo.png",
        phoneUs: "+1 (343) 477-0926",
        email: "info@techpratham.com",
        country: "India",
        map: "https://maps.app.goo.gl/mZCbqzqTdnfrV5D76",
    },
    {
        title: "Hyderabad Office",
        address: "LVS Arcade, 6th Floor, Hitech City, Hyderabad",
        phone: "+91-8383058741",
        imgIn: "/course/icons/indian.jpg",
        imgUs: "/course/icons/uslogo.png",
        phoneUs: "+1 (343) 477-0926",
        email: "info@techpratham.com",
        country: "India",
        map: "https://maps.app.goo.gl/rtX25hKoMyt7dnJK6",
    },
];

export default function AddressCards() {
    return (
        <>
        
        <div className="w-full bg-[#212529] mx-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white  rounded-xl shadow-lg overflow-hidden border"
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 px-5 py-2 bg-gradient-to-tl from-[#C6151D] to-[#600A0E]">
                            <img
                                src={
                                    item.country === "USA"
                                        ? item.imgUs
                                        : item.imgIn
                                }
                                className="w-8 h-5 object-cover"
                                alt="flag"
                            />
                            <h3 className="text-lg text-white font-semibold">{item.country}</h3>
                        </div>

                        {/* Body */}
                        <div className="px-5 py-4 space-y-2">
                            <h4 className="text-lg font-semibold text-blue-700">
                                {item.title}
                            </h4>

                            <p className="text-gray-700 text-sm leading-relaxed">
                                {item.address}
                            </p>

                            {/* Phone + WhatsApp */}
                            <div className="space-y-2 pt-2">

                                {/* India Number */}
                                {item.phone && (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={item.imgIn}
                                                alt="India Flag"
                                                className="w-5 h-4 object-cover rounded-sm"
                                            />
                                            <span className="font-semibold text-gray-800">
                                                {item.phone}
                                            </span>
                                        </div>

                                        <a
                                            href={`https://wa.me/${item.phone.replace(/\D/g, "")}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-green-200 transition"
                                        >
                                            <MessageCircle size={16} />
                                            WhatsApp
                                        </a>
                                    </div>
                                )}

                                {/* USA Number */}
                                {item.phoneUs && (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={item.imgUs}
                                                alt="USA Flag"
                                                className="w-5 h-4 object-cover rounded-sm"
                                            />
                                            <span className="font-semibold text-gray-800">
                                                {item.phoneUs}
                                            </span>
                                        </div>

                                        <a
                                            href={`https://wa.me/${item.phoneUs.replace(/\D/g, "")}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-green-200 transition"
                                        >
                                            <MessageCircle size={16} />
                                            WhatsApp
                                        </a>
                                    </div>
                                )}

                            </div>


                        </div>

                        {/* Footer */}
                        <div className="bg-yellow-600 px-5 py-3 text-black font-medium text-sm">
                            <a
                                href={item.map}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 hover:underline"
                            >
                                <img
                                    src="https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2.png"
                                    className="w-5 h-5"
                                    alt="map"
                                />
                                View on Google Maps
                            </a>
                        </div>


                    </div>
                ))}
            </div>
        </div>
{/* <CategoryList/> */}
        </>
    );
}
