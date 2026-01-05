import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
console.log(ethers.getDefaultProvider());

//variables
let signer = null;
let provider;
const connect_button = document.querySelector(".connect_button");
//const tx_button = document.querySelector(".sendTx");
const createContractButton = document.querySelector(".createContractButton");
const form = document.querySelector("form");
const displayButton = document.querySelector("#displayButtton");
const displayResultsFeild = document.querySelector(".result");
let metaMaskConected = false;
const contractAddress = "0x092Cc160A6B1f61198104802F6B4eCef29825B0B";
let readContract;
let writecontract;

//ABI
const abi = [
  "function store(uint256 _favNum)",
  "function display() view returns(uint256)",
];

connect_button.addEventListener("click", async () => {
  try {
    if (window.ethereum == null) {
      alert("MetaMask not installed; using read-only defaults");
      provider = ethers.getDefaultProvider();
    } else {
      provider = new ethers.BrowserProvider(window.ethereum);
      metaMaskConected = true;
      connect_button.innerText ='Connected'
      signer = await provider.getSigner();
      const address = await signer.getAddress();
      console.log("Got signer: " + address);
      console.log(`Balance: ${await provider.getBalance(address)}`);
      console.log(
        `Transaction Count: ${await provider.getTransactionCount(address)}`
      );
      console.log(metaMaskConected);
    }
  } catch (err) {
    console.error(err);
    alert(`Transaction failed with the error: ${err}`);
  }
});


//console.log(createContractButton);

createContractButton.addEventListener("click", async function () {
  if (metaMaskConected == true) {
    readContract = new ethers.Contract(contractAddress, abi, provider);
    writecontract = new ethers.Contract(contractAddress, abi, signer);
  } else {
    alert("Metamask is not connected");
  }
});

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  let value = parseInt(document.querySelector("#value").value);
  if (value < 0 || isNaN(value)) {
    alert("Enter a correct value.");
    return;
  } else {
    if (metaMaskConected) {
      document.querySelector("#storeButton").innerText = "Storing....";
      try {
        const store = await writecontract.store(value);

        const receipt = await store.wait();
        console.log(`Transaction Hash :  ${receipt.hash}`);
      } catch (err) {
        console.error(err);
        alert(`Transaction failed with the error: ${err}`);
      } finally {
        document.querySelector("#storeButton").innerText = "Store";
      }
    } else {
      alert("Metamask not connected");
    }
  }
});

displayButton.addEventListener("click", async function () {
  if (metaMaskConected == true) {
    displayButton.innerText = "Wait.....";

    try {
      let value = (await readContract.display()).toString();
      displayResultsFeild.innerHTML = `<h2 class = results> Stored value is ${value} </h2>`;
    } catch (err) {
      console.error(err);
      alert(`Transaction failed with the error: ${err}`);
    } finally {
      displayButton.innerText = "Display";
    }
  } else {
    alert("Metamask is not connected ");
  }
});
