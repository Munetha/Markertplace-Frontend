import logo from "./logo.svg";
import "./App.css";
import NavBar from "./components/NavBar/NavBar";
import Form from "./components/Form/Form";
import NFTCard from "./components/NFTCard/NFTCard";
import Web3 from "web3";
import MarketplaceAbi from "./constants/MarketplaceAbi.json";
import NftAbi from "./constants/NftAbi.json";
import { useEffect, useState } from "react";
function App() {
  const [nfts, setNfts] = useState([]);
  useEffect(() => {
    getNfts();
  }, []);

  const getNfts = async () => {
    try {
      const MARKETPLACEADDRESS = "0xA96F69512C42a569C39B8123D3cC99F61539f065";
      const web3 = new Web3(window?.ethereum);
      const Marketplace = new web3.eth.Contract(
        MarketplaceAbi,
        MARKETPLACEADDRESS
      );
      const ids = await Marketplace.methods.getIds().call();

      if (!Array.isArray(ids)) {
        throw new Error("Received an unexpected response for ids");
      }

      const nftData = [];
      for (let i = 0; i < ids.length; i++) {
        let data = await Marketplace.methods.viewItem(i).call();
        if (!data.isSold & !data.isCancelled) {
          nftData.push(data);
        }
      }

      setNfts(nftData);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  };

  return (
    <div className="App">
      <NavBar />
      <Form />
      <br></br>
      <div>
        {" "}
        <h3>NFTS on Sale</h3>{" "}
      </div>
      <br></br>
      {nfts ? (
        nfts?.map((nft) => {
          console.log(nft.price);
          return (
            <NFTCard
              nft_address={nft.contractAddress}
              tokenId={nft.tokenId}
              price={nft.price}
            />
          );
        })
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default App;
