import * as React from "react";
import { SearchForm } from "@/components/search-form";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

import ImgLogo from "../assets/Helpfurrlogo.png";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useAuthStore } from "@/store/authStore";
import { handleError, handleSuccess } from "@/Utils/utils";
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Dashboard",
      link: "/dashboard",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
        },
        {
          title: "All Users",
          link: "/dashboard/users", // Change 'Link' to 'link' for consistency
        },
      ],
    },
    {
      title: "Dogs",
      url: "#",
      items: [
        {
          title: "All Dogs",
          url: "/dashboard/all-dogs",
        },
        {
          title: "Add Dog",
          url: "/dashboard/add-dog",
        },
        {
          title: "Post Dogs Requests",
          link: "/dashboard/postingdogs",
        },
        // {
        //   title: "Approved Dogs",
        //   link: "/dashboard/approvedDogs",
        // },
        // {
        //   title: "Rejected Dogs",
        //   link: "#",
        // },
        {
          title: "Adoption Requests",
          link: "/dashboard/adoptionrequest",
        },
        {
          title: "Adoption History",
          link: "/dashboard/adoptedhistory",
        },
      ],
    },

    {
      title: "Campaigns",
      url: "#",
      items: [
        {
          title: "All Campaigns",
          url: "/dashboard/all-campaigns",
        },
        {
          title: "Create Campaign",
          url: "/dashboard/create-campaign",
        },
      ],
    },

    {
      title: "Visit / Volunteer Request",
      url: "#",
      items: [
        {
          title: "All Volunteers",
          url: "/dashboard/all-volunteers",
        },
        {
          title: "Volunteer Request",
          url: "/dashboard/volunteer-request",
        },
        {
          title: "Approved Volunteer Request",
          url: "/dashboard/approved-volunteer-request",
        },
        {
          title: "Approved Rejected Request",
          url: "/dashboard/rejected-volunteer-request",
        },
      ],
    },
  ],
};

export function AppSidebar(props) {
  const { user, logout } = useAuthStore();

  const logoutHandler = () => {
    try {
      logout();
      handleSuccess("Logged Out Succesfull");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      handleError("Logout Unsuccessful");
    }
  };
  console.log(user);
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Avatar className="rounded-none">
          <AvatarImage src={ImgLogo} className="rounded-none" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </SidebarHeader>
      <SidebarContent>
        {/* Create a SidebarGroup for each parent item */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="quicksand-regular text-main-orange">
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="quicksand-regular">
                {item.items.map((subItem) => (
                  <SidebarMenuItem key={subItem.title}>
                    <SidebarMenuButton asChild isActive={subItem.isActive}>
                      {/* Use Link for navigation */}
                      <Link to={subItem.link || subItem.url}>
                        {subItem.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-16">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-md quicksand-bold capitalize">
                        {user?.name}
                      </p>
                      <p className="text-sm quicksand-regular">{user?.email}</p>
                    </div>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem className="cursor-pointer">
                  <button
                    className="quicksand-regular cursor-pointer"
                    onClick={logoutHandler}
                  >
                    Logout
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
