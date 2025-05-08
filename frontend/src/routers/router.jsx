import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import SingleBooks from "../pages/books/SingleBooks";
import PrivateRoute from "./PrivateRoute";
import BorrowPage from "../pages/Borrow/BorrowPage";
import BorrowedBooksPage from "../pages/Borrow/BorrowedBooksPage";
import AdminRoute from "./AdminRoute";
import AdminLogin from "../components/AdminLogin";

import App from "../App";
import DashboardLayout from "../pages/Dashboard/DashboardLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import ManageBooks from "../pages/Dashboard/manageBooks/ManageBooks";
import AddBook from "../pages/Dashboard/addBook/AddBook";
import UpdateBook from "../pages/Dashboard/editBook/UpdateBook";
import UserDashboard from "../pages/Dashboard/users/UserDashboard";
import UserDetails from "../pages/Dashboard/UserDetails";

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
        path: "/borrow",
        element: <PrivateRoute><BorrowPage /></PrivateRoute>
      },
      {
        path: "/borrowed-books",
        element: <PrivateRoute><BorrowedBooksPage /></PrivateRoute>
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
      },
      {
        path: "user-details", // New route for user details
        element: <UserDetails/>
      }
    ]
  }
]);
export default router;
