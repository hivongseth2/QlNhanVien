import axios from "axios";

export const customApi = async (endpoint, method = "GET", data = null) => {
  const apiUrl = `http://localhost:8081/${endpoint}`;
  console.log(apiUrl);
  try {
    const response = await axios({
      method,
      url: apiUrl,
      data,
      // You can add headers, authentication, etc. here if needed
    });

    // Assuming the API returns data in the 'data' property of the response
    return response;
  } catch (error) {
    // Handle error here
    console.error("Error in custom API request:", error);
    throw error; // You may choose to handle errors differently based on your needs
  }
};
