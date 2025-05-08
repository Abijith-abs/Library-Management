import React from 'react';
import { useGetOrderByEmailQuery } from '../../redux/features/orders/ordersApi';
import { useAuth } from '../../context/AuthContext';
import AuthProvider from '../../context/AuthContext';

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

  if (isLoading) return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500"></div>
      </div>
    );
  if (isError) return (
      <div className="text-center py-10 bg-red-50">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Orders</h2>
        <p className="text-red-500">Unable to retrieve your order history. Please try again later.</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-indigo-800 tracking-tight mb-3">Your Order History</h1>
        <p className="text-gray-500 max-w-xl mx-auto">Track and manage all your book orders in one place</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <h3 className="text-xl text-gray-600 mb-4">No orders found</h3>
          <p className="text-gray-500">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div>
          {orders.map((order, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 mb-6 border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">Order #{index + 1}</span>
                  <h3 className="text-lg font-bold text-gray-800 mt-2">Order ID: {order?._id}</h3>
                </div>
                <span className="text-green-600 font-semibold text-xl">₹{order.totalPrice}</span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-gray-600">
                <div>
                  <p className="font-medium text-gray-500">Customer Details</p>
                  <p>Name: {order.name}</p>
                  <p>Email: {order.email}</p>
                  <p>Phone: {order.phone}</p>
                </div>

                <div>
                  <p className="font-medium text-gray-500">Shipping Address</p>
                  <p>{order.address.city}, {order.address.state}</p>
                  <p>{order.address.country}, {order.address.zipCode}</p>
                </div>
              </div>

              <div className="mt-6 border-t pt-4">
                <h4 className="text-sm font-semibold text-gray-600 mb-2">Ordered Books</h4>
                <div className="space-y-2">
                  {order.productIds.map((productId, idx) => (
                    <div key={productId} className="bg-gray-50 rounded px-3 py-2 text-sm">
                      Book {idx + 1}: {productId}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default OrdersPage;
