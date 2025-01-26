import { getCities } from "@/app/_actions/config-actions";
import {
  getAvailableDeliveries,
  getDeliveryDetails,
  getUserDeliveries,
} from "@/app/_actions/delivery-actions";
import { getUserProfile } from "@/app/_actions/profile-actions";
import { QUERY_KEYS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

export const useCities = (size: number = 72) =>
  useQuery({
    queryKey: [QUERY_KEYS.CITIES],
    queryFn: async () => await getCities(size),
    staleTime: Infinity,
  });

export const useAccountProfile = () =>
  useQuery({
    queryKey: [QUERY_KEYS.PROFILE],
    queryFn: async () => await getUserProfile(),
    staleTime: Infinity,
  });

export const useAvailableDeliveries = (
  city?: string,
  page?: number,
  size?: number
) =>
  useQuery({
    queryKey: [QUERY_KEYS.POSTS, city],
    queryFn: async () => await getAvailableDeliveries(city, page, size),
    staleTime: 30,
  });

export const useUserDeliveries = (page: number, size: number) =>
  useQuery({
    queryKey: [QUERY_KEYS.USER_POSTS],
    queryFn: async () => await getUserDeliveries(page, size),
    staleTime: Infinity,
  });

export const useDeliveryDetails = (ID: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.POSTS, ID],
    queryFn: async () => await getDeliveryDetails(ID),
    staleTime: Infinity,
  });
