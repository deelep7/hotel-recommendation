import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Register from "./pages/Register";
import Layout from "./layouts/Layout";
import SignIn from "./pages/SignIn";
import AddHotel from "./pages/AddHotel";
import { useAppContext } from "./contexts/AppContext";



const App = () => {
  const {isLoggedIn} = useAppContext();
  return(
    <Router>
      <Routes>
        <Route path="/" element ={<Layout>
          <p>Home Page</p>
        </Layout>
      } />
        <Route path="/search" element ={
          <Layout>
          <p>Search Page</p>
        </Layout>
        } />
        <Route path = "/register" element={<Layout>
          <Register />
        </Layout>} />
          <Route path="/sign-in" element={
            <Layout>
              <SignIn />
            </Layout>
          } />
        {isLoggedIn && <>
        <Route path="/add-hotel" element={
          <Layout>
            <AddHotel />
          </Layout>
        } >
          </Route></>}
        <Route path="*" element ={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};


export default App;