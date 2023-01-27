import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { CONTRACT_dNFT } from "../consts/contract";
import dNFTABI from "../abi/dNFT.json";
import { useState } from "react";
import TextInput from "./TextInput";
import { normalize, parseEther } from "../utils/currency";
import { round, floor } from "../utils/currency";
import PopupContent from "./PopupContent";
import MaxButton from "./MaxButton";
import Divider from "./PopupDivider";
import Table from "./PopupTable";
import Row from "./PopupTableRow";
import useNftImage from "../hooks/useNftImage";
import NftSelector from "./NftSelector";
import useNft from "../hooks/useNft";

export default function Move({ nft, onClose, setTxHash }) {
  const [dyad, setDyad] = useState(0);
  const [selectedNFT, setSelectedNFT] = useState(null);

  const { nftImage } = useNftImage(nft);
  const { nft: selected } = useNft(selectedNFT);

  const { config } = usePrepareContractWrite({
    addressOrName: CONTRACT_dNFT,
    contractInterface: dNFTABI["abi"],
    functionName: "move",
    // TODO: get from nft
    args: [selectedNFT, nft.tokenId, parseEther(dyad)],
  });

  const { write } = useContractWrite({
    ...config,
    onSuccess: (data) => {
      onClose();
      setTxHash(data?.hash);
    },
  });

  return (
    <PopupContent
      title="Send DYAD"
      btnText="Send"
      onClick={() => {
        write?.();
        onClose();
      }}
      isDisabled={!write || !selectedNFT}
      image={nftImage}
      nft={nft}
    >
      <Divider />
      <div className="flex flex-col items-center gap-2">
        <div className="w-full px-4 pt-2">
          <Table>
            <Row
              label="This dNFT Balance"
              unit="DYAD"
              _old={round(normalize(nft.deposit), 2)}
              _new={round(normalize(nft.deposit) + parseFloat(dyad), 2)}
            />
            <Row
              label="My dNFT Balance"
              unit="DYAD"
              _old={round(normalize(selected.deposit), 2)}
              _new={round(normalize(selected.deposit) - parseFloat(dyad), 2)}
            />
          </Table>
        </div>
        <NftSelector
          dropSize={8}
          selectedNFT={selectedNFT}
          setSelectedNFT={setSelectedNFT}
        />
        <div className="flex gap-2 items-center">
          <div>
            <TextInput
              value={dyad}
              onChange={(v) => setDyad(v)}
              placeholder={0}
              type="number"
            />
          </div>
          <div className="flex flex-col items-end">
            <div className="flex">
              <div className="rhombus" />
              <div>DYAD</div>
            </div>
            <div className="flex gap-2 items-center justify-center">
              <div className="text-[#737E76]">
                Balance:{round(normalize(nft.deposit), 2)}
              </div>
              <MaxButton
                onClick={() => setDyad(floor(normalize(nft.deposit), 2))}
              />
            </div>
          </div>
        </div>
      </div>
    </PopupContent>
  );
}