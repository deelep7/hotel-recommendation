import { useQuery, useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useState, useMemo } from "react";

const AdminDashboard = () => {
  const { showToast, userRole } = useAppContext();
  const queryClient = useQueryClient();
  const { data: hotels, isLoading } = useQuery("allHotels", apiClient.fetchHotels);
  const { data: users } = useQuery("adminUsers", apiClient.fetchAllUsers);
  const deleteHotelMutation = useMutation(apiClient.deleteHotel, {
    onSuccess: () => {
      showToast({ message: "Hotel deleted", type: "SUCCESS" });
      queryClient.invalidateQueries("allHotels");
    },
    onError: () => {
      showToast({ message: "Error deleting hotel", type: "ERROR" });
    },
  });
  const deleteUserMutation = useMutation(apiClient.deleteUser, {
    onSuccess: () => {
      showToast({ message: "User deleted", type: "SUCCESS" });
      queryClient.invalidateQueries("adminUsers");
    },
    onError: () => {
      showToast({ message: "Error deleting user", type: "ERROR" });
    },
  });
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [tab, setTab] = useState<"hotels" | "users">("hotels");

  // Map userId to user for quick lookup
  const userMap = useMemo(() => {
    const map: Record<string, any> = {};
    if (users) {
      users.forEach((user: any) => {
        map[user._id] = user;
      });
    }
    return map;
  }, [users]);

  if (userRole !== "admin") return null;

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded font-bold ${tab === "hotels" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setTab("hotels")}
        >
          Hotel Details
        </button>
        <button
          className={`px-4 py-2 rounded font-bold ${tab === "users" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setTab("users")}
        >
          Users
        </button>
      </div>
      {tab === "hotels" && (
        <>
          <table className="min-w-full border mb-8">
            <thead>
              <tr>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">City</th>
                <th className="border px-4 py-2">Country</th>
                <th className="border px-4 py-2">Type</th>
                <th className="border px-4 py-2">Price</th>
                <th className="border px-4 py-2">Owner</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotels?.map((hotel: any) => {
                const owner = userMap[hotel.userId];
                return (
                  <tr key={hotel._id}>
                    <td className="border px-4 py-2">{hotel.name}</td>
                    <td className="border px-4 py-2">{hotel.city}</td>
                    <td className="border px-4 py-2">{hotel.country}</td>
                    <td className="border px-4 py-2">{hotel.type}</td>
                    <td className="border px-4 py-2">£{hotel.pricePerNight}</td>
                    <td className="border px-4 py-2">
                      {owner ? `${owner.firstName} ${owner.lastName}` : "Unknown"}
                    </td>
                    <td className="border px-4 py-2 space-x-2">
                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        onClick={() => setSelectedHotel(hotel)}
                      >
                        View More
                      </button>
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        onClick={() => deleteHotelMutation.mutate(hotel._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {/* Modal for hotel details */}
          {selectedHotel && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
                  onClick={() => setSelectedHotel(null)}
                >
                  &times;
                </button>
                <h2 className="text-2xl font-bold mb-2">{selectedHotel.name}</h2>
                <div className="mb-2"><span className="font-semibold">City:</span> {selectedHotel.city}</div>
                <div className="mb-2"><span className="font-semibold">Country:</span> {selectedHotel.country}</div>
                <div className="mb-2"><span className="font-semibold">Type:</span> {selectedHotel.type}</div>
                <div className="mb-2"><span className="font-semibold">Price:</span> £{selectedHotel.pricePerNight}</div>
                <div className="mb-2"><span className="font-semibold">Owner:</span> {userMap[selectedHotel.userId] ? `${userMap[selectedHotel.userId].firstName} ${userMap[selectedHotel.userId].lastName}` : "Unknown"}</div>
                <div className="mb-2"><span className="font-semibold">Description:</span></div>
                <div className="whitespace-pre-line border p-2 rounded bg-gray-100 mb-2">
                  {selectedHotel.description}
                </div>
                <div className="mb-2"><span className="font-semibold">Facilities:</span> {selectedHotel.facilities?.join(", ")}</div>
                <div className="mb-2"><span className="font-semibold">Last Updated:</span> {selectedHotel.lastUpdated ? new Date(selectedHotel.lastUpdated).toLocaleString() : "N/A"}</div>
              </div>
            </div>
          )}
        </>
      )}
      {tab === "users" && (
        <>
          <table className="min-w-full border mb-8">
            <thead>
              <tr>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Role</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user: any) => (
                <tr key={user._id}>
                  <td className="border px-4 py-2">{user.firstName} {user.lastName}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.role}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      onClick={() => setSelectedUser(user)}
                    >
                      View Details
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      onClick={() => deleteUserMutation.mutate(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Modal for user details */}
          {selectedUser && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
                  onClick={() => setSelectedUser(null)}
                >
                  &times;
                </button>
                <h2 className="text-2xl font-bold mb-2">{selectedUser.firstName} {selectedUser.lastName}</h2>
                <div className="mb-2"><span className="font-semibold">Email:</span> {selectedUser.email}</div>
                <div className="mb-2"><span className="font-semibold">Role:</span> {selectedUser.role}</div>
                <div className="mb-2"><span className="font-semibold">User ID:</span> {selectedUser._id}</div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard; 