import React, { useState, useContext, createContext } from "react";
import { ethers } from "ethers";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contractAddress = "0x3a8bc5bE48C83EA2297A1f5756A63be55f1e2a8F";
  const contractABI = [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "campaigns",
      outputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "string",
          name: "title",
          type: "string",
        },
        {
          internalType: "string",
          name: "description",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "target",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "deadline",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "amountCollected",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "image",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_owner",
          type: "address",
        },
        {
          internalType: "string",
          name: "_title",
          type: "string",
        },
        {
          internalType: "string",
          name: "_description",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "_target",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_deadline",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "_image",
          type: "string",
        },
      ],
      name: "createCampaign",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_id",
          type: "uint256",
        },
      ],
      name: "donateToCampaign",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "getCampaigns",
      outputs: [
        {
          components: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "string",
              name: "title",
              type: "string",
            },
            {
              internalType: "string",
              name: "description",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "target",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "deadline",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amountCollected",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "image",
              type: "string",
            },
            {
              internalType: "address[]",
              name: "donators",
              type: "address[]",
            },
            {
              internalType: "uint256[]",
              name: "donation",
              type: "uint256[]",
            },
          ],
          internalType: "struct MyContract.Campaign[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_id",
          type: "uint256",
        },
      ],
      name: "getDonators",
      outputs: [
        {
          internalType: "address[]",
          name: "",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "numberOfCampaigns",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];
  const contract = new ethers.Contract(contractAddress, contractABI, provider);
  console.log(contract);
  const [address, setAddress] = useState("0x90");
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // Call the function to get the address
    getConnectedAccountAddress();
  } else {
    console.error("MetaMask is not installed or not connected.");
  }

  // Access the user's Ethereum address
  async function getConnectedAccountAddress() {
    try {
      // Request permission to connect to MetaMask
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Get the connected account's address
      const accounts = await provider.listAccounts();
      setAddress(accounts[0]); // The first address in the array

      console.log("Connected MetaMask Address:", address);
      return address;
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  }
  const publishCampaign = async (form) => {
    try {
      const signer = provider.getSigner();
      const sign = await contract
        .connect(signer)
        .createCampaign(
          address,
          form.title,
          form.description,
          form.target,
          new Date(form.deadline).getTime(),
          form.image
        );
      console.log(sign);
    } catch (err) {
      console.error(err);
    }
  };

  const getCampaigns = async () => {
    try {
      const campaigns = await contract.getCampaigns();
      const parsedCampaings = campaigns.map((campaign, i) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: ethers.utils.formatEther(campaign.target.toString()),
        deadline: campaign.deadline.toNumber(),
        amountCollected: ethers.utils.formatEther(
          campaign.amountCollected.toString()
        ),
        image: campaign.image,
        pId: i,
      }));
      console.log("Data from the contract:", parsedCampaings);
      return parsedCampaings;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter(
      (campaign) => campaign.owner === address
    );

    return filteredCampaigns;
  };

  const donate = async (pId, amount) => {
    console.log(pId,parseInt(amount, 10) );
    console.log(pId, ethers.utils.parseUnits(amount, 18),)
    try {
      const signer = provider.getSigner();
      const data = await contract
        .connect(signer)
        // .donateToCampaign(pId, { value: ethers.utils.parseEther(amount)}); // Error aayena
        .donateToCampaign(pId,{ value:ethers.utils.parseEther(amount)}); //Error aayo
        // .donateToCampaign(pId,ethers.utils.parseEther(amount)); //Error aayo
      // const data = await contract.call('donateToCampaign', [pId], { value: ethers.utils.parseEther(amount)});
      console.log("Data from Donate", data);
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getDonations = async (pId) => {
    const donations = await contract.getDonators(pId);
    // const donations = await contract.call('getDonators', [pId]);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }

    return parsedDonations;
  };
  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        // address,
        // contract,
        // getCampaigns,
        // donate,
        // createCampaign: publishCampaign,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);

// import React, { useContext, createContext } from "react";

// import {
//   useAddress,
//   useContract,
//   useMetamask,
//   useContractWrite,
// } from "@thirdweb-dev/react";
// import { ethers } from "ethers";
// import { EditionMetadataWithOwnerOutputSchema } from "@thirdweb-dev/sdk";

// const StateContext = createContext();

// export const StateContextProvider = ({ children }) => {
// //   const { contract } = useContract(
// //     // "0xf59A1f8251864e1c5a6bD64020e3569be27e6AA9"
// //     "0x3a8bc5bE48C83EA2297A1f5756A63be55f1e2a8F"
// //   );
//   const { contract, isLoading } = useContract("0x3a8bc5bE48C83EA2297A1f5756A63be55f1e2a8F");
//   const { mutateAsync: createCampaign } = useContractWrite(
//     contract,
//     "createCampaign"
//   );

//   const address = useAddress();
//   const connect = useMetamask();

//   const publishCampaign = async (form) => {
//     try {
//       const data = await createCampaign([
//         address,
//         form.title,
//         form.description,
//         form.target,
//         new Date(form.deadine).getTime(),
//         form.image,
//       ]);
//       console.log("contract call success", data);
//     } catch (error) {
//       console.log("contract call failure", error);
//     }
//   };

//   return (
//     <StateContext.Provider
//       value={{address,
//         contract,
//         connect,
//         createCampaign:publishCampaign
//     }}>
//     {children}
//     </StateContext.Provider>)
// };

// export const useStateContext =() =>useContext(StateContext);

//   const { contract } = useContract('0x3a8bc5bE48C83EA2297A1f5756A63be55f1e2a8F');
//   const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');

//   const address = useAddress();
//   const connect = useMetamask();

//   const publishCampaign = async (form) => {
//     try {
//       const data = await createCampaign({
// 				args: [
// 					address, // owner
// 					form.title, // title
// 					form.description, // description
// 					form.target,
// 					new Date(form.deadline).getTime(), // deadline,
// 					form.image,
// 				],
// 			});

//       console.log("contract call success", data)
//     } catch (error) {
//       console.log("contract call failure", error)
//     }
//   }

//   const getCampaigns = async () => {
//     const campaigns = await contract.call('getCampaigns');

//     const parsedCampaings = campaigns.map((campaign, i) => ({
//       owner: campaign.owner,
//       title: campaign.title,
//       description: campaign.description,
//       target: ethers.utils.formatEther(campaign.target.toString()),
//       deadline: campaign.deadline.toNumber(),
//       amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
//       image: campaign.image,
//       pId: i
//     }));

//     return parsedCampaings;
//   }

//   const getUserCampaigns = async () => {
//     const allCampaigns = await getCampaigns();

//     const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

//     return filteredCampaigns;
//   }

//   const donate = async (pId, amount) => {
//     const data = await contract.call('donateToCampaign', [pId], { value: ethers.utils.parseEther(amount)});

//     return data;
//   }

//   const getDonations = async (pId) => {
//     const donations = await contract.call('getDonators', [pId]);
//     const numberOfDonations = donations[0].length;

//     const parsedDonations = [];

//     for(let i = 0; i < numberOfDonations; i++) {
//       parsedDonations.push({
//         donator: donations[0][i],
//         donation: ethers.utils.formatEther(donations[1][i].toString())
//       })
//     }

//     return parsedDonations;
//   }

//   return (
//     <StateContext.Provider
//       value={{
//         address,
//         contract,
//         connect,
//         createCampaign: publishCampaign,
//         getCampaigns,
//         getUserCampaigns,
//         donate,
//         getDonations
//       }}
//     >
//       {children}
//     </StateContext.Provider>
//   )
// }

// export const useStateContext = () => useContext(StateContext);
