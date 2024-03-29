import { signERC2612Permit } from "eth-permit";
import { ethers, providers } from "ethers";
import { config } from "./config/config";
import { TokenABI, VaultABI } from "./constants/constants";

const main = async () => {

  const provider: any = new providers.WebSocketProvider(config.NODE_URL)
  const wallet = new ethers.Wallet(config.PRIVATE_KEY, provider);
  const senderAddress = await wallet.getAddress();

  console.log("SENDER ADDRESSS", senderAddress)
 const _value: any = ethers.utils.parseUnits("10", 18)

  const result = await signERC2612Permit(
    wallet,
    config.token,
    senderAddress,
    config.spender,
    _value
  );

  //create a token contract instance
  const tokenContract = new ethers.Contract(config.token,TokenABI , wallet);
 const {r, s, v, value } = await 
 tokenContract.permit(
      senderAddress,
      config.spender,
      config.value,
      result.deadline,
      result.v,
      result.r,
      result.s
    )

    const vault = new ethers.Contract(config.spender, VaultABI, wallet)

    const erc20PermitVaultTx = await vault.depositWithPermit(
      value,
      config.deadline,
      config.token,
      v,
      r,
      s , {
        gasLimit: 7000000
      }
      )

      console.log({
        erc20PermitVaultTx
      })


    // console.log({
    //   r,
    //   s,
    //   v,
    //   value

    // })
};

main()
