import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FaTrash } from "react-icons/fa";

function Users() {
  const {
    refetch,
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8080/auth/users`);
      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }
      return res.json();
    },
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error fetching users</p>;
  }

  return (
    <div>
      <div>
        <h5>All Users</h5>
        <h5>Total Users: {users.length}</h5>
      </div>

      {/*table*/}
      <div>
        <div className="overflow-x-auto">
          <table className="table md:w-[870px]">
            {/* head */}
            <thead>
              <tr>
                <th>#</th>
                <th>Picture</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>{user.profilePicture}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Users;
