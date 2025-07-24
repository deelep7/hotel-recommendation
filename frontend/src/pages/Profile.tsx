import { useAppContext } from "../contexts/AppContext";
import { FaUserCircle } from "react-icons/fa";

const Profile = () => {
  const { currentUser, userRole } = useAppContext();

  if (!currentUser) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 border rounded-lg shadow relative bg-white">
      <FaUserCircle className="absolute top-4 right-4 text-5xl text-blue-600" />
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <div className="mb-4">
        <span className="font-semibold">Name: </span>
        {currentUser.firstName} {currentUser.lastName}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Email: </span>
        {currentUser.email}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Role: </span>
        {userRole}
      </div>
    </div>
  );
};

export default Profile; 