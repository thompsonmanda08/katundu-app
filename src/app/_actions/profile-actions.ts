"use server";

import { authenticatedService } from "@/lib/api-config";
import { APIResponse } from "@/lib/types";

// **************** PROFILE ACTIONS IS A SERVER COMPONENT THAT CONTAINS HELPER FUNCTIONS TO FETCH, MANIPULATE ETC ANYTHING TO DO WITH THE USERS PROFILES

/**
 * Fetches the user's profile using the authenticated service.
 * @returns {Promise<APIResponse>} A response object containing the profile data or error details.
 */

export async function getUserProfile(): Promise<APIResponse> {
  try {
    const res = await authenticatedService({
      method: "GET",
      url: "/user",
    });

    const response = res.data;

    return {
      success: true,
      message: response?.message,
      data: response?.data,
      status: res.status,
    };
  } catch (error: Error | any) {
    console.error(error?.response);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.response?.data?.data?.error ||
        "Oops! Something went wrong",
      data: null,
      status: error?.response?.status || 500,
    };
  }
}

/**
 * Updates the user's profile with the provided fields.
 * All parameters are optional, allowing for partial updates.
 *
 * @param {object} params - The profile fields to update.
 * @param {string} [params.firstName] - The user's first name.
 * @param {string} [params.lastName] - The user's last name.
 * @param {string} [params.email] - The user's email address.
 * @param {string} [params.phone] - The user's phone number.
 * @param {string} [params.universityId] - The user's university ID.
 * @param {string} [params.dob] - The user's date of birth.
 * @param {string} [params.isStudent] - Whether the user is a student ("true" or "false").
 * @returns {Promise<APIResponse>} A response object containing the update result or error details.
 */

export async function updateUserProfile(params: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  universityId?: string;
  dob?: string;
  isStudent?: string;
}): Promise<APIResponse> {
  try {
    const updateData = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );

    const res = await authenticatedService({
      method: "PATCH",
      url: "/user",
      data: updateData,
    });

    const response = res.data;

    return {
      success: true,
      message: response?.message,
      data: response?.data || null,
      status: res.status,
    };
  } catch (error: any) {
    console.error("Error updating user profile:", error?.response);

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.response?.data?.data?.error ||
        "Oops! Something went wrong",
      data: null,
      status: error?.response?.status || 500,
    };
  }
}

/**
 * Updates the user's profile picture.
 * Sends a FormData object to handle the file upload.
 *
 * @param {FormData} formData - The form data containing the image file.
 * @returns {Promise<APIResponse>} A response object containing the update result or error details.
 */
export async function updateProfilePicture(
  profilePicutre: FormData
): Promise<APIResponse> {
  try {
    const res = await authenticatedService({
      method: "PATCH",
      url: `/user/profile-picture`,
      data: profilePicutre,
      contentType: "multipart/form-data",
    });
    const response = res.data;
    return {
      success: true,
      message: response?.message,
      data: response?.data,
      status: res.status,
    };
  } catch (error: Error | any) {
    console.error("Error updating the profile picture: \n\n", error?.response);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.response?.data?.data?.error ||
        "Error occured while updaing the profile picture" + error,
      data: null,
      status: error?.response?.status || 500,
    };
  }
}
