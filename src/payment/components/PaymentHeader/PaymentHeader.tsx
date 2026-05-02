// import React from 'react';

// const PaymentHeader = () => {
//   return (
//     <div className="w-full h-[400px] relative overflow-hidden flex items-center">

//       {/* Background Layers */}
//       <div className="absolute inset-0 bg-gradient-to-br from-red-700 via-black to-red-900"></div>

//       <div className="absolute w-[400px] h-[400px] bg-red-600 opacity-40 blur-[120px] top-[-100px] left-[-100px]"></div>

//       <div className="absolute w-[300px] h-[300px] bg-red-500 opacity-30 blur-[100px] bottom-[-50px] right-[-50px]"></div>

//       <div className="absolute w-[250px] h-[250px] bg-black opacity-60 blur-[80px] top-[50%] left-[40%]"></div>

//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,0,0,0.2),transparent_60%),radial-gradient(circle_at_70%_60%,rgba(0,0,0,0.5),transparent_70%)]"></div>

//       {/* Content Container */}
//       <div className="relative z-10 w-full flex items-center">

//         {/* LEFT SIDE TEXT */}
//         <div className="md:w-1/2 w-full md:pl-16 pl-5 opacity-90">

//           <h1 className="text-4xl sm:text-6xl font-bold mb-4 text-white border-b-[3px] border-white inline-block">
//             Secure Payments...
//           </h1>

//           <p className="text-red-100 mb-8 max-w-lg leading-relaxed">
//             Experience fast, secure, and seamless transactions with our trusted payment system. 
//             Your data stays protected while delivering a smooth and reliable checkout experience.
//           </p>

//           <div className="flex items-center gap-4">

//             <button className="bg-white text-black px-5 py-2 rounded-md font-medium hover:opacity-90 transition">
//               Pay Now
//             </button>

//             <button className="border border-white text-white px-5 py-2 rounded-md hover:bg-white hover:text-black transition">
//               Learn More
//             </button>

//           </div>

//         </div>

//         {/* RIGHT SIDE (optional empty for now) */}
//         <div className="md:w-1/2 hidden md:block"></div>

//       </div>

//     </div>
//   );
// };

// export default PaymentHeader;


// import React from 'react';

// const PaymentHeader = () => {
//   return (
//     <div className="w-full h-[400px] relative overflow-hidden flex items-center">

//       {/* Background */}
//       <div className="absolute inset-0 bg-gradient-to-br from-red-700 via-black to-red-900"></div>

//       {/* Glow Effects */}
//       <div className="absolute w-[400px] h-[400px] bg-red-600 opacity-40 blur-[120px] top-[-100px] left-[-100px]"></div>
//       <div className="absolute w-[300px] h-[300px] bg-red-500 opacity-30 blur-[100px] bottom-[-50px] right-[-50px]"></div>

//       {/* Content */}
//       <div className="relative z-10 w-full flex items-center">

//         {/* LEFT TEXT */}
//         <div className="md:w-1/2 w-full md:pl-16 pl-5 opacity-90">

//           <h1 className="text-4xl sm:text-6xl font-bold mb-4 text-white border-b-[3px] border-white inline-block">
//             Secure Payments...
//           </h1>

//           <p className="text-red-100 mb-8 max-w-lg leading-relaxed">
//             Experience fast, secure, and seamless transactions with our trusted payment system. 
//             Your data stays protected while delivering a smooth checkout experience.
//           </p>

//           <div className="flex items-center gap-4">
//             <button className="bg-white text-black px-5 py-2 rounded-md font-medium hover:opacity-90 transition">
//               Pay Now
//             </button>


//           </div>

//         </div>

//         {/* RIGHT SIDE IMAGE */}
//         <div className="md:w-1/2 hidden md:block relative items-center justify-center  h-[400px]">

//           {/* ATM Image */}
//           <div
//             className="absolute  h-[300px]  inset-0 bg-contain mt-20 bg-no-repeat bg-center"
//             style={{ backgroundImage: "url('/header/atm.webp')" }}
//           ></div>

//           {/* Overlay */}
//           <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-red-900/40 to-transparent"></div>

//         </div>

//       </div>

//     </div>
//   );
// };

// export default PaymentHeader;

import React from 'react';

const PaymentHeader = () => {
  const scrollToPaymentSection = () => {
    const paymentSection = document.getElementById('payment-section');
    if (paymentSection) {
      const offsetTop = paymentSection.offsetTop - 20; // 20px offset from top
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full h-[400px] relative overflow-hidden flex items-center">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-red-900 to-red-600 z-5"></div>

      {/* Glow Effects */}
      {/* <div className="absolute w-[400px] h-[400px] bg-red-600 opacity-40 blur-[120px] top-[-100px] left-[-100px]"></div> */}
      {/* <div className="absolute w-[300px] h-[300px] bg-red-500 opacity-30 blur-[100px] bottom-[-50px] right-[-50px]"></div> */}

      {/* Content */}
      <div className="relative z-10 w-full flex items-center">

        {/* LEFT TEXT */}
        <div className="md:w-1/2 w-full md:pl-16 pl-5 md:mt-20 opacity-90">

          <h1 className="text-3xl sm:text-5xl font-bold mb-4 text-white border-b-[3px] border-white inline-block">
            Payment Gateway..
          </h1>

          <p className="text-red-100 mb-8 max-w-lg leading-relaxed">
            Experience fast, secure, and seamless transactions with our trusted payment system.
            Your data stays protected while delivering a smooth checkout experience.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToPaymentSection}
              className="flex items-center gap-3 text-2xl border border-black text-white px-10 py-1 rounded-md font-bold transition shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
              style={{
                background: "linear-gradient(120deg, #7f1d1d, #ef4444, #b91c1c, #7f1d1d)",
                backgroundSize: "200% 200%",
                animation: "bgMove 6s ease-in-out infinite"
              }}
            >
              Pay Now

              {/* Moving Arrows */}
              <span className="flex">
                <span className="arrow text-5xl text-white">›</span>
                <span className="arrow text-5xl text-white">›</span>
                <span className="arrow text-5xl text-white">›</span>
              </span>
            </button>

            {/* Animations */}
            <style>
              {`
      @keyframes bgMove {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      .arrow {
        animation: moveArrow 1.5s linear infinite;
      }

      .arrow:nth-child(1) { animation-delay: 0s; }
      .arrow:nth-child(2) { animation-delay: 0.2s; }
      .arrow:nth-child(3) { animation-delay: 0.4s; }

      @keyframes moveArrow {
        0% {
          transform: translateX(0);
          opacity: 0.3;
        }
        50% {
          transform: translateX(8px);
          opacity: 1;
        }
        100% {
          transform: translateX(16px);
          opacity: 0.3;
        }
      }
    `}
            </style>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="md:w-1/2 hidden md:flex items-center  justify-center relative h-[400px] z-20">

          {/* Center Bank Logo */}
          <div className="w-36 h-36 rounded-full bg-gradient-to-br from-white  to-black flex items-center justify-center z-10 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            <img src="/header/bank.png" alt="Bank" className="w-36 h-36 object-contain" />
          </div>

          {/* Circular Logos */}

          {/* Top */}
          <img src="/header/upi.png" className="absolute top-[30px]  w-20" />

          {/* Bottom */}
          <img src="/header/payu.png" className="absolute bottom-[10px] w-40" />

          {/* Left */}
          <img src="/header/paytem.png" className="absolute left-[80px]  w-20" />

          {/* Right */}
          <img src="/header/visa.png" className="absolute right-[90px] w-20" />
          <img src="/header/phonepay.png" className="absolute bottom-[50px]  rounded-lg left-[100px] w-28" />

          {/* GPay - Right Bottom */}
          <img src="/header/gpay.png" className="absolute bottom-[60px] right-[90px] w-40" />
          {/* Top Left */}
          <img src="/header/mastercard.png" className="absolute top-[90px] left-[120px] w-20" />

          {/* Top Right */}
          <img src="/header/amazonpay.png" className="absolute top-[90px] right-[120px] bg-white rounded-lg w-16" />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-transparent to-transparent"></div>

        </div>

      </div>

      {/* Contact Information - Bottom Center */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-20">
        <div className="px-1  ">
          <div className="text-center">
            <h3 className="text-white font-semibold md:mb-2 text-sm inline-block border-b-2 border-white">
              Payment Support Contact
            </h3>
            <div className="flex items-center justify-center gap-3 text-red-100 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-red-300">📧</span>
                <a href="mailto:payment@techpratham.com" className="hover:text-white transition-colors">
                  info@techpratham.com
                </a>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-red-300">📱</span>
                <a href="tel:+919876543210" className="hover:text-white transition-colors">
                  +918882178896
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PaymentHeader;
