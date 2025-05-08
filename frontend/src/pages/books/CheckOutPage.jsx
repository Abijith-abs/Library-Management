import React from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthProvider from '../../context/AuthContext';
import Swal from 'sweetalert2';
import { useCreateAnOrderMutation } from '../../redux/features/orders/ordersApi';

const CheckOutPage = () => {
  const [isChecked, setIsChecked] = React.useState(false);
  const cartItems = useSelector(state => state.cart.cartItems);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.newPrice, 0).toFixed(2);
  const { currentUser } = useAuth();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const [createAnOrder,{isLoading}] = useCreateAnOrderMutation();

  const onSubmit = async(data) => {
    const newOrder = {
      name: data.name,
      email: currentUser?.email,
      address: {
        city: data.city,
        country: data.country,
        state: data.state,
        zipCode: data.zipCode
      },
      phone: data.phone,
      productIds: cartItems.map(item => item._id),
      totalPrice: totalPrice
    };
    console.log(newOrder);
   try{
    await createAnOrder(newOrder).unwrap();
    Swal.fire({
      title: "Order Confirmed",
      text: "Your Order Placed Successfully",
      icon: "success",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes,OK!"
        
});
navigate('/orders');
   }catch(error){
    console.error("Error creating an order", error);
    alert("Error creating order");
   }
  }

    if(isLoading) return <div>Loading...</div>

  return (
    <section>
      <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div>
            <h2 className="font-semibold text-xl text-gray-600 mb-2">Cash On Delivery</h2>
            <p className="text-gray-500 mb-2">Total Price: ${totalPrice}</p>
            <p className="text-gray-500 mb-6">Items: {cartItems.length}</p>

            <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3 my-8"
              >
                <div className="text-gray-600">
                  <p className="font-medium text-lg">Personal Details</p>
                  <p>Please fill out all the fields.</p>
                </div>

                <div className="lg:col-span-2">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">

                    {/* Full Name */}
                    <div className="md:col-span-5">
                      <label htmlFor="name">Full Name</label>
                      <input
                        {...register("name", { required: "Full name is required" })}
                        type="text"
                        id="name"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      />
                      {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>

                    {/* Email (disabled) */}
                    <div className="md:col-span-5">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="text"
                        id="email"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        disabled
                        defaultValue={currentUser?.email}
                      />
                    </div>

                    {/* Phone */}
                    <div className="md:col-span-5">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        {...register("phone", {
                          required: "Phone number is required",
                          pattern: {
                            value: /^[0-9]{10,14}$/,
                            message: "Enter a valid phone number"
                          }
                        })}
                        type="text"
                        id="phone"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        placeholder="+1234567890"
                      />
                      {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                    </div>

                    {/* Address (optional) */}
                    <div className="md:col-span-3">
                      <label htmlFor="address">Address / Street</label>
                      <input
                        type="text"
                        id="address"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        placeholder=""
                      />
                    </div>

                    {/* City */}
                    <div className="md:col-span-2">
                      <label htmlFor="city">City</label>
                      <input
                        {...register("city", { required: "City is required" })}
                        type="text"
                        id="city"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      />
                      {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
                    </div>

                    {/* Country */}
                    <div className="md:col-span-2">
                      <label htmlFor="country">Country / region</label>
                      <input
                        {...register("country", { required: "Country is required" })}
                        type="text"
                        id="country"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      />
                      {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
                    </div>

                    {/* State */}
                    <div className="md:col-span-2">
                      <label htmlFor="state">State / province</label>
                      <input
                        {...register("state", { required: "State is required" })}
                        type="text"
                        id="state"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      />
                      {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
                    </div>

                    {/* Zip Code */}
                    <div className="md:col-span-1">
                      <label htmlFor="zipCode">Zipcode</label>
                      <input
                        {...register("zipCode", {
                          required: "Zipcode is required",
                          pattern: {
                            value: /^[0-9]{5,6}$/,
                            message: "Enter a valid zip code"
                          }
                        })}
                        type="text"
                        id="zipCode"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      />
                      {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode.message}</p>}
                    </div>

                    {/* Checkbox */}
                    <div className="md:col-span-5 mt-3">
                      <div className="inline-flex items-center">
                        <input
                          type="checkbox"
                          id="billing_same"
                          className="form-checkbox"
                          checked={isChecked}
                          onChange={() => setIsChecked(!isChecked)}
                        />
                        <label htmlFor="billing_same" className="ml-2">
                          I agree to the{' '}
                          <Link className="underline text-blue-600">Terms & Conditions</Link> and{' '}
                          <Link className="underline text-blue-600">Shopping Policy</Link>.
                        </label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="md:col-span-5 text-right">
                      <div className="inline-flex items-end">
                        <button
                          disabled={!isChecked}
                          type="submit"
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                        >
                          Place an Order
                        </button>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckOutPage;
