import { Helmet } from "react-helmet";
import { styles } from "../../styles";
import { useState, useEffect } from "react";
import { GrPowerReset } from "react-icons/gr";
import CampaignViewer from "./CampaignViewer";

const CampaignComponent = () => {
  const [campaignData, setCampaignData] = useState([]);
  const [initialCampaignsData, setInitialCampaignsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/campaigns/get-all-campaigns"
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
          <title>HelpFur | Campaigns</title>
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
            <select value={sortBy} onChange={handleSort} className="mb-4">
              <option value="">No Sorting</option>
              <option value="category-asc">Category Ascending</option>
              <option value="category-desc">Category Descending</option>
              <option value="name-asc">Name Ascending</option>
              <option value="name-desc">Name Descending</option>
            </select>
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
              <p className="oops-msg">Oops!... No campaigns available</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CampaignComponent;
