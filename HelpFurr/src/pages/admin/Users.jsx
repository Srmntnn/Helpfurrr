import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaTrash } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useAuthStore } from "../../store/authStore";
import { Input } from "@/components/input";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";


function Users() {
  const { user, isCheckingAuth, checkAuth } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const axiosSecure = useAxiosSecure();

  const { refetch, data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  const handleDeleteUser = (user) => {
    axiosSecure.delete(`/users/${user._id}`).then((res) => {
      alert(`${user.name} is removed from the database`);
      refetch();
    });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.role.toLowerCase().includes(searchTerm)
  );

  return (
    <section className="md:px-16 p-8">
      <div className="flex w-full gap-8 sm:flex-row flex-col">
        <div className="w-full px-16 py-8 rounded-lg shadow-md border border-secondary-orange">
          <h5 className="fredoka-bold tracking-wider text-main-brown sm:text-4xl text-xl">
            List of <span className="text-main-orange">Users</span>
          </h5>
          <h5 className="quicksand-regular">
            Total Users: {filteredUsers.length}
          </h5>
        </div>

        <div className="basis-1/3 py-8 rounded-lg border border-secondary-orange quicksand-regular shadow-md">
          {user ? (
            <div className="flex flex-col text-center w-full">
              <p className="text-main-orange font-bold capitalize text-lg">
                {user.name}
              </p>
              <p>{user.email}</p>
            </div>
          ) : (
            <p>Loading user data...</p>
          )}
        </div>
      </div>

      <motion.div
        className="w-full h-screen max-w-screen-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="rounded-md border my-12">
          <div className="flex p-4 items-center justify-between">
            <Input
              type="text"
              value={searchTerm}
              placeholder="Search Users"
              onChange={handleSearch}
              className="max-w-[280px] w-full"
            />
            {/* <div className="border p-3 rounded-md bg-main-orange text-light-orange quicksand-semi-bold">
              <button className="text-sm flex items-center gap-2 justify-between">Add User<FaPlus /></button>
            </div> */}
          </div>
          {filteredUsers.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <div>
              <div className="relative w-full overflow-auto quicksand-regular">
                <table className="table">
                  <thead className="[&_tr]:border-b">
                    <tr className="quicksand-bold text-main-orange">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        #
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        ID
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Name
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Email
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Role
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <tr
                        key={user._id}
                        className="border-b transition-colors hover:bg-muted/50"
                      >
                        <td className="p-4 align-middle">{index + 1}</td>
                        <td className="p-4 align-middle">{user._id}</td>
                        <td className="p-4 align-middle">{user.name}</td>
                        <td className="p-4 align-middle">{user.email}</td>
                        <td className="p-4 align-middle">{user.role}</td>
                        <td className="p-4 align-middle">
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="hover:text-light-orange"
                          >
                            <FaTrash className="text-red-500" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}

export default Users;
