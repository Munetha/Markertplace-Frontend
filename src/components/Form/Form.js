import { useState } from "react";
import axios from "axios";
import "./Form.css";
import Web3 from "web3";
import NftAbi from "../../constants/NftAbi.json";
import MarketplaceAbi from "../../constants/MarketplaceAbi.json";

function Form() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState("");
  const [url, setUrl] = useState("");
  const [fee, setFee] = useState("");
  const [royalityReciever, setRoyalityReciever] = useState("");
  const [to, setTo] = useState("");
  const [sNftAddress, setSNftAddress] = useState("");
  const [sTokenId, setSTokenId] = useState("");
  const [price, setPrice] = useState("");

  const mintNft = async () => {
    const NFTADDRESS = "0x0d09C4ab9201385FE2c189663686E7dE6daf27b5";
    const web3 = new Web3(window?.ethereum);
    const Nft = new web3.eth.Contract(NftAbi, NFTADDRESS);
    const accounts = await web3.eth.getAccounts();

    let tx = await Nft.methods
      .safeMint(royalityReciever, fee * 100, to, url)
      .send({ from: accounts[0] })
      .on("error", (err) => {
        console.log("error", err);
      })
      .on("receipt", async () => {
        alert("Yay NFT MInted");
      });
  };

  const onSell = async (e) => {
    e.preventDefault();
    const MARKETPLACEADDRESS = "0xA96F69512C42a569C39B8123D3cC99F61539f065";
    const web3 = new Web3(window?.ethereum);
    const accounts = await web3.eth.getAccounts();
    const Marketplace = new web3.eth.Contract(
      MarketplaceAbi,
      MARKETPLACEADDRESS
    );
    console.log("PRICE", price);
    console.log("TOKENID", sTokenId);
    console.log("sNftAddress", sNftAddress);
    const Nft = new web3.eth.Contract(NftAbi, sNftAddress);

    try {
      const tx = await Nft.methods
        .approve(MARKETPLACEADDRESS, sTokenId)
        .send({ from: accounts[0], gasLimit: "100000" })
        .on("error", (err) => {
          console.log(err);
        })
        .on("receipt", async () => {
          console.log("Approved");
          await Marketplace.methods
            .listItem(sNftAddress, sTokenId, price)
            .send({ from: accounts[0] })
            .on("error", (err) => {
              console.log(err);
            })
            .on("receipt", async () => {
              alert("Item Listed Pls Refresh");
            });
        });
    } catch (e) {
      console.log(e.message);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          method: "post",
          maxContentLength: "Infinity",
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: "a06ab8c97f7935c2c199",
            pinata_secret_api_key:
              "061c86a7026cc5ef98083708e548fc9ed4c50df281ac0b9fa87a2a565f452eb3",
          },
        }
      );
      const fileurl = "ipfs://" + response.data.IpfsHash;
      // Generate metadata and save to IPFS
      const metadata = {
        name: name,
        description: description,
        image: fileurl,
      };
      console.log(metadata);
      const response2 = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        metadata,
        {
          maxContentLength: "Infinity",
          headers: {
            "Content-Type": "application/json",
            pinata_api_key: "a06ab8c97f7935c2c199",
            pinata_secret_api_key:
              "061c86a7026cc5ef98083708e548fc9ed4c50df281ac0b9fa87a2a565f452eb3",
          },
        }
      );
      const actualUri = "ipfs://" + response2.data.IpfsHash;
      console.log(actualUri);
      setUrl(actualUri);
      mintNft();
    } catch (err) {
      console.log(err);
      alert("An error occured!" + err.message);
    }
  };

  return (
    <div>
      <form className="form" onSubmit={onSubmit}>
        <div>
          <h3>Provide data :</h3>
          <input
            type="text"
            value={name}
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
          <br></br>
        </div>
        <div>
          <input
            type="text"
            value={description}
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
          />{" "}
          <br></br>
        </div>
        <div>
          <input
            type="text"
            value={fee}
            placeholder="Fee in %"
            onChange={(e) => setFee(e.target.value)}
          />{" "}
          <br></br>
        </div>

        <div>
          <input
            type="text"
            value={royalityReciever}
            placeholder="Royality Reciever Address"
            onChange={(e) => setRoyalityReciever(e.target.value)}
          />{" "}
          <br></br>
        </div>
        <div>
          <input
            type="text"
            value={to}
            placeholder="Token Reciever Address"
            onChange={(e) => setTo(e.target.value)}
          />{" "}
          <br></br>
        </div>
        <div>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <br></br>
        </div>
        <button type="submit"> Mint Now </button>
      </form>
      <form className="form" onSubmit={onSell}>
        <div>
          <h3>SELL NFT:</h3>
        </div>
        <div>
          <input
            type="text"
            value={sNftAddress}
            placeholder="nft address 0x"
            onChange={(e) => setSNftAddress(e.target.value)}
          />{" "}
          <br></br>
        </div>
        <div>
          <input
            type="text"
            value={sTokenId}
            placeholder="Token Id"
            onChange={(e) => setSTokenId(e.target.value)}
          />{" "}
          <br></br>
        </div>

        <div>
          <input
            type="price"
            value={price}
            placeholder="price in WEI"
            onChange={(e) => setPrice(e.target.value)}
          />{" "}
          <br></br>
        </div>
        <button type="submit"> Sell Now </button>
      </form>
    </div>
  );
}

export default Form;
