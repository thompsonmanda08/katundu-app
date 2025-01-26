"use server";

import { APIResponse, OptionItem } from "@/lib/types";
import { deleteSession, verifySession } from "@/lib/session";
import apiClient from "@/lib/api-config";

/**
 * Retrieves the current authentication session.
 *
 * @returns {Promise<any>} A promise that resolves to the session object if the session is valid.
 */

export const getAuthSession = async (): Promise<any> => await verifySession();

/**
 * Revokes the current authentication session by deleting it.
 *
 * @returns {Promise<void>} A promise that resolves when the session is deleted.
 */
export const revokeAccessToken = async (): Promise<void> => deleteSession();

/**
 * Fetches a list of cities from the API.
 *
 * @param {number} [size=72] - The number of cities to fetch.
 * @param {number} [page=1] - The page number of cities to fetch.
 * @returns {Promise<APIResponse|OptionItem[]>} A promise that resolves to an APIResponse object containing the fetched cities or an array of OptionItem objects.
 */
export async function getCities(
  size: number = 72,
  page: number = 1
): Promise<APIResponse | OptionItem[]> {
  try {
    const res = await apiClient.get(`/data/districts?size=${size}`, {});

    const response = res.data?.data?.districts || res.data?.data?.provinces;

    return [...response] as OptionItem[] | [];
  } catch (error: Error | any) {
    console.error(error?.response);
    return [];
  }
}

// export async function getCities(
//   countryCISO: string = "ZM"
// ): Promise<APIResponse | OptionItem[]> {
//   try {
//     const res = await apiClient.get(
//       `https://api.countrystatecity.in/v1/countries/${countryCISO}/cities`,
//       {
//         headers: {
//           "X-CSCAPI-KEY": process.env.COUNTRY_CITY_STATE_API_KEY,
//         },
//       }
//     );

//     const response = res.data;

//     return [...response] as OptionItem[] | [];
//   } catch (error: Error | any) {
//     console.error(error?.response);
//     return [];
//   }
// }
