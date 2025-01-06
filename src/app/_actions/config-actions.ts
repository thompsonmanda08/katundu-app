"use server";

import { APIResponse, OptionItem } from "@/lib/types";
import { deleteSession, verifySession } from "@/lib/session";
import apiClient from "@/lib/api-config";
import { redirect } from "next/navigation";

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
 * Checks if the user is authenticated. If not, redirects to the home page.
 *
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating the authentication status.
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const { isAuthenticated } = await getAuthSession();
  if (!isAuthenticated) redirect("/");
  return isAuthenticated;
};

/**
 * Fetches a list of universities.
 *
 * @returns {Promise<APIResponse | OptionItem[]>} A promise that resolves to an array of universities or an APIResponse object in case of failure.
 */
export async function getUniversities(): Promise<APIResponse | OptionItem[]> {
  try {
    const res = await apiClient.get(`data/universities`);
    return res.data?.data?.universities as OptionItem[];
  } catch (error: Error | any) {
    console.error(error?.response);
    return [];
  }
}

/**
 * Fetches a filtered list of countries, optionally by page.
 *
 * @param {number} [page=2] - The page number for fetching countries.
 * @returns {Promise<APIResponse | OptionItem[]>} A promise that resolves to an array of countries or an APIResponse object in case of failure.
 */
export async function getCountries(
  page: number = 2
): Promise<APIResponse | OptionItem[]> {
  try {
    const res = await apiClient.get(`data/countries?page=${page}`);

    const response = res.data?.data?.countries.filter((country: any) => {
      return country.name.toLowerCase().includes("zambia");
    });

    return response as OptionItem[];
  } catch (error: Error | any) {
    console.error(error?.response);
    return [];
  }
}

/**
 * Fetches a list of user roles.
 *
 * @returns {Promise<APIResponse | OptionItem[]>} A promise that resolves to an array of user roles or an APIResponse object in case of failure.
 */
export async function getUserRoles(): Promise<APIResponse | OptionItem[]> {
  try {
    const res = await apiClient.get(`data/roles`);
    return res.data?.data?.roles as OptionItem[];
  } catch (error: Error | any) {
    console.error(error?.response);
    return [];
  }
}

/**
 * Fetches a list of room types.
 *
 * @returns {Promise<APIResponse | OptionItem[]>} A promise that resolves to an array of room types or an APIResponse object in case of failure.
 */
export async function getRoomTypes(): Promise<APIResponse | OptionItem[]> {
  try {
    const res = await apiClient.get(`data/rooms`);

    return res.data?.data?.roomTypes as OptionItem[];
  } catch (error: Error | any) {
    console.error(error?.response);
    return [];
  }
}
