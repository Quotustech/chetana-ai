"use client"

import React from 'react';
import Image from 'next/image';

import Png from "@/assets/man-working-in-office.png";
import Png2 from "@/assets/png-2.png"
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';


const Hero = () => {
    const router = useRouter();

    const homeSection = () => {
        return router.push('/app');
    };
    return (
        <section className="bg-[#f9f9f9] text-black dark:bg-[#0E1525] dark:text-white h-fit  overflow-hidden">

            <div className="px-6 py-12 text-center md:px-12 lg:py-24 lg:text-left">
                <div className="w-100 mx-auto text-black sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl">
                    <div className="grid items-center gap-12 lg:grid-cols-2">
                        <div className="mt-12 lg:mt-0" style={{ zIndex: 10 }}>
                            <h1
                                className="mt-0 mb-10 text-5xl font-bold tracking-tight md:text-6xl xl:text-6xl text-[hsl(218,81%,75%)]">
                                Gain more confidence<br /><span className="text-[hsl(218,81%,75%)]"> in interviews</span>
                            </h1>
                            <p className="opacity-70 dark:text-white">
                              Unlock the key to success in your professional journey by gaining more confidence in interviews. Our specialized program is designed to empower you with the skills and mindset needed to shine in any interview setting. Whether you&apos;re a seasoned professional looking to elevate your career or a recent graduate stepping into the workforce, our comprehensive approach covers effective communication, strategic self-presentation, and the art of showcasing your unique strengths.
                            </p>

                            <Button onClick={homeSection} className="mt-9 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[hsl(218,50%,60%)] hover:bg-[#273A5C]">
                                Home
                            </Button>

                        </div>
                        <div className="relative mb-12 lg:mb-0">
                            <Image src={Png2} alt='Banner Image' className='w-[520px] ml-48 sm:hidden lg:block md:hidden ' />
                        </div>
                    </div>
                </div>
            </div>
            {/* Jumbotron */}
        </section>
    );
};

export default Hero;
