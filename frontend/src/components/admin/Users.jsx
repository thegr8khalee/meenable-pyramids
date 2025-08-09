// src/components/Admin/Users.jsx
import React, { useEffect } from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import { Loader2 } from 'lucide-react';

const Users = () => {
  const { getAllUsers, users, isGettingUsers, hasMoreUsers, currentPageUsers } =
    useAdminStore();

  useEffect(() => {
    // This initial call to getAllUsers fetches the first page of users.
    // The store's logic handles setting the correct page and limit.
    getAllUsers();
  }, [getAllUsers]);

  const handleLoadMore = () => {
    // Call the getAllUsers action with the next page number
    // The store will handle appending the new users to the existing list.
    getAllUsers(currentPageUsers + 1);
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6 text-secondary font-[inter]">
        Registered Users
      </h2>

      {/* Loading indicator for the initial fetch */}
      {isGettingUsers && currentPageUsers === 0 && (
        <div className="flex justify-center items-center p-4 min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-primary">Loading users...</span>
        </div>
      )}

      {/* Hide table on initial load to prevent empty table flash */}
      {!isGettingUsers || currentPageUsers > 0 ? (
        <div className="overflow-x-auto w-full">
          <table className="table w-full text-left">
            <thead>
              <tr className="border-b-2 border-base-content">
                <th className="px-4 py-2 w-1/3">Name</th>
                <th className="px-4 py-2 w-1/3">Phone Number</th>
                <th className="px-4 py-2 w-1/3">Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-base-content">
                  <td className="px-4 py-2 font-medium">{user.username}</td>
                  <td className="px-4 py-2 text-base-content/70">
                    {user.phoneNumber}
                  </td>
                  <td className="px-4 py-2 text-base-content/70">
                    {user.email}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {/* "Load More" button for pagination */}
      {hasMoreUsers && (
        <div className="mt-6 flex justify-center">
          <button
            className="btn btn-outline btn-primary rounded-none shadow-none w-full"
            onClick={handleLoadMore}
            disabled={isGettingUsers}
          >
            {isGettingUsers && currentPageUsers > 0 ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              'Load More Users'
            )}
          </button>
        </div>
      )}

      {/* Show message if there are no users */}
      {!isGettingUsers && users.length === 0 && (
        <div className="text-center p-8 text-lg text-gray-500">
          No users found.
        </div>
      )}
    </div>
  );
};

export default Users;
