import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Username from "./components/Username";
import Register from "./components/Register";
import Password from "./components/Password";
import PageNotFound from "./components/PageNotFound";
import Recovery from "./components/Recovery";
import Profile from "./components/Profile";
import Reset from "./components/Reset";

// auth middleware
import { AuthorizeUser, ProtectRoute } from "./middleware/auth";

// routes 
const router = createBrowserRouter([
  {
    path:'/',
    element:<Username></Username>
  },
  {
    path:'/register',
    element:<Register></Register>
  },
  {
    path:'/password',
    element: <ProtectRoute><Password/></ProtectRoute>
  },
  {
    path:'/profile',
    element: <AuthorizeUser><Profile/></AuthorizeUser>
  },
  {
    path:'/recovery',
    element:<Recovery></Recovery>
  },
  {
    path:'/reset',
    element:<Reset></Reset>
  },
  {
    path:'*',
    element:<PageNotFound></PageNotFound>
  },
])

function App() {
  return (
    <main>
      <RouterProvider router={router}></RouterProvider>
    </main>
  );
}

export default App;
