import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  const { isLoggedIn, userRole } = useAppContext();

  return (
    <div className="bg-blue-800 py-6">
      <div className="container mx-auto flex justify-between items-center">
        <span className="text-3xl text-white font-bold tracking-tight transition-transform duration-200 hover:scale-105">
          <Link to="/">Hotel Shujab</Link>
        </span>
        <span className="flex space-x-2 items-center">
          {isLoggedIn ? (
            <>
              {isLoggedIn && userRole === "user" && (
                <Link
                  className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
                  to="/my-bookings"
                >
                  My Bookings
                </Link>
              )}
              {isLoggedIn && userRole === "hotelOwner" && (
                <>
                  <Link
                    className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
                    to="/my-hotels"
                  >
                    My Hotels
                  </Link>
                  <Link
                    className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
                    to="/my-bookings"
                  >
                    My Bookings
                  </Link>
                </>
              )}
              {isLoggedIn && userRole === "admin" && (
                <>
                  <Link
                    className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
                    to="/admin"
                  >
                    Hotel Details
                  </Link>
                </>
              )}
              {/* Profile/info icon */}
              <Link
                to="/profile"
                className="flex items-center text-white px-3 text-2xl hover:text-blue-300"
                title="Profile"
              >
                <FaUserCircle />
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              to="/sign-in"
              className="flex bg-white items-center text-blue-600 px-3 font-bold hover:bg-gray-100"
            >
              Sign In
            </Link>
          )}
        </span>
      </div>
    </div>
  );
};

export default Header;
