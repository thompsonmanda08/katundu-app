"use server";

import { authenticatedService } from "@/lib/api-config";
import { APIResponse, Delivery, ShipmentRecord } from "@/lib/types";

/**
 * Fetches available deliveries for a given city and page number.
 *
 * @param {string} city - The city to fetch deliveries for.
 * @param {number} [page=1] - The page number to fetch deliveries for.
 * @param {number} [size=10] - The number of deliveries to fetch per page.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object containing the available deliveries.
 */
export async function getAvailableDeliveries(
  city?: string,
  page: number = 1,
  size: number = 10
): Promise<APIResponse> {
  try {
    const res = await authenticatedService({
      url: `/deliveries?page=${page}&size=${size}&city=${city}`,
    });
    const response = res.data;

    return {
      success: true,
      message: response?.message,
      data: response?.data,
      status: res.status,
    };
  } catch (error: Error | any) {
    console.error({
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data,
    });
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Something went wrong!",
      data: null,
      status: error?.response?.status || 500,
    };
  }
}

/**
 * Fetches deliveries for the currently logged in user.
 *
 * @param {number} [page=1] - The page number to fetch deliveries for.
 * @param {number} [size=10] - The number of deliveries to fetch per page.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object containing the user's deliveries.
 */
export async function getUserDeliveries(
  page: number = 1,
  size: number = 10
): Promise<APIResponse> {
  try {
    const res = await authenticatedService({
      url: `/user/deliveries?page=${page}&size=${size}`,
    });
    const response = res.data;

    return {
      success: true,
      message: response?.message,
      data: response?.data,
      status: res.status,
    };
  } catch (error: Error | any) {
    console.error({
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data,
    });
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Something went wrong!",
      data: null,
      status: error?.response?.status || 500,
    };
  }
}

/**
 * Creates a new delivery on the server.
 *
 * @param {Delivery} data - The delivery data to be sent to the server.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object containing the result of the delivery creation request.
 */
export async function createNewDelivery(data: Delivery): Promise<APIResponse> {
  try {
    const res = await authenticatedService({
      method: "POST",
      url: "/deliveries",
      data: data,
    });

    const response = res.data;

    return {
      success: true,
      message: response?.message,
      data: response?.data || null,
      status: res.status,
    };
  } catch (error: any) {
    console.error({
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data,
    });
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Something went wrong!",
      data: null,
      status: error?.response?.status || 500,
    };
  }
}

/**
 * Fetches a delivery by its ID.
 *
 * @param {string} deliveryId - The ID of the delivery to fetch.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object containing the delivery details or error details.
 */
export async function getDeliveryDetails(
  deliveryId: string
): Promise<APIResponse> {
  try {
    const res = await authenticatedService({
      url: `/deliveries/${deliveryId}`,
    });
    const response = res.data;

    return {
      success: true,
      message: response?.message,
      data: response?.data,
      status: res.status,
    };
  } catch (error: Error | any) {
    console.error({
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data,
    });
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Error fetching delivery!",
      data: null,
      status: error?.response?.status || 500,
    };
  }
}

/**
 * Updates the delivery details for a specific delivery.
 * Sends a PATCH request to the server with the updated delivery data.
 *
 * @param {string} deliveryId - The ID of the delivery to be updated.
 * @param {Partial<Delivery>} data - An object containing the delivery fields to update.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object containing
 * the result of the update operation or error details.
 */

export async function updateDeliveryDetails(
  deliveryId: string,
  data: Partial<ShipmentRecord>
): Promise<APIResponse> {
  try {
    const res = await authenticatedService({
      method: "PATCH",
      url: `/deliveries/${deliveryId}`,
      data,
    });
    const response = res.data;

    return {
      success: true,
      message: response?.message,
      data: response?.data,
      status: res.status,
    };
  } catch (error: Error | any) {
    console.error({
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data,
    });
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Update delivery failed!",
      data: null,
      status: error?.response?.status || 500,
    };
  }
}

export async function deleteDelivery(deliveryId: string): Promise<APIResponse> {
  try {
    const res = await authenticatedService({
      method: "DELETE",
      url: `/deliveries/${deliveryId}`,
    });
    const response = res.data;

    return {
      success: true,
      message: response?.message,
      data: response?.data,
      status: res.status,
    };
  } catch (error: Error | any) {
    console.error({
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data,
    });
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Delete delivery failed!",
      data: null,
      status: error?.response?.status || 500,
    };
  }
}

/**
 * Marks a delivery as picked up.
 *
 * @param {string} deliveryId - The ID of the delivery to pick up.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object containing the result of the pick up operation or error details.
 */
export async function pickUpDelivery(deliveryId: string): Promise<APIResponse> {
  try {
    const res = await authenticatedService({
      url: `/deliveries/${deliveryId}/pickup`,
    });
    const response = res.data;

    return {
      success: true,
      message: response?.message,
      data: response?.data,
      status: res.status,
    };
  } catch (error: Error | any) {
    console.error({
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data,
    });
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Error picking up delivery!",
      data: null,
      status: error?.response?.status || 500,
    };
  }
}

/**
 * Starts a delivery.
 *
 * @param {string} deliveryId - The ID of the delivery to start.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object containing the result of the start operation or error details.
 */
export async function startDelivery(deliveryId: string): Promise<APIResponse> {
  try {
    const res = await authenticatedService({
      url: `/deliveries/${deliveryId}/start`,
    });
    const response = res.data;

    return {
      success: true,
      message: response?.message,
      data: response?.data,
      status: res.status,
    };
  } catch (error: Error | any) {
    console.error({
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data,
    });
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Error picking up delivery!",
      data: null,
      status: error?.response?.status || 500,
    };
  }
}
