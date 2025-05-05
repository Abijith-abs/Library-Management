import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import CartPage from "../pages/books/CartPage";
import { Outlet } from 'react-router-dom';
import CheckOutPage from "../pages/books/CheckOutPage";
import SingleBooks from "../pages/books/SingleBooks";
import PrivateRoute from "./PrivateRoute";
import OrdersPage from "../pages/books/OrdersPage";
import AdminRoute from "./AdminRoute";
import AdminLogin from "../components/AdminLogin";

import App from "../App";
import DashboardLayout from "../pages/Dashboard/DashboardLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import ManageBooks from "../pages/Dashboard/manageBooks/ManageBooks";
import AddBook from "../pages/Dashboard/addBook/AddBook";
import UpdateBook from "../pages/Dashboard/editBook/UpdateBook";
import UserDashboard from "../pages/Dashboard/users/UserDashboard";

const router = createBrowserRouter([
  // User routes with navbar
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/orders",
        element: <OrdersPage />
      },
      {
        path: "/about",
        element: <div>About</div>
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/cart",
        element: <CartPage />
      },
      {
        path: "/checkout",
        element: <PrivateRoute><CheckOutPage /></PrivateRoute>
      },
      {
        path: "/books/:id",
        element: <SingleBooks />
      },
      {
        path: "/user-dashboard",
        element: <UserDashboard/>
      }
    ]
  },
  // Admin routes without navbar
  {
    path: "/admin",
    element: <AdminLogin/>
  },
  {
    path: "/Dashboard",
    element: (
      <AdminRoute>
        <DashboardLayout/>
      </AdminRoute>
    ),
    children: [
      {
        path: "", // matches /Dashboard
        element: <Dashboard/>
      },
      {
        path: "add-new-book", // This is the correct relative path
        element: <AdminRoute><AddBook/></AdminRoute>
      },
      {
        path: "edit-book/:id", // This is a relative path as well
        element: <AdminRoute><UpdateBook/></AdminRoute>
      },
      {
        path: "manage-books", // This is a relative path as well
        element: <ManageBooks/>
      }
    ]
  }
]);
export default router;
