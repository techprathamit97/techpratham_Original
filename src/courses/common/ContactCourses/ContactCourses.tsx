
"use client";

import { MessageCircle } from "lucide-react";
import CategoryList from "./CategoryList";
import Image from "next/image";

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
        
        <div className="w-full bg-[#212529] mx-auto pt-5 px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white  rounded-xl shadow-lg overflow-hidden border"
                    >
                        {/* Header */}
                        <div className="flex items-center gap-2 px-2 py-1 bg-gradient-to-tl from-[#C6151D] to-[#600A0E]">
                            <Image
                                src={
                                    item.country === "USA"
                                        ? item.imgUs
                                        : item.imgIn
                                }
                                width={32}
                                height={20}
                                className="w-8 h-5 object-cover"
                                alt={`${item.country} Flag`}
                            />
                            <h3 className="text-lg text-white font-semibold">{item.country}</h3>
                        </div>

                        {/* Body */}
                        <div className="px-5 py-1 ">
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
                                        <div className="flex items-center md:gap-2 gap-1">
                                            <Image
                                                src={item.imgIn}
                                                width={20}
                                                height={16}
                                                alt="India Flag"
                                                className="w-5 h-4 object-cover rounded-sm"
                                            />
                                            <span className="font-semibold text-gray-800  text-sm ">
                                                {item.phone}
                                            </span>
                                        </div>

                                        <a
                                            href={`https://wa.me/${item.phone.replace(/\D/g, "")}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-md text-[13px] font-medium hover:bg-green-200 transition"
                                        >
                                            <MessageCircle size={12} />
                                            WhatsApp
                                        </a>
                                    </div>
                                )}

                                {/* USA Number */}
                                {item.phoneUs && (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center md:gap-2 gap-1">
                                            <Image
                                                src={item.imgUs}
                                                width={20}
                                                height={16}
                                                alt="USA Flag"
                                                className="w-5 h-4 object-cover rounded-sm"
                                            />
                                            <span className="font-semibold text-sm  text-gray-800">
                                                {item.phoneUs}
                                            </span>
                                        </div>

                                        <a
                                            href={`https://wa.me/${item.phoneUs.replace(/\D/g, "")}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-md text-[13px] font-medium hover:bg-green-200 transition"
                                        >
                                            <MessageCircle size={12} />
                                            WhatsApp
                                        </a>
                                    </div>
                                )}

                            </div>


                        </div>

                        {/* Footer */}
                        <div className="bg-yellow-600 px-5 py-2 text-black font-medium text-sm">
                            <a
                                href={item.map}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 hover:underline"
                            >
                                <Image
                                    src="https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2.png"
                                    width={20}
                                    height={20}
                                    className="w-5 h-5"
                                    alt="Google Maps Location Pin"
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
