import { currentUser } from "@/api/user";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["currentUser"],
    queryFn: currentUser,
  });

  const user = data?.data;

  return { user, isLoading, refetch };
};
