import { NextPage } from "next";
import { useState } from "react";
import NeptuneMutualImg from "../public/NM.png";
import ConvertImg from "../public/convert.png";
import Image from "next/image";
const Web3 = require("web3");

declare let window: any;

const Home: NextPage = () => {
  let [valueOfNEP, setNEP] = useState("");
  let [valueOfBUSD, setBUSD] = useState("");

  let [isWalletConnected, setWalletConnected] = useState(false);
  let [walletDetails, setWalletDetails] = useState({
    account: "",
    chainId: 0,
    balance: "",
  });

  let [showModal, setShowModal] = useState(false);
  let [loader, setLoader] = useState(false);

  const handleInputChange = (
    event: React.FormEvent<HTMLInputElement>,
    currency: string
  ) => {
    let value: string = event?.currentTarget?.value;
    if (!value || !/^[0-9.]+$/.test(value)) {
      setBUSD("");
      setNEP("");
      return;
    }
    switch (currency) {
      case "NEP":
        setNEP(value);
        setBUSD((parseFloat(value) * 3).toFixed(2).toString());
        break;
      case "BUSD":
        setNEP((parseFloat(value) / 3).toFixed(2));
        setBUSD(value);
        break;
    }
  };

  const connectWallet = async () => {
    setLoader(true);
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
        let networkId = await window.web3.eth.net.getId();
        if (networkId !== 61) {
          let err = await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x61",
                chainName: "Binance Smart Chain Testnet",
                nativeCurrency: {
                  name: "Binance Coin",
                  symbol: "bnb",
                  decimals: 18,
                },
                rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
                blockExplorerUrls: ["https://testnet.bscscan.com/"],
              },
            ],
          });
          if (err) {
            alert("Please switch to Binance Network");
            setLoader(false);
            return false;
          }
        }
        let account: any = await window.web3.eth.getAccounts();
        let balance: any = await window.web3.eth.getBalance(account[0]);
        setWalletDetails({
          account:
            account.toString().substr(0, 4) +
            "..." +
            account.toString().substr(-4),
          balance,
          chainId: 61,
        });
        setLoader(false);
      } catch (e) {
        setLoader(false);
        return false;
      }
      setLoader(false);
      return true;
    }
    setLoader(false);
    return false;
  };

  const toggleShowModal = () => {
    setShowModal(!showModal);
  };

  const walletConnection = async () => {
    if (window.ethereum === undefined) {
      alert("MetaMask is not Installed!");
      return;
    } else {
      if (!isWalletConnected) {
        let connStatus: boolean = await connectWallet();
        if (!connStatus) {
          alert("Could Not Connect To MetaMask. Please Try Again.");
          return;
        }
      }

      setWalletConnected(!isWalletConnected);
    }
  };

  const renderModalBody = () => {
    let body: JSX.Element = isWalletConnected ? (
      <form>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Key</th>
              <th scope="col" className="text-end">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Account</td>
              <td className="text-end">{walletDetails.account}</td>
            </tr>
            <tr>
              <td>Chain Id</td>
              <td className="text-end">{walletDetails.chainId}</td>
            </tr>
            <tr>
              <td>Balance</td>
              <td className="text-end">{walletDetails.balance}</td>
            </tr>
          </tbody>
        </table>
        <div className="text-center">Wallet Details</div>
      </form>
    ) : (
      <div className="text-danger">
        Wallet not connected. Please click the {'"Connect Wallet"'} button below
      </div>
    );
    return body;
  };

  const renderLoader = () => {
    return loader ? (
      <div className="d-flex align-items-center ps-4">
        <div
          className="spinner-border ms-auto"
          role="status"
          aria-hidden="true"
        ></div>
      </div>
    ) : (
      ""
    );
  };

  const renderModal = () => {
    return (
      <div
        className="overlay"
        style={{ display: showModal ? "block" : "none" }}
      >
        <div className="position-absolute w-100 wallet-details-modal">
          <div className="modal-dialog w-50">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title" id="exampleModalLabel">
                  Wallet Details
                </h4>
                {renderLoader()}
                <button className="btn btn-close" onClick={toggleShowModal} />
              </div>
              <div className="modal-body">{renderModalBody()}</div>
              <div className="modal-footer float-left d-block container">
                <div className="row">
                  <button
                    type="button"
                    disabled={loader ? true : false}
                    className={
                      "btn col " +
                      (isWalletConnected ? "btn-danger" : "btn-primary")
                    }
                    onClick={walletConnection}
                  >
                    {isWalletConnected ? "Disconnect " : "Connect"}
                  </button>
                  {isWalletConnected ? (
                    ""
                  ) : (
                    <>
                      &nbsp;
                      <button
                        type="button"
                        className="btn btn-secondary col"
                        data-dismiss="modal"
                        onClick={toggleShowModal}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="bg-dark converter-app d-flex">
        <div className="w-25 m-auto text-center">
          <Image src={NeptuneMutualImg} alt={"Neptune Mutual"} />
          <div className="card card-outline-secondary">
            <div className="card-body">
              <h3 className="mb-0 text-center pb-4">Crypto Converter</h3>
              <form className="form w-75 m-auto" role="form">
                <fieldset>
                  <label className="mb-0 text-start w-100">NEP</label>
                  <div className="row mb-1">
                    <div className="col-lg-12">
                      <input
                        className="form-control"
                        id="name2"
                        name="name2"
                        type="text"
                        value={valueOfNEP}
                        onChange={(event: React.FormEvent<HTMLInputElement>) =>
                          handleInputChange(event, "NEP")
                        }
                      />
                    </div>
                  </div>
                  <br />
                  <Image src={ConvertImg} alt="" />
                  <label className="mb-0 text-start w-100">BUSD</label>
                  <div className="row mb-1">
                    <div className="col-lg-12">
                      <input
                        className="form-control"
                        id="email2"
                        name="email2"
                        type="text"
                        value={valueOfBUSD}
                        onChange={(event: React.FormEvent<HTMLInputElement>) =>
                          handleInputChange(event, "BUSD")
                        }
                      />
                    </div>
                  </div>
                  <button
                    className="btn float-right text-primary wallet-details pt-2"
                    type="button"
                    onClick={toggleShowModal}
                  >
                    <strong>Check Wallet Details</strong>
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
      {renderModal()}
    </div>
  );
};

export default Home;
