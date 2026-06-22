//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Crowdfunding{
    uint256 public campaignCount;

    struct Campaign{
        uint256 id;
        address creator;
        string title;
        string description;
        uint256 goal;
        uint256 amountRaised;
        uint256 deadline;
        bool withdrawn;
    }

    mapping(uint256 => Campaign) public campaigns;

    function createCampaign(string memory _title, string memory _description, uint256 _goal, uint256 _duration) public {
        require(_goal > 0, "Invalid Goal");

        campaignCount++;

        campaigns[campaignCount] = Campaign(
            campaignCount,
            msg.sender,
            _title,
            _description,
            _goal,
            0,
            block.timestamp + _duration,
            false
        );
    }

    function fundCampaign(uint256 _campaignId) public payable{
        Campaign storage campaign = campaigns[_campaignId];

        require(campaign.id > 0, "Campaign Not Found");
        require(block.timestamp < campaign.deadline, "Campaign Ended");
        require(msg.value > 0, "Send ETH");

        campaign.amountRaised += msg.value; 
    }

    function withdrawCampaign(
    uint256 _campaignId
) public {

    Campaign storage campaign =
        campaigns[_campaignId];

    require(
        campaign.id > 0,
        "Campaign Not Found"
    );

    require(
        msg.sender ==
        campaign.creator,
        "Not Creator"
    );

    require(
        campaign.amountRaised >=
        campaign.goal,
        "Goal Not Reached"
    );

    require(
        !campaign.withdrawn,
        "Already Withdrawn"
    );

    campaign.withdrawn = true;

    payable(
        campaign.creator
    ).transfer(
        campaign.amountRaised
    );
}
}