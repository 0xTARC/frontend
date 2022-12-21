import { useEffect, useState } from "react";
import usePoolBalance from "./usePoolBalance";
import useTotalDyadSupply from "./useTotalDyadSupply";
import { SAFETY_MODE_THRESHOLD } from "../consts/consts";

// return the current collatorization ration of the protocol
export default function useCR() {
  const [cr, setCR] = useState(SAFETY_MODE_THRESHOLD);

  const { poolBalance, refetch } = usePoolBalance();
  const { totalDyadSupply } = useTotalDyadSupply();

  useEffect(() => {
    if (poolBalance && totalDyadSupply) {
      let totalWithdrawn = totalDyadSupply - poolBalance;

      if (totalWithdrawn === 0) {
        totalWithdrawn = 1;
      }
      console.log("useCR: Fetching CR", cr);

      const _cr = (poolBalance / totalWithdrawn) * 100;
      setCR(isNaN(_cr) ? 0 : _cr);
    }
  }, [poolBalance, totalDyadSupply]);

  return { cr, refetch };
}
