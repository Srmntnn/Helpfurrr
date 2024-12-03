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
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

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
          title: "All dogs",
          url: "/dashboard/all-dogs",
        },
        {
          title: "Post Dogs Requests",
          link: "/dashboard/postingdogs",
        },
        {
          title: "Approved Dogs",
          link: "/dashboard/approvedDogs",
        },
        {
          title: "Rejected Dogs",
          link: "#",
        },
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
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SearchForm />
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
      <SidebarRail />
    </Sidebar>
  );
}
