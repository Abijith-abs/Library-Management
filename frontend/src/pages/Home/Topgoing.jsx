import React, { useState } from 'react';
import BookCard from '../books/Bookcard';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';

import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';
import { FaBookOpen, FaFilter } from 'react-icons/fa';

const categories = ['Choose a Genre', 'Business', 'Marketing', 'Fiction', 'Horror', 'Science', 'Romance'];

const Topgoing = () => {
  const [selectedCategory, setSelectedCategory] = useState('Choose a Genre');
  const { data, isLoading } = useFetchAllBooksQuery();

  const books = Array.isArray(data) ? data : data?.books || [];

  const filteredBooks =
    selectedCategory === 'Choose a Genre'
      ? books
      : books.filter(book => book.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className='w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-gray-50 to-indigo-50'>
      <div className='text-center mb-12 space-y-4'>
        <div className='flex justify-center items-center space-x-3'>
          <FaBookOpen className='text-4xl text-indigo-600' />
          <h2 className='text-3xl sm:text-4xl font-extrabold text-indigo-900 tracking-tight'>Top Going Books</h2>
        </div>
        <p className='text-base sm:text-lg text-gray-600 max-w-2xl mx-auto'>
          Discover trending books across various genres that are capturing readers' imaginations
        </p>
      </div>

      {/* Category filtering */}
      <div className='mb-10 flex justify-center'>
        <div className='relative w-full max-w-md'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <FaFilter className='text-gray-400' />
          </div>
          <select
            onChange={e => setSelectedCategory(e.target.value)}
            name='category'
            id='category'
            className='block w-full pl-10 pr-4 py-3 border border-gray-300 bg-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900'
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600'></div>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className='text-center text-gray-500 py-10'>
          No books found in the selected category
        </div>
      ) : (
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          modules={[Pagination, Navigation]}
          className='mySwiper relative group'
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
          }}
        >
          {filteredBooks.map((book, index) => (
            <SwiperSlide key={index} className='transition-transform duration-300 hover:scale-105'>
              <BookCard book={book} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default Topgoing;
