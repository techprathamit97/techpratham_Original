"use client";

import { MapPin, Phone, Mail } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import PhoneInput from "@/components/common/PhoneInput/PhoneInput";

export default function ContactLayout() {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  const onSubmit = async (data: any) => {
    // Prevent submission if phone is invalid
    if (!isPhoneValid) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          phone: phoneNumber,
          formType: "Home-contact-form",
        }),
      });
      if (response.ok) {
        setSubmitSuccess(true);
        console.log(data);
        reset();
        setPhoneNumber('');
        setIsPhoneValid(false);
      } else {
        console.error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ================= LEFT : FORM ================= */}
        <div className="rounded-2xl border border-black/10 bg-gradient-to-tl from-[#CA8A04]/60 to-[#600A0E] p-8 shadow-sm">
          <h2 className="text-2xl text-white font-semibold mb-6">
            Get in Touch
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <input
              {...register("fullName")}
              type="text"
              placeholder="Full Name"
              required
              className="w-full rounded-lg border border-black/10 p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              {...register("email")}
              type="email"
              placeholder="Email Address"
              required
              className="w-full rounded-lg border border-black/10 p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <PhoneInput
              value={phoneNumber}
              onChange={(phone) => {
                setPhoneNumber(phone);
                setValue('phone', phone);
              }}
              onValidationChange={setIsPhoneValid}
              placeholder="Phone Number"
              required
              size="md"
            />

            <input
              {...register("course")}
              type="text"
              placeholder="Course"
              required
              className="w-full rounded-lg border border-black/10 p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <textarea
              {...register("message")}
              placeholder="Your Message"
              rows={3}
              required
              className="w-full rounded-lg border border-black/10 p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <button
              type="submit"
              disabled={submitting || !isPhoneValid}
              className="w-full bg-gradient-to-tl from-[#C6151D] to-[#600A0E] text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>

            {submitSuccess && (
              <p className="text-green-600 text-sm">
                Form submitted successfully! We’ll reach you soon!
              </p>
            )}
          </form>

        </div>

        {/* ================= MIDDLE : HEAD OFFICE ================= */}
        <div className="rounded-2xl border border-black/10 bg-gradient-to-tl from-[#600A0E] to-[#CA8A04]/60 p-8 shadow-sm space-y-2">

          <h3 className="text-lg font-semibold text-white">
            Head Office
          </h3>

          <div className="space-y-1 text-sm text-neutral-200">
            <div className="flex gap-2">
              <MapPin size={16} />
              <p>
                G-31, 1st Floor Sector-3, Noida 201301
              </p>
            </div>

            <div className="flex gap-2 items-center">
              <img src="/course/icons/indian.jpg" alt="India Flag" className="w-4 h-4" />
              <p>+91-8882178896</p>
            </div>

            <div className="flex gap-2 items-center">
              <img src="/course/icons/uslogo.png" alt="US Flag" className="w-4 h-4" />
              <p>+1 (343) 477-0926</p>
            </div>

            <div className="flex gap-2">
              <Mail size={16} />
              <p>info@techpratham.com</p>
            </div>
          </div>

          {/* GOOGLE REVIEW EMBED */}
          <div className="w-full rounded-xl overflow-hidden border border-black/10 shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.3411553219557!2d77.31188957409235!3d28.58954058603429!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa97ac4f966921295%3A0x9a2c52d55632577d!2sTechPratham%20Training%20%26%20Development%20(P)%20Ltd.!5e0!3m2!1sen!2sin!4v1768045860943!5m2!1sen!2sin"
              width="100%"
              height="280"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>


        </div>


        {/* ================= RIGHT : TWO LOCATIONS ================= */}
        <div className="grid grid-rows-2 gap-2">

          {/* NOIDA */}
          <LocationCard
            title="Noida Office"
            address="C-2, Sector-1, Noida, Uttar Pradesh - 201301"
            phone="+91-8882178896"
          />

          {/* HYDERABAD */}
          <LocationCard
            title="Hyderabad Office"
            address="LVS Arcade, 71, Hitech, 6th floor ,
Madhapur Road, Jubilee Enclave,
HITEC City, Hyderabad"
            phone="+91-8383058741"
          />
        </div>

      </div>
    </div>
  );
}

/* ================= LOCATION CARD ================= */

function LocationCard({
  title,
  address,
  phone,
}: {
  title: string;
  address: string;
  phone: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-gradient-to-tl from-[#CA8A04]/60 to-[#600A0E] p-6 shadow-sm flex flex-col justify-between">
      <div>
        <h4 className="font-semibold text-white text-base mb-2">
          {title}
        </h4>

        <div className="text-sm text-white space-y-1">
          <div className="flex gap-2">
            <MapPin size={16} />
            <p>{address}</p>
          </div>
          <div className="flex gap-2">
            <Phone size={16} />
            <p>{phone}</p>
          </div>
          <div className="flex gap-1">
            <Mail size={16} />
            <p>info@techpratham.com</p>
          </div>
        </div>
      </div>

      <a
        href="https://wa.me/918882178896"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-1 rounded-lg bg-green-100 text-green-700 py-2 px-4 text-sm font-medium hover:bg-green-200 transition"
      >
        Chat on WhatsApp
      </a>
    </div>
  );
}





