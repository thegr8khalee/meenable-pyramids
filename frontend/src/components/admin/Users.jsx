// src/components/Admin/EditRecipePage.jsx
import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Loader2, Pen, PenIcon, Trash2 } from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';

const Users = () => {
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  const {
    getAllUsers,
    users,
    isGettingUsers,
  } = useAdminStore();

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

//   const navigate = useNavigate();

  if (isGettingUsers) {
    // Show a loading indicator while authentication status is being determined
    return <div className="text-center p-4">Loading Users...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6 text-secondary font-[inter]">
        Registered Users
      </h2>
      <div className="overflow-x-auto ">
        <table className="table w-full justify-between flex ">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((product) => (
              <tr key={product._id} className="">
                <td>{product.username}</td>
                <td className="">
                    {product.phoneNumber}
                </td>
                <td className="">
                    {product.email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
