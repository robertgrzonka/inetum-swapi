import axios from 'axios';

const BASE_URL = 'https://swapi.dev/api/people/';

export const fetchPeople = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching people:', error);
    throw error;
  }
};
