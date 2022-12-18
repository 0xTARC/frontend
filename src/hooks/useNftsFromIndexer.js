import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { CONTRACT_dNFT } from "../consts/contract";
import useRefetch from "./useRefetch";

/**
 * return the nfts from the indexer, sorted by xp in descending order
 */
export function useNftsFromIndexer(start, end) {
  const [nfts, setNfts] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const { refetch, trigger } = useRefetch();

  useEffect(() => {
    setIsLoading(true);
    supabase
      .from("nfts")
      .select("*")
      .eq("contractAddress", CONTRACT_dNFT)
      .order("xp", { ascending: false })
      .range(start, end)
      .then((res) => {
        setNfts(res.data);
        setIsLoading(false);
      })
      .catch((_) => {
        setIsLoading(false);
      });
  }, [start, end, trigger]);

  return { nfts, isLoading, refetch };
}

// return the number of nfts in the nfts table
export function useNftsCountFromIndexer() {
  const [count, setCount] = useState();

  useEffect(() => {
    supabase
      .from("nfts")
      .select("*", { count: "exact", head: true })
      .eq("contractAddress", CONTRACT_dNFT)
      .then((res) => {
        setCount(res.count);
      });
  }, []);

  return { count };
}
