import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';
import getBaseUrl from '../../utils/baseUrl';
import { MdIncompleteCircle } from 'react-icons/md'
import { IoBookOutline, IoStatsChart, IoAlarmOutline, IoPersonOutline, IoEllipsisHorizontal } from 'react-icons/io5'
import RevenueChart from './RevenueChart';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const navigate = useNavigate()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response =  await axios.get(`${getBaseUrl()}/api/admin`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('admin-token')}`,
                        'Content-Type': 'application/json',
                    },
                })

                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setLoading(false);
                if (error.response?.status === 401) {
                    navigate('/admin');
                }
            }
        }

        fetchData();
    }, []);

    if(loading) return <Loading/>

  return (
    <div className='bg-gray-50 min-h-screen p-8'>
      <div className='max-w-7xl mx-auto space-y-8'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-4xl font-extrabold text-gray-900'>Admin Dashboard</h1>
          <div className='flex items-center space-x-4'>
            <span className='text-gray-600'>Welcome, Admin</span>
            <div className='w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold'>A</div>
          </div>
        </div>

        <section className='grid md:grid-cols-2 xl:grid-cols-4 gap-6'>
          {[
            { icon: 'book', color: 'purple', title: 'Total Books', value: data?.totalBooks },
            { icon: 'transaction', color: 'green', title: 'Total Transactions', value: data?.totalTransactions || 0 },
            { icon: 'overdue', color: 'red', title: 'Overdue Books', value: data?.overdueBooks || 0 },
            { icon: 'users', color: 'blue', title: 'Total Users', value: data?.totalUsers || 0 }
          ].map((card, index) => (
            <div key={index} className='bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all group'>
              <div className='flex items-center space-x-4'>
                <div className={`w-16 h-16 bg-${card.color}-100 text-${card.color}-600 rounded-full flex items-center justify-center`}>
                  {card.icon === 'book' && <IoBookOutline className='w-8 h-8' />}
                  {card.icon === 'transaction' && <IoStatsChart className='w-8 h-8' />}
                  {card.icon === 'overdue' && <IoAlarmOutline className='w-8 h-8' />}
                  {card.icon === 'users' && <IoPersonOutline className='w-8 h-8' />}
                </div>
                <div>
                  <p className='text-3xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors'>{card.value}</p>
                  <p className='text-gray-500 text-sm'>{card.title}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className='grid md:grid-cols-2 xl:grid-cols-3 gap-8'>
          <div className='bg-white rounded-xl shadow-md p-6 md:col-span-2 xl:col-span-2'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>Monthly Transactions</h2>
            <div className='h-64 bg-gray-50 rounded-lg flex items-center justify-center'>
              <RevenueChart transactionData={data.monthlyTransactions}/>
            </div>
          </div>

          <div className='bg-white rounded-xl shadow-md p-6'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-2xl font-bold text-gray-800'>Top Borrowers</h2>
              <IoEllipsisHorizontal className='text-gray-500 cursor-pointer hover:text-gray-700' />
            </div>
            <div className='space-y-4'>
              {data?.topBorrowers?.map((borrower, index) => (
                <div key={index} className='flex items-center space-x-4 hover:bg-gray-50 p-2 rounded-lg transition-colors'>
                  <img 
                    src={borrower.avatar || 'https://randomuser.me/api/portraits/men/75.jpg'} 
                    alt={`${borrower.name} profile`} 
                    className='w-12 h-12 rounded-full object-cover'
                  />
                  <div className='flex-grow'>
                    <p className='font-semibold text-gray-800'>{borrower.name}</p>
                    <p className='text-sm text-gray-500'>Borrowed {borrower.borrowCount} books</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Dashboard
