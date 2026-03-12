import React from 'react';
import './testimonial.css';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Autoplay } from 'swiper/modules';
import { Clock } from 'lucide-react';

const TestimonialSection = ({ course }: any) => {

  const renderStars = (rating: any) => {
    return "★ ".repeat(rating);
  };

  return (
    <div className='w-full h-auto flex flex-col items-center justify-center py-20 gap-10 bg-[#f7f7f7] text-black overflow-hidden'>
      <div className='md:w-10/12 w-11/12 h-auto flex flex-col gap-2 items-center text-center'>
        <div className="md:text-3xl text-2xl md:font-semibold font-medium capitalize">Our Testimonials</div>
      </div>
      <div className='md:w-10/12 w-11/12 flex flex-col items-center justify-center h-auto'>
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          loop={true}
          modules={[Autoplay]}
          className="mySwiper testimonialStyle"
        >
          {testimonialsData.map((testimonial) => (
            <SwiperSlide key={testimonial.id} className="group w-auto h-auto flex flex-col gap-4 bg-white rounded-2xl p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2 hover:scale-105 border border-gray-100 relative overflow-hidden cursor-pointer">
              {/* Gradient Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Header Section */}
              <div className="w-full flex flex-row items-center justify-start gap-3 relative z-10">
                <div className={`w-14 h-14 bg-gradient-to-br from-[#283256] to-[#1a1f3a] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  {testimonial.avatar}
                </div>
                <div className="flex flex-col text-left flex-1">
                  <div className="font-bold text-gray-800 text-lg group-hover:text-[#283256] transition-colors duration-300">{testimonial.name}</div>
                  <div className="text-gray-500 text-sm flex items-center justify-start gap-1">
                    <Clock className='w-4 h-4' />
                    {testimonial.date}
                  </div>
                </div>
                {/* Verified Badge */}
                <div className="flex items-center justify-center w-6 h-6 bg-green-500 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Rating Section */}
              <div className="w-full flex items-center justify-between relative z-10">
                <div className="flex items-center gap-1">
                  <span className='text-yellow-400 text-xl group-hover:text-yellow-500 transition-colors duration-300'>{renderStars(testimonial.rating)}</span>
                  <span className="text-gray-600 text-sm ml-1">({testimonial.rating}/5)</span>
                </div>
                <div className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                  Google Review
                </div>
              </div>

              {/* Quote Icon */}
              <div className="absolute top-4 right-4 text-gray-200 group-hover:text-gray-300 transition-colors duration-300 z-0">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35l.539-.222.474-.197-.485-1.938-.597.144c-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.318.142-.686.238-1.028.466-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.945-.33.358-.656.734-.909 1.162-.293.408-.492.856-.702 1.299-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539l.025.168.026-.006A4.5 4.5 0 1 0 6.5 10zm11 0c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35l.539-.222.474-.197-.485-1.938-.597.144c-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.318.142-.686.238-1.028.466-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.945-.33.358-.656.734-.909 1.162-.293.408-.492.856-.702 1.299-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539l.025.168.026-.006A4.5 4.5 0 1 0 17.5 10z" />
                </svg>
              </div>

              {/* Testimonial Text */}
              <div className="text-gray-700 flex-1 leading-relaxed text-base text-left relative z-10 group-hover:text-gray-800 transition-colors duration-300 font-medium">
                "{testimonial.testimonial}"
              </div>

              {/* Bottom Accent Line */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#283256] via-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default TestimonialSection

const testimonialsData = [
  {
    id: 1,
    name: "Khyati Sharma",
    date: "2 months ago",
    rating: 5,
    verified: true,
    testimonial: "I had a great experience learning at Tech Pratham. The courses were well-structured, up-to-date with the latest industry standards, and the instructors were extremely knowledgeable and supportive throughout my journey. Thanks to Tech Pratham, I was able to build a strong foundation in my technical skills!",
    avatar: "K",
    avatarColor: "bg-blue-500"
  },
  {
    id: 2,
    name: "Ritika",
    date: "2 months ago",
    rating: 5,
    verified: true,
    testimonial: "My experience with Tech Pratham Institute has been excellent. The course content is well-updated according to industry standards, with a strong focus on practical learning. The faculty members are knowledgeable and very supportive, always clearing doubts with patience.",
    avatar: "R",
    avatarColor: "bg-green-500"
  },
  {
    id: 3,
    name: "Ivan Silvester",
    date: "2 months ago",
    rating: 5,
    verified: true,
    testimonial: "As a student diving into the world of technology, discovering Tech Pratham has been a total game-changer for me. The way they break down complex topics into simple, easy-to-understand lessons is incredibly helpful, especially for someone who's just starting out.",
    avatar: "I",
    avatarColor: "bg-purple-500"
  },
  {
    id: 4,
    name: "Shubham Sinha",
    date: "2 months ago",
    rating: 5,
    verified: true,
    testimonial: "I enrolled in the AWS Certification Program at Tech Pratham, and it was one of the best decisions for my career. The training was completely hands-on with real-time projects, and the instructors explained even complex cloud concepts in a very simple and practical way.",
    avatar: "S",
    avatarColor: "bg-red-500"
  },
  {
    id: 5,
    name: "Neha Singh",
    date: "2 months ago",
    rating: 5,
    verified: true,
    testimonial: "I joined Tech Pratham for the Workday Consultant Program 5 months ago. From day one till the completion of the course, I received full support from all the faculty members. Thanks to Tech Pratham, I have now successfully got placed and started my professional journey.",
    avatar: "N",
    avatarColor: "bg-indigo-500"
  },
  {
    id: 6,
    name: "Chauhan Deco",
    date: "3 weeks ago",
    rating: 5,
    verified: true,
    testimonial: "I had an excellent experience with Tech Pratham's data analytics training program. The course content was well-structured, up-to-date, and highly practical, covering tools like Excel, SQL, Python, and Power BI. Thanks to Tech Pratham, I now feel confident in my data analytics skills and have even landed my first job in the field.",
    avatar: "C",
    avatarColor: "bg-orange-500"
  },
  {
    id: 7,
    name: "Dimpy",
    date: "2 months ago",
    rating: 5,
    verified: true,
    testimonial: "Joining Tech Pratham Institute has been a life-changing decision for me. The support and encouragement I received from the faculty gave me the confidence to believe in myself. The environment here feels more like a family than just a classroom.",
    avatar: "D",
    avatarColor: "bg-pink-500"
  },
  {
    id: 8,
    name: "Amarjeet Kumar",
    date: "2 months ago",
    rating: 5,
    verified: true,
    testimonial: "I joined Tech Pratham's SAP HCM course and it was a fantastic experience! The trainers explained complex HR modules in a very simple way, and the hands-on sessions helped me build real skills. Highly recommended for anyone looking to build a career in SAP HCM!",
    avatar: "A",
    avatarColor: "bg-teal-500"
  },
  {
    id: 9,
    name: "Shashi Ranjan",
    date: "2 months ago",
    rating: 5,
    verified: true,
    testimonial: "I had a wonderful learning experience with the Workday HCM course at Tech Pratham under Roy Sir's guidance. His teaching style is very clear, practical, and easy to understand even for beginners. The real-time examples and assignments made concepts crystal clear.",
    avatar: "S",
    avatarColor: "bg-cyan-500"
  },
  {
    id: 10,
    name: "Akash Solanki",
    date: "2 months ago",
    rating: 5,
    verified: true,
    testimonial: "My experience with the Ethical Hacking training session from Tech Pratham located in Noida was excellent. The trainers ensured we understood every concept thoroughly. The placement support was remarkable, leading to my successful employment. Choosing Tech Pratham was a life-changing decision for me.",
    avatar: "A",
    avatarColor: "bg-yellow-500"
  },
  {
    id: 11,
    name: "Ajay Kumar Verma",
    date: "2 months ago",
    rating: 5,
    verified: true,
    testimonial: "I enrolled in the Data Analytics & Generative AI course at Tech Pratham and had a great learning experience. The curriculum is industry-relevant, and the trainers explain concepts clearly. The practical projects and tools like Python, SQL, Power BI, and AI models were especially helpful.",
    avatar: "A",
    avatarColor: "bg-emerald-500"
  },
  {
    id: 12,
    name: "Shivshankar Singh",
    date: "2 months ago",
    rating: 4,
    verified: true,
    testimonial: "I had a decent experience with Tech Pratham. The course content was strong, but there were a few delays in project support and doubt sessions. Faculty was knowledgeable, though response time could be improved. Overall, a good place to learn if you're patient and proactive.",
    avatar: "S",
    avatarColor: "bg-slate-500"
  },
  {
    id: 13,
    name: "Laxman Thakur",
    date: "2 months ago",
    rating: 5,
    verified: true,
    testimonial: "I recently completed the Workday certification from Tech Pratham, and I must say it's one of the best IT training institutes in India. The trainers were industry experts, and the content was up-to-date. Highly recommend it for anyone serious about their tech career!",
    avatar: "L",
    avatarColor: "bg-violet-500"
  },
  {
    id: 14,
    name: "S Vall",
    date: "2 months ago",
    rating: 5,
    verified: true,
    testimonial: "The sessions were very well-structured, covering both the functional and technical aspects in a clear and practical way. The trainer was incredibly knowledgeable, patient, and always willing to answer questions with real-world examples. The hands-on exercises helped me build confidence in navigating Workday.",
    avatar: "S",
    avatarColor: "bg-rose-500"
  },
  {
    id: 15,
    name: "Abdur Razzak Shaikh",
    date: "2 months ago",
    rating: 5,
    verified: true,
    testimonial: "I joined TechPratham three months ago for the Odoo ERP course, and my experience so far has been excellent. The faculty is highly knowledgeable and supportive. They focus on practical learning by providing real-time projects, which has really helped me understand industry requirements.",
    avatar: "A",
    avatarColor: "bg-amber-500"
  },
  {
    id: 16,
    name: "Panchsheel Gautam",
    date: "a month ago",
    rating: 5,
    verified: true,
    testimonial: "Tech Pratham is very well planned and organised. The staff takes keen interest in parting the knowledge. Also the staff very hardworking and meticulous. I have gained a lot from tech Pratham. I wish all the luck to the tech Pratham for their good work.",
    avatar: "P",
    avatarColor: "bg-lime-500"
  }
];