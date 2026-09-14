"use client";

import React, { useEffect, useState, useContext } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
// Old navbar kept as backup, uncomment to roll back:

// import Navbar from "@/src/common/Navbar/Navbar";

import Navbar from '@/src/common/Navbar/Navbar'; // Navbar2 only on home page
import FooterSm from "@/src/common/Footer/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2 } from "lucide-react";
import { UserContext } from "@/context/userContext";
import type { NextPage, GetServerSideProps } from 'next';
import { NavbarData } from '@/utils/navbarData';
import { withNavbarSSR } from '@/utils/withNavbarSSR';
import PhoneInput from "@/components/common/PhoneInput/PhoneInput";

interface Course {
  title: string;
  shortDesc: string;
  duration: string;
  level: string;
  category: string;
  link: string;
}

interface EnrollForm {
  name: string;
  email: string;
  phone: string;
}

interface CourseEnrollPageProps {
  navbarData: NavbarData;
}

const CourseEnrollPage: NextPage<CourseEnrollPageProps> = ({ navbarData }) => {
  const router = useRouter();
  const { coursedata } = router.query;
  const { userData } = useContext(UserContext);

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(userData?.phone || "");
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm<EnrollForm>({
    defaultValues: {
      name: userData?.name || "",
      email: userData?.email || "",
      phone: userData?.phone || "",
    },
  });

  /* ---------------- FETCH COURSE ---------------- */
  useEffect(() => {
    if (!coursedata || typeof coursedata !== "string") return;

    const fetchCourse = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/course/link?link=${encodeURIComponent(coursedata)}`
        );
        if (!res.ok) throw new Error("Failed to load course");
        const data = await res.json();
        setCourse(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [coursedata]);

  /* ---------------- SUBMIT LEAD ---------------- */
  const onSubmit = async (data: EnrollForm) => {
    // Prevent submission if phone is invalid
    if (!isPhoneValid) {
      return;
    }

    if (!course) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "course_enrollment",
          fullName: data.name,
          email: data.email,
          phone: phoneNumber,
          course: course.title,
          // message: course.shortDesc,
          courseLink: course.link,
          duration: course.duration,
          level: course.level,
          category: course.category,
        }),
      });

      if (!response.ok) {
        throw new Error("Lead submission failed");
      }

      reset();
      setPhoneNumber("");
      setIsPhoneValid(false);
      setShowSuccess(true);
      if (typeof window !== "undefined") {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          event: "google_ads_conversion",
          
          conversion_id: "17462500412",
          conversion_label: "K_E4CNSPy-0bELy44oZB",
        });
      }
    } catch (error) {
      console.error("Enrollment failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar navbarData={navbarData} />
        <div className="h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-red-700" />
        </div>
        <FooterSm />
      </>
    );
  }

  if (!course) return null;

  return (
    <>
      <Head>
        <title>Enroll | {course.title}</title>
      </Head>

      <Navbar navbarData={navbarData} />

      <div className="bg-gradient-to-tl from-[#C6151D] to-[#600A0E] py-16">
        <div className="w-11/12 md:w-10/12 mx-auto grid md:grid-cols-2 gap-10">

          {/* COURSE INFO */}
          <div className="text-yellow-500">
            <h1
              className="text-3xl mb-4"
              dangerouslySetInnerHTML={{ __html: course.title }}
            />
            <div
              className="text-gray-200"
              dangerouslySetInnerHTML={{ __html: course.shortDesc }}
            />
          </div>

          {/* FORM */}
          <Card>
            <CardHeader>
              <CardTitle>Enroll Now</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label>Full Name</Label>
                  <Input {...register("name")} required />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input type="email" {...register("email")} required />
                </div>

                <div>
                  <Label>Phone</Label>
                  <PhoneInput
                    value={phoneNumber}
                    onChange={(phone) => {
                      setPhoneNumber(phone);
                      setValue('phone', phone);
                    }}
                    onValidationChange={setIsPhoneValid}
                    placeholder="Enter phone number"
                    required
                    size="md"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-red-700"
                  disabled={submitting || !isPhoneValid}
                >
                  {submitting ? "Submitting..." : "Enroll Now"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ✅ SUCCESS POPUP */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-11/12 p-8 text-center animate-in fade-in zoom-in">
            <CheckCircle2 className="mx-auto text-green-600 w-14 h-14 mb-4" />

            <h2 className="text-2xl font-bold mb-2">
              🎉 Enrollment Successful!
            </h2>

            <p className="text-gray-600 mb-6">
              Congratulations! You are successfully enrolled.
              <br />
              One of our trainers will call you shortly.
            </p>

            <Button
              className="bg-red-700 w-full"
              onClick={() => setShowSuccess(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      <FooterSm />
    </>
  );
};

export default CourseEnrollPage;

// Add navbar SSR
export const getServerSideProps = withNavbarSSR();
