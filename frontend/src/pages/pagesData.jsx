import About from "./About";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";

const pagesData = [
  {
    path: "",
    element: <Home />,
    title: "home",
  },
  {
    path: "login",
    element: <Login />,
    title: "login",
  },
    {
    path: "register",
    element: <Register />,
    title: "register",
  },
];

export default pagesData;
