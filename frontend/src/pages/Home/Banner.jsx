import React from 'react'
import bannerImg from "../../assets/banner.png"
const Banner = () => {
  return (
    <div className='flex flex-col md:flex-row py-12 justify-evenly items-center gap-12'>

        <div className='md:w-1/2 w-full'>
            <h1 className='md:text-5xl text-5xl font-bold mb-7'>This Week Releases</h1>
            <p className='mb-10'>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
            </p>

            <button className='bg-[#FFCE1A] px-12 py-2 rounded-full text-base font-bold hover:bg-[#0f0e1a] hover:text-white transition-all duration-200 cursor-pointer'>
                Subscribe now
            </button>
        </div>


        <div className='md:w-1/2 w-full flex px-15 items-center md:justify-end'>
            <img src={bannerImg} alt="" />
        </div>
    </div>
  )
}

export default Banner
