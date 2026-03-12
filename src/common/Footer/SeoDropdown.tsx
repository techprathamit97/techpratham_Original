"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

const SeoDropdown = () => {
  const [open, setOpen] = useState(false);

const sections = [
    {
      title: "TRAINING IN CHENNAI",
      links: [
        {
          label: "Workday Training in Chennai",
          href: "/courses/workday-training-in-chennai",
        },
        {
          label: "Servicenow Training in Chennai",
          href: "/courses/servicenow-training-in-chennai",
        },
        {
          label: "Microsoft Dynamics Training in Chennai",
          href: "/courses/microsoft-dynamics-365-training-in-chennai",
        },
        {
          label: " Agentic Ai Training in Chennai",
          href: "/courses/master-in-agentic-ai",
        },
        {
          label: "SAP Training in Chennai",
          href: "/courses/sap-certification-training",
        },
        {
          label: "Guidewire Training  in Chennai",
          href: "/courses/guidewire-training-in-chennai",
        },
      ],
    },
    {
      title: "TRAINING IN BANGALORE",
      links: [
        {
          label: "Workday Training in Bangalore",
          href: "/courses/workday-training-in-bangalore",
        },
        {
          label: "ServiceNow Training in Bangalore",
          href: "/courses/servicenow-training-in-bangalore",
        },
        {
          label: "Microsoft Dynamics Training in Bangalore",
          href: "/courses/microsoft-dynamics-365-training-in-bangalore",
        },
        {
          label: "Agentic Ai and Generative Ai Training in Bangalore",
          href: "/courses/advanced-generative-ai-and-agentic-ai-training-in-bangalore",
        },
        {
         label: "SAP Training in Bangalore",
          href: "https://www.techpratham.com/courses/sap-certification-training",
        },
      ],
    },
    {
      title: "TRAINING IN PUNE",
      links: [
        {
          label: "Workday Training in Pune",
          href: "https://www.techpratham.com/courses/workday-training-in-pune",
        },
        {
          label: "ServiceNow Training in Pune",
          href: "https://www.techpratham.com/courses/servicenow-training-in-pune",
        },
        {
          label: "Guidewire Training in Pune",
          href: "/courses/guidewire-training-in-pune",
        },
        {
          label: "Agentic Ai Training  in Pune",
          href: "/courses/advanced-generative-ai-and-agentic-ai-training-in-pune",
        },
        {
          label: "SAP Training  in Pune",
          href: "/courses/sap-certification-training",
        },
      ],
    },
 {
  title: "TRAINING IN DELHI",
  links: [
    {
      label: "Workday Training in Delhi",
      href: "/courses/workday-training-in-delhi",
    },
    {
      label: "ServiceNow Training in Delhi",
      href: "/courses/servicenow-training-in-delhi",
    },
    {
      label: "Guidewire Training in Delhi",
      href: "/courses/guidewire-training-in-delhi",
    },
    {
      label: "Agentic Ai Training in DELHI",
      href: "/courses/master-in-agentic-ai",
    },
    {
      label: "SAP Training in Delhi",
      href: "/courses/sap-certification-training",
    },
    {
      label: "Open road Training in Delhi",
      href: "/courses/open-road-certification-training",
    },
    {
      label: "Caesar II Training in Delhi",
      href: "/courses/caesar-ii-certification-training",
    },
  ],
},
{
  title: "TRAINING IN NOIDA",
  links: [
    {
      label: "Workday Training in NOIDA",
      href: "/courses/workday-training-in-noida",
    },
    {
      label: "ServiceNow Training in NOIDA",
      href: "/courses/servicenow-training-in-noida",
    },
    {
      label: "Microsoft Dynamics Training in NOIDA",
      href: "/courses/microsoft-dynamics-training-in-noida",
    },
    {
      label: "Agentic Ai and Generative Ai Training in NOIDA",
      href: "/courses/advanced-generative-ai-and-agentic-ai-training-in-noida",
    },
    {
      label: "SAP Training in NOIDA",
      href: "/courses/sap-certification-training",
    },
    {
      label: "Open road Training in NOIDA",
      href: "/courses/open-road-certification-training",
    },
    {
      label: "Caesar II Training in NOIDA",
      href: "/courses/caesar-ii-certification-training",
    },
  ],
},
{
  title: "TRAINING IN HYDERABAD",
  links: [
    {
      label: "Workday Training in HYDERABAD",
      href: "/courses/workday-training-in-hyderabad",
    },
    {
      label: "Servicenow Training in HYDERABAD",
      href: "/courses/servicenow-online-training-in-hyderabad",
    },
    {
      label: "Microsoft Dynamics Training in HYDERABAD",
      href: "/courses/microsoft-dynamics-training-in-hyderabad",
    },
    {
      label: "Agentic Ai Training in HYDERABAD",
      href: "/courses/advanced-generative-ai-and-agentic-ai-training-in-hyderabad",
    },
    {
      label: "SAP Training in HYDERABAD",
      href: "/courses/sap-certification-training",
    },
    {
      label: "Guidewire Training in HYDERABAD",
      href: "/courses/guidewire-training-in-hyderabad",
    },
    {
      label: "Open road Training in HYDERABAD",
      href: "/courses/open-road-certification-training",
    },
    {
      label: "Caesar II Training in HYDERABAD",
      href: "/courses/caesar-ii-certification-training",
    },
  ],
},
{
  title: "TRAINING IN KOLKATA",
  links: [
    {
      label: "Workday Training in KOLKATA",
      href: "/courses/workday-training-in-kolkata",
    },
    {
      label: "Servicenow Training in KOLKATA",
      href: "/courses/servicenow-training-in-kolkata",
    },
    {
      label: "Microsoft Dynamics Training in KOLKATA",
      href: "/courses/microsoft-dynamics-365-training",
    },
    {
      label: "Agentic Ai Training in KOLKATA",
      href: "/courses/master-in-agentic-ai",
    },
    {
      label: "SAP Training in KOLKATA",
      href: "/courses/sap-certification-training",
    },
    {
      label: "Guidewire Training in KOLKATA",
      href: "/courses/guidewire-training-in-kolkata",
    },
    {
      label: "Open road Training in KOLKATA",
      href: "/courses/open-road-certification-training",
    },
    {
      label: "Caesar II Training in KOLKATA",
      href: "/courses/caesar-ii-certification-training",
    },
  ],
},
{
  title: "TRAINING IN Mumbai",
  links: [
    {
      label: "Workday Training in Mumbai",
      href: "/courses/best-workday-training-in-mumbai",
    },
    {
      label: "Servicenow Training in Mumbai",
      href: "/courses/servicenow-training-in-mumbai",
    },
    {
      label: "Microsoft Dynamics Training in Mumbai",
      href: "/courses/microsoft-dynamics-365-training-in-mumbai",
    },
    {
      label: "Agentic Ai Training in Mumbai",
      href: "/courses/advanced-generative-ai-and-agentic-ai-training-in-mumbai",
    },
    {
      label: "SAP Training in Mumbai",
      href: "/courses/sap-certification-training",
    },
    {
      label: "Guidewire Training in Mumbai",
      href: "/courses/guidewire-training-in-mumbai",
    },
    {
      label: "Open road Training in Mumbai",
      href: "/courses/open-road-certification-training",
    },
    {
      label: "Caesar II Training in Mumbai",
      href: "/courses/caesar-ii-certification-training",
    },
  ],
}
  ];



  return (
    <div className="bg-black rounded-xl overflow-hidden mt-8">

      {/* Header */}
      <div
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center px-6 py-2 cursor-pointer bg-black"
      >
        <h3 className="text-white text-sm font-medium">
          SEO Other Pages Links
        </h3>

        {open ? (
          <ChevronUp className="text-white" />
        ) : (
          <ChevronDown className="text-white" />
        )}
      </div>

      {/* Body */}
      {open && (
        <div className="bg-gray-200 px-6 py-3 text-gray-800 space-y-6">
          {sections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold text-base mb-2">
                {section.title}
              </h4>

              <div className="flex flex-wrap text-sm leading-7">
                {section.links.map((link, i) => (
                  <span key={i}>
                    <Link
                      href={link.href}
                      className="hover:underline"
                    >
                      {link.label}
                    </Link>

                    {i !== section.links.length - 1 && (
                      <span className="mx-2">|</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeoDropdown;