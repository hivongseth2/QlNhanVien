import axios from "axios";

export const customApi = async (endpoint, method = "GET", data = null) => {
  const apiUrl = `http://localhost:8081/${endpoint}`;
  try {
    const response = await axios({
      method,
      url: apiUrl,
      data,
    });

    return response;
  } catch (error) {
    console.error("Error in custom API request:", error);
  }
};
