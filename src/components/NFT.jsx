import { useAccount, useContractReads } from "wagmi";
import { dNFT_PRICE } from "../consts/consts";
import { CONTRACT_dNFT } from "../consts/contract";
import abi from "../consts/abi/dNFTABI.json";
import { useEffect, useState } from "react";
import { formatUSD } from "../utils/currency";
import { calcRank, dyadMultiplier, xpCurve } from "../utils/stats";
import Mint from "./Mint";
import Popup from "./Popup";
import { useDisclosure } from "@chakra-ui/react";
import Button from "./Button";
import Sync from "./Sync";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";

export default function NFT({
  averageXP,
  index,
  borderColor,
  reload,
  setReload,
  xps,
}) {
  const TD = {
    borderTop: `1px solid ${borderColor ? borderColor : "black"}`,
    borderBottom: `1px solid ${borderColor ? borderColor : "black"}`,
  };

  const { address } = useAccount();

  const [rank, setRank] = useState();
  const [xp, setXP] = useState();
  const [dyad, setDyad] = useState();
  const [dyadBalance, setDyadBalance] = useState();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenSync,
    onOpen: onOpenSync,
    onClose: onCloseSync,
  } = useDisclosure();
  const {
    isOpen: isOpenDeposit,
    onOpen: onOpenDeposit,
    onClose: onCloseDeposit,
  } = useDisclosure();
  const {
    isOpen: isOpenWithdraw,
    onOpen: onOpenWithdraw,
    onClose: onCloseWithdraw,
  } = useDisclosure();

  const {} = useContractReads({
    contracts: [
      {
        addressOrName: CONTRACT_dNFT,
        contractInterface: abi,
        functionName: "tokenOfOwnerByIndex",
        args: [address, index],
      },
    ],
    onSuccess: (data) => {
      if (data && data[0]) {
        setRank(parseInt(data[0]._hex));
      }
    },
  });

  const { refetch } = useContractReads({
    contracts: [
      {
        addressOrName: CONTRACT_dNFT,
        contractInterface: abi,
        functionName: "xp",
        args: [rank],
      },
      {
        addressOrName: CONTRACT_dNFT,
        contractInterface: abi,
        functionName: "dyadMinted",
        args: [rank],
      },
      {
        addressOrName: CONTRACT_dNFT,
        contractInterface: abi,
        functionName: "virtualDyadBalance",
        args: [rank],
      },
    ],
    onSuccess: (data) => {
      if (data && data[0]) {
        setXP(parseInt(data[0]._hex));
        setDyad(parseInt(data[1]._hex));
        setDyadBalance(parseInt(data[2]._hex));
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [reload]);

  return (
    <>
      <tr>
        <td
          style={{
            borderLeft: `1px solid ${borderColor ? borderColor : "black"}`,
            ...TD,
          }}
        >
          #{calcRank(xps, xp)}
        </td>
        <td style={TD}> {formatUSD(dNFT_PRICE)} </td>
        <td style={TD}>{dyad && dyad / 10 ** 21} </td>
        <td style={TD}>
          <div className="flex flex-col text-s" style={{ color: borderColor }}>
            <div>
              {dyadMultiplier(dNFT_PRICE, dNFT_PRICE, xp, averageXP)}x/
              {1 / dyadMultiplier(dNFT_PRICE, dNFT_PRICE, xp, averageXP)}x
            </div>
            <div className="w-[5rem]">
              {Math.round(xpCurve(1) * 10000) / 10000}x XP
            </div>
          </div>
        </td>
        <td style={TD}>
          <Button onClick={onOpen}>mint</Button>
        </td>
        <td style={TD}>{dyadBalance && dyadBalance / 10 ** 21}</td>
        <td style={TD}>
          <Button onClick={onOpenDeposit}>deposit</Button>
        </td>
        <td style={TD}>
          <Button onClick={onOpenWithdraw}>withdraw</Button>
        </td>
        <td style={TD}>{xp && xp}</td>
        <td
          style={{
            borderRight: `1px solid ${borderColor ? borderColor : "black"}`,
            ...TD,
          }}
        >
          <Button onClick={onOpenSync}>sync</Button>
        </td>
      </tr>
      <Popup isOpen={isOpen} onClose={onClose}>
        <Mint
          tokenId={rank}
          reload={reload}
          setReload={setReload}
          onClose={onClose}
        />
      </Popup>
      <Popup isOpen={isOpenDeposit} onClose={onCloseDeposit}>
        <Deposit
          tokenId={rank}
          reload={reload}
          setReload={setReload}
          onClose={onCloseDeposit}
        />
      </Popup>
      <Popup isOpen={isOpenWithdraw} onClose={onCloseWithdraw}>
        <Withdraw
          tokenId={rank}
          reload={reload}
          setReload={setReload}
          onClose={onCloseWithdraw}
        />
      </Popup>
      <Popup isOpen={isOpenSync} onClose={onCloseSync}>
        <Sync address={address} tokenId={rank} />
      </Popup>
    </>
  );
}
