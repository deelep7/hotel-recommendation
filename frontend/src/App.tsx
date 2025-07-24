import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import AddHotel from "./pages/AddHotel";
import { useAppContext } from "./contexts/AppContext";
import MyHotels from "./pages/MyHotels";
import EditHotel from "./pages/EditHotel";
import Search from "./pages/Search";
import Detail from "./pages/Detail";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import BookHotel from "./pages/BookHotel";
import AdminLogin from "./pages/AdminLogin";
import Profile from "./pages/Profile";
import BookingConfirmation from "./pages/BookingConfirmation";

const App = () => {
  const { isLoggedIn, userRole } = useAppContext();
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/search"
          element={
            <Layout>
              <Search />
            </Layout>
          }
        />
        <Route
          path="/detail/:hotelId"
          element={
            <Layout>
              <Detail />
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />
        <Route
          path="/sign-in"
          element={
            <Layout>
              <SignIn />
            </Layout>
          }
        />
        <Route
          path="/book-hotel"
          element={
            <Layout>
              <BookHotel />
            </Layout>
          }
        />
        <Route
          path="/booking-confirmation"
          element={
            <Layout>
              <BookingConfirmation />
            </Layout>
          }
        />
        <Route
          path="/admin-login"
          element={
            <Layout>
              <AdminLogin />
            </Layout>
          }
        />

        {isLoggedIn && (
          <>
            <Route
              path="/profile"
              element={
                <Layout>
                  <Profile />
                </Layout>
              }
            />
            <Route
              path="/hotel/:hotelId/booking"
              element={
                <Layout>
                  <Booking />
                </Layout>
              }
            />

            {userRole === "hotelOwner" && (
              <>
                <Route
                  path="/add-hotel"
                  element={
                    <Layout>
                      <AddHotel />
                    </Layout>
                  }
                />
                <Route
                  path="/edit-hotel/:hotelId"
                  element={
                    <Layout>
                      <EditHotel />
                    </Layout>
                  }
                />
                <Route
                  path="/my-hotels"
                  element={
                    <Layout>
                      <MyHotels />
                    </Layout>
                  }
                />
              </>
            )}
            {(userRole === "user" || userRole === "hotelOwner") && (
              <Route
                path="/my-bookings"
                element={
                  <Layout>
                    <MyBookings />
                  </Layout>
                }
              />
            )}
            {userRole === "admin" && (
              <>
                <Route
                  path="/admin"
                  element={
                    <Layout>
                      <AdminDashboard />
                    </Layout>
                  }
                />
                <Route
                  path="*"
                  element={<Navigate to="/admin" />}
                />
              </>
            )}
          </>
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
