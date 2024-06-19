import { currentUser } from "@/api/user";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: currentUser,
    networkMode: "offlineFirst",
  });

  const user = data?.data;

  return { user, isLoading };
};
