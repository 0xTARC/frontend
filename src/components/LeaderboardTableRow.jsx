import { dNFT_PRICE, RANDOM_IMAGES } from "../consts/consts";
import useFilterAddress from "../hooks/useFilterAddress";
import useIdToOwner from "../hooks/useIdToOwner";
import { addressSummary } from "../utils/address";
import { formatUSD, round } from "../utils/currency";
import { depositRatio } from "../utils/stats";
import Button from "./Button";
import LoadingInplace from "./LoadingInplace";

export default function LeaderboardTableRow({
  isOneLiquidatable,
  nft,
  rank,
  filter,
}) {
  const { owner: address } = useIdToOwner(nft.id);
  const { ensName, isMatching, isLoading } = useFilterAddress(address, filter);

  function renderLiquidateBtn() {
    if (isOneLiquidatable) {
      if (nft.deposit < 0) {
        return (
          <td className="w-[4rem]">
            <Button style="w-[6rem]">Liquidate</Button>
          </td>
        );
      }
      return <td></td>;
    }
  }

  return (
    <>
      {isMatching && (
        <tr style={{ border: "1px solid #3A403C" }}>
          <td>
            <LoadingInplace isLoading={isLoading} style="w-[40px]" />
            <img
              className="w-10 h-10"
              src={RANDOM_IMAGES[rank % RANDOM_IMAGES.length]}
              alt=""
            />
          </td>
          <td>#{rank}</td>
          <td>{nft.xp}</td>
          <td>{formatUSD(dNFT_PRICE)}</td>
          <td className="hidden md:table-cell">
            {round(nft.withdrawn / 10 ** 18, 2)}
          </td>
          <td className="hidden md:table-cell">
            {round(nft.deposit / 10 ** 18, 2)}
          </td>
          {renderLiquidateBtn()}
          <td className="hidden md:table-cell">
            {depositRatio(nft.withdrawn, nft.deposit)}%
          </td>
          <td>{ensName || addressSummary(address)}</td>
        </tr>
      )}
    </>
  );
}