import React, { useState } from 'react';
import BookCard from '../books/Bookcard';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';

import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';

const categories = ['choose a genre', 'business', 'marketing', 'Fiction','Horror'];

const Topgoing = () => {
  const [selectedCategory, setSelectedCategory] = useState('choose a genre');
  const { data, isLoading } = useFetchAllBooksQuery();

  const books = Array.isArray(data) ? data : data?.books || [];

  const filteredBooks =
    selectedCategory === 'choose a genre'
      ? books
      : books.filter(book => book.category === selectedCategory.toLowerCase());

  return (
    <div className='py-10'>
      <h2 className='text-2xl font-bold'>Top Going</h2>

      {/* Category filtering */}
      <div className='mb-8 py-5 flex items-center'>
        <select
          onChange={e => setSelectedCategory(e.target.value)}
          name='category'
          id='category'
          className='border bg-[#EAEAEA] border-gray-300 rounded-md px-4 py-2 focus:outline-none'
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          navigation={true}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 2,
              spaceBetween: 50,
            },
            1180: {
              slidesPerView: 3,
              spaceBetween: 50,
            },
          }}
          modules={[Pagination, Navigation]}
          className='mySwiper'
        >
          {filteredBooks.length > 0 &&
            filteredBooks.map((book, index) => (
              <SwiperSlide key={index}>
                <BookCard book={book} />
              </SwiperSlide>
            ))}
        </Swiper>
      )}
    </div>
  );
};

export default Topgoing;
