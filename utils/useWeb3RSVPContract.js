import { useContractWrite } from "wagmi";

import contract from "./Web3RSVP.json";

export const web3RSVPContract = {
  address: contract.address,
  abi: contract.abi,
};

export function useWeb3RSVPContractWrite(options) {
  return useContractWrite({
    address: web3RSVPContract.address,
    abi: web3RSVPContract.abi,
    ...options,
  });
}
