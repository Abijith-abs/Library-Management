import React from 'react';
import { useGetOrderByEmailQuery } from '../../redux/features/orders/ordersApi';
import { useAuth } from '../../context/AuthContext';

const OrdersPage = () => {
  const { currentUser } = useAuth(); // Get the logged-in user

  // Call the RTK Query hook safely
  const {
    data,
    isLoading,
    isError,
  } = useGetOrderByEmailQuery(currentUser?.email);

  // Optional: Check what the API actually returns
  console.log("Orders API response:", data);

  // Extract orders array safely
  const orders = Array.isArray(data) ? data : data?.orders || [];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading orders</div>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>

      {orders.length === 0 ? (
        <div>No orders found</div>
      ) : (
        <div>
          {orders.map((order, index) => (
            <div key={index} className="p-4 border rounded mb-3 shadow">
              <p className='p-1 bg-[#0D0842] text-white w-10 rounded mb-1'>#{index +1}</p>
              <h3 className="font-semibold text-lg">Order ID: {order?._id}</h3>
              <p className="text-gray-600">Name : {order.name}</p>
              <p className="text-gray-600">Email : {order.email}</p>
              
              <p className="text-gray-600">Phone : {order.phone}</p>
              <p className="text-gray-600">Total Price : {order.totalPrice}</p>
              <h3 className='font-semibold mt-2'>Address:</h3>
              <p> {order.address.city}, {order.address.state},{order.address.country},{order.address.zipCode}</p>
              <h3 className='font-semibold mt-2'>Product IDs:</h3>
              <ul>
                {order.productIds.map((productId) => (
                    <li key = {productId}>{productId}</li>
                ))}
              </ul>
              <p>{order.productIds.join(', ')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default OrdersPage;
