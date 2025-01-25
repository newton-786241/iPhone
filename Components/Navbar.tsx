import React from 'react'
import { navLists } from '@/data'
import appleimg from "@/public/assets/images/apple.svg"
import Image from 'next/image'
import searchimg from "@/public/assets/images/search.svg"
import bagimg from "@/public/assets/images/bag.svg"

const Navbar = () => {
  return (
    <div className='flex justify-between items-center mx-auto lg:w-[80vw] py-3 w-full px-5 sm:px-10 md:w-[70vw]'>
        <Image src={appleimg} alt="appleimg" width={14} height={18} className='w-4 lg:w-4 cursor-pointer'/>
        <nav className='flex w-[40%] justify-around'>
      {navLists.map((navitem)=>(
        <div key={navitem} className=' text-sm hidden sm:block text-gray-400 cursor-pointer hover:text-white transition-all'>
            {navitem}
        </div>
      ))}
      </nav>
      <div className='flex gap-6 py-2 sm:px-4'>
      <Image className='w-4 lg:w py-2 sm:px-4-4 cursor-pointer' src={searchimg} alt="searchimg" height={18} width={14}></Image>
      <Image className='w-4 lg:w-4 cursor-pointer ' src={bagimg} alt=""></Image>
      </div>
    </div>
  )
}

export default Navbar
