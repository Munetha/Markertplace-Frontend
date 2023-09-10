import React, { useEffect } from "react";
import "./NavBar.css";
import { useState } from "react";
import Web3 from "web3";
import MarketplaceAbi from "../../constants/MarketplaceAbi.json";

function NavBar() {
  const [data, setdata] = useState({
    address: "",
    Balance: null,
  });
  const [btn, SetBtn] = useState(true);

  useEffect(() => {}, [data]);

  const getbalance = (address) => {
    // Requesting balance method
    window.ethereum
      .request({
        method: "eth_getBalance",
        params: [address, "latest"],
      })
      .then((balance) => {
        // Setting balance
        setdata({
          Balance: Web3.utils.fromWei(balance, "ether"),
        });
        SetBtn(false);
      });
  };
  const btnhandler = () => {
    // Asking if metamask is already present or not
    if (window.ethereum) {
      // res[0] for fetching a first wallet
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((res) => accountChangeHandler(res[0]));
    } else {
      alert("install metamask extension!!");
    }
  };

  const accountChangeHandler = (account) => {
    // Setting an address data
    setdata({
      address: account,
    });

    // Setting a balance
    getbalance(account);
  };

  const withdrawHandler = async () => {
    const MARKETPLACEADDRESS = "0xA96F69512C42a569C39B8123D3cC99F61539f065";
    const web3 = new Web3(window?.ethereum);
    const Marketplace = new web3.eth.Contract(
      MarketplaceAbi,
      MARKETPLACEADDRESS
    );
    const accounts = await web3.eth.getAccounts();
    await Marketplace.methods
      .withdrawBalance()
      .send({ from: accounts[0] })
      .on("receipt", async () => {
        alert("FUnds Withdrawn");
      });
  };
  return (
    <div className="navbar">
      <h1 className="marketplace">Market Place</h1>
      <h1 className="bal">{data.Balance ? data.Balance : <></>}</h1>
      <button className="button" onClick={btnhandler} disabled={!btn}>
        Connect metamask
      </button>
      <button className="withdraw" onClick={withdrawHandler}>
        {" "}
        Withdraw
      </button>
    </div>
  );
}

export default NavBar;
