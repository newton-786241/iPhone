"use client"

import React, { useCallback, useEffect, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { heroVideo, smallHeroVideo } from '@/app/utils'

const Hero = () => {
    const [videoSrc, setVideoSrc] = useState(() => {
        return window.innerWidth < 760 ? smallHeroVideo : heroVideo;        
        return heroVideo;
      });
    const handleVideoSetSrc = useCallback(()=>{
                if(window.innerWidth < 760){
            setVideoSrc(smallHeroVideo)
        }else{
            setVideoSrc(heroVideo)
        }
    },[])
    useEffect(() => {
        if(typeof window !== 'undefined'){
          handleVideoSetSrc()
        }
        const handleResize = () => {
          handleVideoSetSrc();
        };
        window.addEventListener("resize", handleResize);
        return () => {
          window.removeEventListener("resize", handleResize);
        };
      }, [handleVideoSetSrc]);
    
    useGSAP(()=>(
        gsap.to(".hero-title",{
            opacity: 1,
            y: -30,
            delay:1.5,
        }),
        gsap.to("#cta", {
            opacity: 1,
            y:-50,
            delay: 1.5
        })
    ),[])

  return (
        <section className='w-full bg-black relative'>
            <div className='h-[83.33vh] w-full flex justify-center items-center flex-col'>
                <h1 className='hero-title text-gray-300'>iPhone 15 Pro</h1>
                <div className='max-w-10/12 w-9/12'>
                <video autoPlay muted playsInline={true} key={videoSrc} className='pointer-events-none'>
                    <source src={videoSrc} type='video/mp4'/>
                </video>
                </div>
            </div>
            <div className='flex flex-col items-center justify-center opacity-0 relative text-white' id="cta">
                <a href="#highlights" className='btn text-lg'>Buy</a>
                <p className='font-normal text-xl'>From $199/month or $999</p>
            </div>
        </section>
  )
}

export default Hero
