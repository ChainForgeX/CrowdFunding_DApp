import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CrowdfundingABI } from "./abi/CrowdfundingABI";

function Crowdfunding() {

    const contractAddress =
        "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [goal, setGoal] = useState("");
    const [duration, setDuration] = useState("");

    const [campaigns, setCampaigns] = useState([]);

    const createCampaign = async () => {

        const provider =
            new ethers.BrowserProvider(
                window.ethereum
            );

        const signer =
            await provider.getSigner();

        const contract =
            new ethers.Contract(
                contractAddress,
                CrowdfundingABI,
                signer
            );

        const tx =
            await contract.createCampaign(
                title,
                description,
                ethers.parseEther(goal),
                duration
            );

        await tx.wait();

        alert("Campaign Created");

        setTitle("");
        setDescription("");
        setGoal("");
        setDuration("");

        await loadCampaigns();
    };

    const loadCampaigns = async () => {

        const provider =
            new ethers.BrowserProvider(
                window.ethereum
            );

        const contract =
            new ethers.Contract(
                contractAddress,
                CrowdfundingABI,
                provider
            );

        const count =
            Number(
                await contract.campaignCount()
            );

        const items = [];

        for (let i = 1; i <= count; i++) {

            const campaign =
                await contract.campaigns(i);

            items.push({
                id:
                    campaign.id.toString(),

                creator:
                    campaign.creator,

                title:
                    campaign.title,

                description:
                    campaign.description,

                goal:
                    ethers.formatEther(
                        campaign.goal
                    ),

                amountRaised:
                    ethers.formatEther(
                        campaign.amountRaised
                    ),

                deadline:
                    new Date(
                        Number(campaign.deadline) * 1000
                    ).toLocaleString(),

                withdrawn:
                    campaign.withdrawn
            });
        }

        setCampaigns(items);
    };

    const fundCampaign = async (
        campaignId
    ) => {

        const amount = prompt(
            "Enter ETH Amount"
        );

        if (
            amount === null ||
            amount === ""
        ) {
            return;
        }

        const provider =
            new ethers.BrowserProvider(
                window.ethereum
            );

        const signer =
            await provider.getSigner();

        const contract =
            new ethers.Contract(
                contractAddress,
                CrowdfundingABI,
                signer
            );

        const tx =
            await contract.fundCampaign(
                campaignId,
                {
                    value:
                        ethers.parseEther(
                            amount
                        )
                }
            );

        await tx.wait();

        alert("Funding Successful");

        await loadCampaigns();
    };

    const withdrawCampaign = async (
        campaignId
    ) => {

        const provider =
            new ethers.BrowserProvider(
                window.ethereum
            );

        const signer =
            await provider.getSigner();

        const contract =
            new ethers.Contract(
                contractAddress,
                CrowdfundingABI,
                signer
            );

        const tx =
            await contract.withdrawCampaign(
                campaignId
            );

        await tx.wait();

        alert("Funds Withdrawn");

        await loadCampaigns();
    };

    useEffect(() => {

        const init = async () => {

            await window.ethereum.request({
                method:
                    "eth_requestAccounts"
            });

            await loadCampaigns();
        };

        init();

    }, []);

    return (
        <div>

            <h1>
                Crowdfunding DApp
            </h1>

            <hr />

            <h2>
                Create Campaign
            </h2>

            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) =>
                    setTitle(
                        e.target.value
                    )
                }
            />

            <br /><br />

            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) =>
                    setDescription(
                        e.target.value
                    )
                }
            />

            <br /><br />

            <input
                type="text"
                placeholder="Goal (ETH)"
                value={goal}
                onChange={(e) =>
                    setGoal(
                        e.target.value
                    )
                }
            />

            <br /><br />

            <input
                type="number"
                placeholder="Duration (86400 = 1 Day)"
                value={duration}
                onChange={(e) =>
                    setDuration(
                        e.target.value
                    )
                }
            />

            <br /><br />

            <button
                onClick={
                    createCampaign
                }
            >
                Create Campaign
            </button>

            <hr />

            <h2>
                Available Campaigns
            </h2>

            {
                campaigns.map(
                    (campaign) => (

                    <div
                        key={
                            campaign.id
                        }
                    >

                        <h3>
                            {campaign.title}
                        </h3>

                        <p>
                            {
                                campaign.description
                            }
                        </p>

                        <p>
                            Creator:
                            {" "}
                            {
                                campaign.creator
                            }
                        </p>

                        <p>
                            Goal:
                            {" "}
                            {
                                campaign.goal
                            }
                            {" "}
                            ETH
                        </p>

                        <p>
                            Raised:
                            {" "}
                            {
                                campaign.amountRaised
                            }
                            {" "}
                            ETH
                        </p>

                        <p>
                            Deadline:
                            {" "}
                            {
                                campaign.deadline
                            }
                        </p>

                        <p>
                            Withdrawn:
                            {" "}
                            {
                                campaign.withdrawn
                                    ? "Yes"
                                    : "No"
                            }
                        </p>

                        <button
                            onClick={() =>
                                fundCampaign(
                                    campaign.id
                                )
                            }
                        >
                            Fund Campaign
                        </button>

                        {" "}

                        <button
                            onClick={() =>
                                withdrawCampaign(
                                    campaign.id
                                )
                            }
                        >
                            Withdraw Funds
                        </button>

                        <hr />

                    </div>
                ))
            }

        </div>
    );
}

export default Crowdfunding;