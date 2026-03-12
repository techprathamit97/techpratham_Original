// import React from 'react';
// import { Separator } from '@/components/ui/separator';
// import FormContact from '../FormContact/FormContact';
// import Image from 'next/image';
// import Link from 'next/link';

// const AddressContact = () => {
//     return (
//         <div className='md:w-10/12 w-11/12 h-auto grid md:grid-cols-2 grid-cols-1 gap-10 place-content-center'>
//             <div className='col-span-1 w-full h-auto flex flex-col gap-5 py-16 z-10 text-left'>
//                 <div className='w-full h-auto flex flex-col items-start justify-center'>
//                     <div className='text-2xl font-semibold border-b-2 border-b-[#C6151D] text-[#C6151D]'>Reach us</div>
//                 </div>
//                 <div
//                     className='p-[3px] shadow flex items-center justify-center w-full h-auto rounded-xl bg-gradient-to-tl'
//                     style={{
//                         backgroundImage: 'linear-gradient(to top left, #ff0000, #ff9900, #33cc33, #3399ff, #9900cc, #ff3399)'
//                     }}
//                 >
//                     <div className='row-span-1 w-full h-full flex flex-col p-4 rounded-lg bg-[#eee] relative'>
//                         <div className='pb-4 font-semibold md:text-xl text-base'>Registered Office</div>
//                         <Separator className='bg-black h-[0.5px]' />
//                         <div className='flex flex-col gap-3 pt-4'>
//                             <div className='font-semibold'>G-31, 1st Floor Sector-3, Noida 201301</div>
//                             <div>info@techpratham.com</div>
//                         </div>
//                         <div className='w-full flex flex-row justify-end gap-3 mt-4'>
//                             <Link href='https://wa.me/+918882178896' className='w-auto flex flex-row gap-2 items-center justify-center bg-white p-1 rounded-md'>
//                                 <Image src='/support/whatsapp.png' alt='' width={40} height={40} />
//                                 <div className='w-auto flex flex-col text-sm'>
//                                     <div>Whatsapp</div>
//                                     <div>Click to Chat</div>
//                                 </div>
//                             </Link>
//                             <Link href='https://g.page/r/CX1XMlbVUiyaEBM/review' className='w-auto flex flex-row gap-2 bg-white p-1 rounded-md'>
//                                 <Image src='/support/google-maps.png' alt='' width={40} height={40} />
//                                 <div className='w-auto flex flex-col text-sm'>
//                                     <span>Check Live</span>
//                                     <span>Location Here</span>
//                                 </div>
//                             </Link>
//                         </div>
//                     </div>
//                 </div>
//                 <div
//                     className='p-[3px] shadow flex items-center justify-center w-full h-auto rounded-xl bg-gradient-to-tl'
//                     style={{
//                         backgroundImage: 'linear-gradient(to top left, #ff0000, #ff9900, #33cc33, #3399ff, #9900cc, #ff3399)'
//                     }}
//                 >
//                     <div className='row-span-1 w-full h-full flex flex-col p-4 rounded-lg bg-[#eee] relative'>
//                         <div className='pb-4 font-semibold md:text-xl text-base'>Noida Office</div>
//                         <Separator className='bg-black h-[0.5px]' />
//                         <div className='flex flex-col gap-3 pt-4'>
//                             <div className='font-semibold'>C-2, Sector-1, Noida, Uttar Pradesh - 201301</div>
//                             <div>+91-8882178896, info@techpratham.com</div>
//                         </div>
//                         <div className='w-full flex flex-row justify-end gap-3 mt-4'>
//                             <Link href='https://wa.me/+918882178896' className='w-auto flex flex-row gap-2 items-center justify-center bg-white p-1 rounded-md'>
//                                 <Image src='/support/whatsapp.png' alt='' width={40} height={40} />
//                                 <div className='w-auto flex flex-col text-sm'>
//                                     <div>Whatsapp</div>
//                                     <div>Click to Chat</div>
//                                 </div>
//                             </Link>
//                             <Link href='https://g.page/r/CX1XMlbVUiyaEBM/review' className='w-auto flex flex-row gap-2 bg-white p-1 rounded-md'>
//                                 <Image src='/support/google-maps.png' alt='' width={40} height={40} />
//                                 <div className='w-auto flex flex-col text-sm'>
//                                     <span>Check Live</span>
//                                     <span>Location Here</span>
//                                 </div>
//                             </Link>
//                         </div>
//                     </div>
//                 </div>
//                 <div
//                     className='p-[3px] shadow flex items-center justify-center w-full h-auto rounded-xl bg-gradient-to-tl'
//                     style={{
//                         backgroundImage: 'linear-gradient(to top left, #ff0000, #ff9900, #33cc33, #3399ff, #9900cc, #ff3399)'
//                     }}
//                 >
//                     <div className='row-span-1 w-full h-full flex flex-col p-4 rounded-lg bg-[#eee] relative'>
//                         <div className='pb-4 font-semibold md:text-xl text-base'>Hyderabad Office</div>
//                         <Separator className='bg-black h-[0.5px]' />
//                         <div className='flex flex-col gap-3 pt-4'>
//                             <div className='font-semibold'>LVS Arcade, 71, Hitech, 6th floor , Madhapur Road, Jubilee Enclave, HITEC City, Hyderabad</div>
//                             <div>+91-8383058741,   info@techpratham.com</div>
//                         </div>
//                         <div className='w-full flex flex-row justify-end gap-3 mt-4'>
//                             <Link href='https://wa.me/+918882178896' className='w-auto flex flex-row gap-2 items-center justify-center bg-white p-1 rounded-md'>
//                                 <Image src='/support/whatsapp.png' alt='' width={40} height={40} />
//                                 <div className='w-auto flex flex-col text-sm'>
//                                     <div>Whatsapp</div>
//                                     <div>Click to Chat</div>
//                                 </div>
//                             </Link>
//                             <Link href='https://g.page/r/CX1XMlbVUiyaEBM/review' className='w-auto flex flex-row gap-2 bg-white p-1 rounded-md'>
//                                 <Image src='/support/google-maps.png' alt='' width={40} height={40} />
//                                 <div className='w-auto flex flex-col text-sm'>
//                                     <span>Check Live</span>
//                                     <span>Location Here</span>
//                                 </div>
//                             </Link>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div className='col-span-1 w-full h-auto py-16 flex flex-col gap-5 items-center justify-center md:-mt-40 -mt-32'>
//                 <FormContact />
//                 <div className='p-[3px] shadow flex items-center justify-center w-auto h-auto rounded-xl bg-gradient-to-tl from-[#600A0E] to-[#C6151D] mt-4'>
//                     <div className='row-span-1 w-64 h-auto flex flex-col gap-3 p-4 rounded-lg relative'>
//                         <Image src='/support/qr-contact.svg' alt='' width={80} height={80} className='w-56 h-56 bg-white p-2' />
//                         <div className='px-4 py-1 rounded-full bg-white text-black font-medium shadow text-center'>Post Your Feedback</div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default AddressContact



import React from 'react';
import { Separator } from '@/components/ui/separator';
import FormContact from '../FormContact/FormContact';
import Image from 'next/image';
import Link from 'next/link';

const AddressContact = () => {
    return (
        <div className='md:w-10/12 w-11/12 h-auto grid md:grid-cols-2 grid-cols-1 gap-10 place-content-center'>
            <div className='col-span-1 w-full h-auto flex flex-col gap-5 py-16 z-10 text-left'>
                <div className='w-full h-auto flex flex-col items-start justify-center'>
                    <div className='text-2xl font-semibold border-b-2 border-b-[#C6151D] text-[#C6151D]'>Reach us</div>
                </div>

                {/* Registered Office */}
                <div className='p-[3px] shadow flex items-center justify-center w-full h-auto rounded-xl bg-gradient-to-tl'
                    style={{ backgroundImage: 'linear-gradient(to top left, #ff0000, #ff9900, #33cc33, #3399ff, #9900cc, #ff3399)' }}>
                    <div className='row-span-1 w-full h-full flex flex-col p-4 rounded-lg bg-[#eee] relative'>
                        <div className='pb-4 font-semibold md:text-xl text-base'>Registered Office</div>
                        <Separator className='bg-black h-[0.5px]' />
                        <div className='flex flex-col gap-3 pt-4'>
                            <div className='font-semibold'>G-31, 1st Floor Sector-3, Noida 201301</div>
                            <div className='flex flex-wrap gap-3 items-center'>
                                <span className='flex items-center gap-1'>
                                    <Image src="/course/icons/indian.jpg" alt="India" width={16} height={16} />
                                    +91-8882178896
                                </span>
                                <span className='flex items-center gap-1'>
                                    <Image src="/course/icons/uslogo.png" alt="US" width={16} height={16} />
                                    +1 (343) 477-0926
                                </span>
                            </div>
                            <div>info@techpratham.com</div>
                        </div>

                        <div className='w-full flex flex-row justify-end gap-3 mt-4'>
                            <Link href='https://wa.me/+918882178896' className='w-auto flex flex-row gap-2 items-center justify-center bg-white p-1 rounded-md'>
                                <Image src='/support/whatsapp.png' alt='' width={40} height={40} />
                                <div className='w-auto flex flex-col text-sm'>
                                    <div>Whatsapp</div>
                                    <div>Click to Chat</div>
                                </div>
                            </Link>
                            <Link href='https://g.page/r/CX1XMlbVUiyaEBM/review' className='w-auto flex flex-row gap-2 bg-white p-1 rounded-md'>
                                <Image src='/support/google-maps.png' alt='' width={40} height={40} />
                                <div className='w-auto flex flex-col text-sm'>
                                    <span>Check Live</span>
                                    <span>Location Here</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Noida Office */}
                <div className='p-[3px] shadow flex items-center justify-center w-full h-auto rounded-xl bg-gradient-to-tl'
                    style={{ backgroundImage: 'linear-gradient(to top left, #ff0000, #ff9900, #33cc33, #3399ff, #9900cc, #ff3399)' }}>
                    <div className='row-span-1 w-full h-full flex flex-col p-4 rounded-lg bg-[#eee] relative'>
                        <div className='pb-4 font-semibold md:text-xl text-base'>Noida Office</div>
                        <Separator className='bg-black h-[0.5px]' />
                        <div className='flex flex-col gap-3 pt-4'>
                            <div className='font-semibold'>C-2, Sector-1, Noida, Uttar Pradesh - 201301</div>
                            <div>+91-8882178896, info@techpratham.com</div>
                        </div>

                        <div className='w-full flex flex-row justify-end gap-3 mt-4'>
                            <Link href='https://wa.me/+918882178896' className='w-auto flex flex-row gap-2 items-center justify-center bg-white p-1 rounded-md'>
                                <Image src='/support/whatsapp.png' alt='' width={40} height={40} />
                                <div className='w-auto flex flex-col text-sm'>
                                    <div>Whatsapp</div>
                                    <div>Click to Chat</div>
                                </div>
                            </Link>
                            <Link href='https://g.page/r/CX1XMlbVUiyaEBM/review' className='w-auto flex flex-row gap-2 bg-white p-1 rounded-md'>
                                <Image src='/support/google-maps.png' alt='' width={40} height={40} />
                                <div className='w-auto flex flex-col text-sm'>
                                    <span>Check Live</span>
                                    <span>Location Here</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Hyderabad Office */}
                <div className='p-[3px] shadow flex items-center justify-center w-full h-auto rounded-xl bg-gradient-to-tl'
                    style={{ backgroundImage: 'linear-gradient(to top left, #ff0000, #ff9900, #33cc33, #3399ff, #9900cc, #ff3399)' }}>
                    <div className='row-span-1 w-full h-full flex flex-col p-4 rounded-lg bg-[#eee] relative'>
                        <div className='pb-4 font-semibold md:text-xl text-base'>Hyderabad Office</div>
                        <Separator className='bg-black h-[0.5px]' />
                        <div className='flex flex-col gap-3 pt-4'>
                            <div className='font-semibold'>LVS Arcade, 71, Hitech, 6th floor , Madhapur Road, Jubilee Enclave, HITEC City, Hyderabad</div>
                            <div className='flex flex-wrap gap-3 items-center'>
                                <span className='flex items-center gap-1'>
                                    <Image src="/course/icons/indian.jpg" alt="India" width={16} height={16} />
                                    +91-8882178896
                                </span>
                                <span className='flex items-center gap-1'>
                                    <Image src="/course/icons/uslogo.png" alt="US" width={16} height={16} />
                                    +1 (343) 477-0926
                                </span>
                            </div>
                            <div>info@techpratham.com</div>
                        </div>

                        <div className='w-full flex flex-row justify-end gap-3 mt-4'>
                            <Link href='https://wa.me/+918882178896' className='w-auto flex flex-row gap-2 items-center justify-center bg-white p-1 rounded-md'>
                                <Image src='/support/whatsapp.png' alt='' width={40} height={40} />
                                <div className='w-auto flex flex-col text-sm'>
                                    <div>Whatsapp</div>
                                    <div>Click to Chat</div>
                                </div>
                            </Link>
                            <Link href='https://g.page/r/CX1XMlbVUiyaEBM/review' className='w-auto flex flex-row gap-2 bg-white p-1 rounded-md'>
                                <Image src='/support/google-maps.png' alt='' width={40} height={40} />
                                <div className='w-auto flex flex-col text-sm'>
                                    <span>Check Live</span>
                                    <span>Location Here</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className='col-span-1 w-full h-auto py-16 flex flex-col gap-5 items-center justify-center md:-mt-40 -mt-32'>
                <FormContact />
                <div className='p-[3px] shadow flex items-center justify-center w-auto h-auto rounded-xl bg-gradient-to-tl from-[#600A0E] to-[#C6151D] mt-4'>
                    <div className='row-span-1 w-64 h-auto flex flex-col gap-3 p-4 rounded-lg relative'>
                        <Image src='/support/qr-contact.svg' alt='' width={80} height={80} className='w-56 h-56 bg-white p-2' />
                        <div className='px-4 py-1 rounded-full bg-white text-black font-medium shadow text-center'>Post Your Feedback</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddressContact;
