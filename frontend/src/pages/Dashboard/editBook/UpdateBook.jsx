import React, { useEffect } from 'react';
import InputField from '../addBook/InputField';
import SelectField from '../addBook/SelectField';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';

import Loading from '../../../components/Loading';
import Swal from 'sweetalert2';
import axios from 'axios';
import getBaseUrl from '../../../utils/baseUrl';
import { useFetchBookByIdQuery } from '../../../redux/features/books/booksApi';

const UpdateBook = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: bookData, isLoading, isError, refetch } = useFetchBookByIdQuery(id);
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (bookData) {
      setValue('title', bookData.title);
      setValue('description', bookData.description);
      setValue('category', bookData?.category);
      setValue('trending', bookData.trending);
      setValue('oldPrice', bookData.oldPrice);
      setValue('newPrice', bookData.newPrice);
      setValue('coverImage', bookData.coverImage);
    }
  }, [bookData, setValue]);

  const onSubmit = async (data) => {
    const updateBookData = {
      title: data.title,
      description: data.description,
      category: data.category,
      trending: data.trending,
      oldPrice: Number(data.oldPrice),
      newPrice: Number(data.newPrice),
      coverImage: data.coverImage || bookData.coverImage,
    };
    try {
      await axios.put(`${getBaseUrl()}/api/books/edit/${id}`, updateBookData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        }
      });
      Swal.fire({
        title: "Book Updated",
        text: "Your book is updated successfully!",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
      await refetch();
      navigate('/dashboard/manage-books');
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to update book.",
        icon: "error"
      });
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <div className="text-red-500 text-center py-4">Error fetching book data</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Update Book</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField
          label="Title"
          name="title"
          placeholder="Enter book title"
          register={register}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            {...register('description')}
            placeholder="Enter book description"
            className="w-full border border-gray-300 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>

        <SelectField
          label="Category"
          name="category"
          options={[
            { value: '', label: 'Choose A Category' },
            { value: 'business', label: 'Business' },
            { value: 'technology', label: 'Technology' },
            { value: 'fiction', label: 'Fiction' },
            { value: 'horror', label: 'Horror' },
            { value: 'adventure', label: 'Adventure' },
          ]}
          register={register}
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register('trending')}
            className="h-4 w-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <label className="text-sm text-gray-700 font-medium">Mark as Trending</label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Old Price"
            name="oldPrice"
            type="number"
            step="0.01"
            min="0"
            placeholder="Old Price"
            register={register}
          />

          <InputField
            label="New Price"
            name="newPrice"
            type="number"
            step="0.01"
            min="0"
            placeholder="New Price"
            register={register}
          />
        </div>

        <InputField
          label="Cover Image URL"
          name="coverImage"
          type="text"
          placeholder="https://example.com/image.jpg"
          register={register}
        />

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
        >
          Update Book
        </button>
      </form>
    </div>
  );
};

export default UpdateBook;
