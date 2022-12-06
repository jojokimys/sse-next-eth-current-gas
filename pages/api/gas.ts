// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

const currentGasFee = async () => {
  const provider = new ethers.providers.EtherscanProvider("mainnet", process.env.ETHERSCAN_KEY || "");
  try {
    return (await provider.getGasPrice()).toNumber();
  } catch (e) {
    return -1000000000;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  setInterval(async function () {
    const gas = await currentGasFee();
    res.write("data: " + gas);
    res.flush();
  }, 3000);
}
