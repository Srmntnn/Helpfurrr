import { Helmet } from "react-helmet";
import { styles } from "../../styles";
import { useState, useEffect } from "react";
import { GrPowerReset } from "react-icons/gr";
import CampaignViewer from "./CampaignViewer";
import { Button } from "@/components/button";
import { Link } from "react-router-dom";
import { MdOutlineOpenInNew } from "react-icons/md";
import { IoPawOutline } from "react-icons/io5";
import { MdOutlineVolunteerActivism } from "react-icons/md";

const CampaignComponent = () => {
  const [campaignData, setCampaignData] = useState([]);
  const [initialCampaignsData, setInitialCampaignsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/campaigns/get-all-campaigns`
        );
        if (!response.ok) {
          throw new Error("An error occurred while fetching campaigns.");
        }
        const data = await response.json();

        const campaignCategories = data.map((campaign) => ({
          ...campaign,
          campaignCategory: campaign.campaignCategory.toLowerCase(),
        }));

        setCampaignData(campaignCategories);
        setInitialCampaignsData(campaignCategories);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleReset = () => {
    setSearchTerm("");
    setCampaignData(initialCampaignsData.slice());
    setSortBy(""); // Reset sorting when resetting search
  };

  const handleSort = (event) => {
    setSortBy(event.target.value);
  };

  const filteredCampaigns = searchTerm
    ? campaignData.filter(
        (campaign) =>
          campaign.name.toLowerCase().includes(searchTerm) ||
          campaign.campaignCategory.includes(searchTerm)
      )
    : campaignData;

  const sortedCampaigns = sortBy
    ? [...filteredCampaigns].sort((a, b) => {
        switch (sortBy) {
          case "category-asc":
            return a.campaignCategory.localeCompare(b.campaignCategory);
          case "category-desc":
            return b.campaignCategory.localeCompare(a.campaignCategory);
          case "name-asc":
            return a.name.localeCompare(b.name);
          case "name-desc":
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      })
    : filteredCampaigns;

  if (loading) return <p>Loading campaigns...</p>;

  return (
    <section className="w-full items-center justify-center gap-10 flex">
      <div className={`${styles.paddingX} max-w-screen-2xl justify-center`}>
        <Helmet>
          <title>HelpFurr | Campaigns</title>
          <meta
            name="description"
            content="Browse available donation campaigns."
          />
        </Helmet>
        <div className="bg-light-orange h-96 flex absolute left-0 right-0 flex-col items-center justify-center">
          <h1
            className={`${styles.heroHeadText} text-5xl text-secondary-orange font-bold text-center fredoka-bold`}
          >
            Available Donation Campaigns
          </h1>
          <p
            className={`${styles.heroSubText} text-secondary-brown text-center quicksand-regular`}
          >
            Browse the list of available campaigns
          </p>
          <p className="text-lg text-secondary-brown fredoka">
            ({sortedCampaigns.length} Available)
          </p>
        </div>
        <div className="pt-96">
          <div className="flex items-center justify-center my-16 sm:mx-16 h-12">
            {/* <select value={sortBy} onChange={handleSort} className="mb-4">
              <option value="">No Sorting</option>
              <option value="category-asc">Category Ascending</option>
              <option value="category-desc">Category Descending</option>
              <option value="name-asc">Name Ascending</option>
              <option value="name-desc">Name Descending</option>
            </select> */}
            <input
              type="text"
              placeholder="Search by campaign name or category"
              value={searchTerm}
              onChange={handleSearch}
              className="quicksand-regular px-4 border max-w-96 w-full h-full"
            />
            <button
              className="btn bg-main-orange rounded-tl-none rounded-bl-none text-light-orange quicksand-regular h-full flex"
              onClick={handleReset}
            >
              <GrPowerReset size={24} />
              <p className="sm:flex hidden">Reset</p>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6 w-full">
            {sortedCampaigns.length > 0 ? (
              sortedCampaigns.map((campaign, index) => (
                <CampaignViewer campaign={campaign} key={index} />
              ))
            ) : (
              <p className="text-center flex justify-center quicksand-semi-bold text-secondary-brown">Oops!... No campaigns available</p>
            )}
          </div>
        </div>
        <div className="w-full mx-auto mt-12 flex flex-col">
          <p className="fredoka-bold tracking-wider text-3xl text-secondary-brown text-center">
            Don't want to donate but still want to{" "}
            <span className="text-main-orange">Help</span>?
          </p>
          <div className="flex justify-center mt-6 gap-3">
            <div className="w-full">
              <div className="flex gap-4 justify-center">
                <div className="w-full border max-w-sm hover:border-main-orange rounded-md transition duration-300 cursor-pointer px-6 py-4">
                  <div className="flex items-center gap-3 justify-between">
                    <div className="p-4 bg-light-orange w-fit rounded-lg">
                      <IoPawOutline className="text-main-orange" />
                    </div>

                    <div>
                      <p className="flex quicksand-semi-bold text-secondary-brown">
                        Adopt
                      </p>
                    </div>
                    <div>
                      <Link
                        to="/adoption"
                        onClick={() => {
                          setActive("");
                          window.scrollTo(0, 0);
                        }}
                      >
                        <MdOutlineOpenInNew className="hover:text-main-orange transition duration-300" />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="w-full border max-w-sm hover:border-main-orange rounded-md transition duration-300 cursor-pointer px-6 py-4">
                  <div className="flex items-center gap-3 justify-between">
                    <div className="p-4 bg-light-orange w-fit rounded-lg">
                      <MdOutlineVolunteerActivism className="text-main-orange" />
                    </div>

                    <div>
                      <p className="flex quicksand-semi-bold text-secondary-brown">
                        Volunteer
                      </p>
                    </div>
                    <div>
                      <Link
                        to="/volunteer"
                        onClick={() => {
                          setActive("");
                          window.scrollTo(0, 0);
                        }}
                      >
                        <MdOutlineOpenInNew className="hover:text-main-orange transition duration-300" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CampaignComponent;

{
  /* <div className="mt-8">
          <h1>Donations</h1>
          <div className="rounded-md border my-12">
            {loading ? (
              <Loader className="mx-auto">Loading dogs...</Loader>
            ) : error ? (
              <p>Error: {error}</p>
            ) : campaignData.length === 0 ? (
              <p>No dogs found for this user.</p>
            ) : (
              <div>
                <div className="relative w-full overflow-auto quicksand-regular">
                  <table className="table">
                    <thead className="[&_tr]:border-b ">
                      <tr className="quicksand-bold">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                          #
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                          Dog Profile
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                          Dog Age
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                          Dog Gender
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                          Dog Condition
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                          Status
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                          Other Information
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                          Owner Information
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                          Dog QR
                        </th>
                      </tr>
                    </thead>
                    {campaignData.map((campaignData, index) => (
                      <tbody
                        key={campaignData.id}
                        className="[&_tr:last-child]:border-1 hover:[&_tr:last-child]:bg-light-orange cursor-pointer hover:[&_tr:last-child]:text-main-orange transition duration-300"
                      >
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted hover: ">
                          <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 ">
                            {index + 1} {/* Display index + 1 
                          </td>

                          <td className="">
                            <div className="flex items-center gap-3">
                              <div className="avatar">
                                <div className="mask mask-squircle h-12 w-12">
                                  <img
                                    src={campaignData.image[0]}
                                    alt={campaignData.name}
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="font-bold">
                                  {campaignData.name}
                                </div>
                                <div className="text-sm opacity-50">
                                  {campaignData.shelter}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                            {campaignData.age}
                          </td>
                          <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                            {campaignData.gender}
                          </td>
                          <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                            {Array.isArray(campaignData.budgetUsage) &&
                            campaignData.budgetUsage.length > 0 ? (
                              <div>
                               
                                <p>
                                  Total Cost:
                                  {campaignData.budgetUsage.reduce(
                                    (total, usage) =>
                                      total + parseFloat(usage.cost || 0),
                                    0
                                  )}
                                </p>
                             
                                {campaignData.budgetUsage.map(
                                  (usage, index) => (
                                    <div key={index}>
                                      <p>Item: {usage.item}</p>
                                      <p>Cost: {usage.cost}</p>
                                      <p>Date: {usage.date}</p>
                                    </div>
                                  )
                                )}
                              </div>
                            ) : (
                              <p>No budget usage available</p>
                            )}
                          </td>

                          <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                            {campaignData.status}
                          </td>
                          <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                            <div className="flex flex-col capitalize">
                              <p>Vaccinated: {campaignData.vaccinated}</p>
                              <p>Adoption Urgency: {campaignData.urgent}</p>
                              <p>Neutered: {campaignData.neutered}</p>
                            </div>
                          </td>
                          <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                            <div className="flex flex-col">
                              <p>{campaignData.postedBy}</p>
                              <p>{campaignData.clientEmail}</p>
                              <p> {campaignData.phone}</p>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    ))}
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>  */
}
