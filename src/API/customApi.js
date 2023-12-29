import axios from "axios";
import { toast } from "react-toastify";

export const customApi = async (endpoint, method = "GET", data = null) => {
  const apiUrl = `http://localhost:8081/${endpoint}`;
  try {
    const response = await axios({
      method,
      url: apiUrl,
      data,
    });
    try {
      return response;
    } catch (error) {
      toast.error("Errror, please try again");
    }
  } catch (error) {
    toast.error("Errror, please try again");
    console.error("Error in custom API request:", error);

    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
      toast.error(`Error: ${error.response.data.message}`);
    } else if (error.request) {
      console.error("No response received:", error.request);
      toast.error("No response received from the server");
    } else {
      console.error("Error setting up the request:", error.message);
      toast.error("Error setting up the request");
    }

    throw error; // Throw the error again to propagate it
  }
};
