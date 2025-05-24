import api from "../api/client";

export type Reward = {
  id: string;
  label: string;
  icon: string;
  threshold: number;
};

export async function fetchRewards() {
  const { data } = await api.get<{
    defs: Reward[];
    claimed: string[];
  }>("/rewards");
  return data;
}

export async function redeemReward(id: string) {
  await api.post("/rewards/redeem", { rewardId: id });
}
