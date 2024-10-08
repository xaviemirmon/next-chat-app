export const fetchData = async (url: string | URL | Request) => {
  const response = await fetch(url);

  // Check if the response is ok
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
};
