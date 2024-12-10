import React, { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "./ui/label";
import { Input } from "./input";
import { Button } from "./button";

const EditProfile = ({ user }) => {
  const [name, setName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  const handleFileChange = (event) => {
    setProfilePicture(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("name", name);
    if (profilePicture) {
      formData.append("file", profilePicture);
    }

    try {
      const response = await axios.post("/api/updateUser ", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    }
  };

  return (
    <li>
      <Sheet>
        <SheetTrigger asChild>
          <button className="flex items-center gap-2">
            <FaRegUser />
            <div>
              <p>Profile</p>
            </div>
          </button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Profile</SheetTitle>
          </SheetHeader>
          <div className="mt-10 flex flex-col gap-3">
            <div>
              <img
                src={
                  user?.profilePicture ||
                  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                }
                alt="Profile"
                className="rounded-full max-w-40 mx-auto"
              />
              <span className="text-center flex justify-center quicksand-regular">
                <Label className="text-sm quicksand-regular">
                  Profile Picture
                </Label>
              </span>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="mt-2"
              />
            </div>
            <div className="gap-2 flex flex-col">
              <Label>Name</Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="gap-2 flex flex-col">
              <Label>Email Address</Label>
              <Input value={user?.email} disabled className="mt-2" />
            </div>
          </div>
          <SheetFooter className="mt-4">
            <SheetClose asChild>
              <Button
                className="bg-main-orange hover:text-main-brown hover:bg-light-orange quicksand-regular hover:outline outline-1 outline-main-orange"
                type="submit"
                onClick={handleSubmit}
              >
                Save changes
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </li>
  );
};

export default EditProfile;
