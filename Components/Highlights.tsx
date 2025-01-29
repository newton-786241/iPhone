"use client"

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import React from 'react'
import Image from 'next/image'
import { watchImg, rightImg } from '@/app/utils'
import VideoCarousel from './VideoCarousel'

const Highlights = () => {

    useGSAP(()=>(

        gsap.fromTo(
            ("#link"), 
            {y: 20, opacity:0},
            {y: 0, delay: 0.5, opacity:1, stagger:0.25})
    ),[])

  return (
    <section className='bg-zinc-950 text-white w-full overflow-hidden'>
        <div className='w-full md:w-[80vw] lg:w-[70vw] md:flex justify-between m-auto items-baseline pt-24 sm:pt-32 pl-10 md:pl-0'>
        <h1 id="title" className='text-gray-400 text-3xl sm:text-5xl md:text-6xl pb-3 md:pb-0'>Get the Highlights.</h1>
        <div className=' flex gap-6'>
            <p className='text-blue-600 hover:underline flex gap-2 cursor-pointer text-base md:text-lg lg:text-xl' id="link">
                Watch the film
                <Image src={watchImg} alt="watch"></Image>
            </p>
            <p className='text-blue-600 hover:underline flex gap-2 cursor-pointer text-base md:text-lg lg:text-xl' id="link">
                Watch the event
                <Image src={rightImg} alt="right"></Image>
            </p>
        </div>
        </div>
        <VideoCarousel/>
    </section>
  )
}

export default Highlights
