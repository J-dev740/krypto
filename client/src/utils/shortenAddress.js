// import {contractAddress } from "./constants";
export const shortenAddress = (address) => `${address.slice(0, 5)}...${address.slice(address.length - 4)}`;