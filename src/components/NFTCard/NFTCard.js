import React, { useEffect, useState } from "react";
import Web3 from "web3";
import NftAbi from "../../constants/NftAbi.json";
import MarketplaceAbi from "../../constants/MarketplaceAbi.json";

function NFTCard({ nft_address, tokenId, price }) {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const getMetadata = async (nft_address, tokenId) => {
    const web3 = new Web3(window?.ethereum);
    if (!nft_address || !tokenId) {
      return;
    }
    const Nft = new web3.eth.Contract(NftAbi, nft_address);
    let tokenURI = await Nft.methods.tokenURI(tokenId).call();
    console.log("TOKEN URI: " + tokenURI);
    const reqestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
    const tokenURIResponse = await (await fetch(reqestURL)).json();
    console.log("tokenURIResponse", tokenURIResponse);
    const imageURI = tokenURIResponse.image;
    const imageURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/");
    setName(tokenURIResponse.name);
    setImage(imageURL);
    setDescription(tokenURIResponse.description);
  };

  const handleBuy = async () => {
    const MARKETPLACEADDRESS = "0xA96F69512C42a569C39B8123D3cC99F61539f065";
    const web3 = new Web3(window?.ethereum);
    const Marketplace = new web3.eth.Contract(
      MarketplaceAbi,
      MARKETPLACEADDRESS
    );
    const accounts = await web3.eth.getAccounts();
    await Marketplace.methods
      .buyItem(nft_address, tokenId)
      .send({ from: accounts[0], value: price })
      .on("receipt", async () => {
        alert("NFT Buyed");
      });
  };

  getMetadata(nft_address, tokenId);

  return (
    <div>
      <img src={image} alt="img" height="200px" width="200px"></img>

      <ul>
        <li> name: {name}</li>
        <li>nft_address:{nft_address}</li>
        <li>description: {description}</li>
        <li>tokenid:{tokenId}</li>
        <li>price: {price}</li>
        <l1>
          <button onClick={handleBuy}>Buy!</button>
        </l1>
      </ul>
    </div>
  );
}

export default NFTCard;
