import React, { useState } from 'react';
import { CaretUpIcon } from '@radix-ui/react-icons';
import { faqsFields } from '../../assets/faqs';
import FormFaqs from '../FormFaqs/FormFaqs';

const ContentFaqs = () => {
    const [selected, setSelected] = useState<number | null>(null);

    const toggle = (i: number) => {
        if (selected === i) {
            return setSelected(null);
        }
        setSelected(i);
    };

    return (
        <div className='md:w-10/12 w-11/12 h-auto flex md:flex-row flex-col gap-8 items-start justify-center py-10'>
            <div className="relative flex flex-col items-start justify-center self-center pb-6 md:w-9/12 w-full">
                {faqsFields?.map((item: any, index: any) => (
                    <div
                        className="w-full p-2 px-3 my-3 cursor-pointer bg-white border-border border"
                        key={index}
                        onClick={() => toggle(index)}
                    >
                        <div className="pb-1 flex items-center justify-between">
                            <p className="pr-4 text-[#000000] text-base font-medium">{item.que}</p>
                            {selected === index ? (
                                <CaretUpIcon className='w-6 h-6 transition-all duration-300 rotate-0' />
                            ) : (
                                <CaretUpIcon className='w-6 h-6 transition-all duration-300 rotate-180' />
                            )}
                        </div>
                        <div
                            className={
                                selected === index
                                    ? "overflow-hidden transition-all md:py-4 py-3 max-h-96 ease-out duration-700 text-[#6F7680] text-base font-medium"
                                    : "overflow-hidden transition-all max-h-0 duration-300 text-[#6F7680]"
                            }
                        >
                            <p>{item.ans}</p>
                        </div>
                    </div>
                ))}
            </div>
            <FormFaqs />
        </div>
    )
}

export default ContentFaqs