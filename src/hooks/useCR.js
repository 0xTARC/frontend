import { useEffect, useState } from "react";
import usePoolBalance from "./usePoolBalance";
import useTotalDyadSupply from "./useTotalDyadSupply";
import { SAFETY_MODE_THRESHOLD } from "../consts/consts";

// return the current collatorization ration of the protocol
export default function useCR(newDeposit = 0) {
  const [cr, setCR] = useState(SAFETY_MODE_THRESHOLD);

  const { poolBalance, refetch: refetchPoolBalance } = usePoolBalance();
  const { totalDyadSupply, refetch: refetchTotalDyadSupply } =
    useTotalDyadSupply();

  function refetch() {
    refetchPoolBalance();
    refetchTotalDyadSupply();
  }

  useEffect(() => {
    if (poolBalance && totalDyadSupply) {
      let totalWithdrawn = totalDyadSupply - poolBalance;

      if (totalWithdrawn === 0) {
        totalWithdrawn = 1;
      }

      const _cr = ((poolBalance + newDeposit) / totalWithdrawn) * 100;
      setCR(isNaN(_cr) ? 0 : _cr);
    }
  }, [poolBalance, totalDyadSupply, newDeposit]);

  return { cr, refetch };
}
