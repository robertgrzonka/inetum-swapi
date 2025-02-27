import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Person {
  name: string;
  height: string;
  birth_year: string;
}

const PersonDetails = () => {
  const { id } = useParams();
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const response = await axios.get(`https://swapi.dev/api/people/?search=${id}`);
        if (response.data.results.length > 0) {
          setPerson(response.data.results[0]);
        } else {
          setError("Character not found");
        }
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchPerson();
  }, [id]);

  if (loading) return <p className="text-center text-lg font-bold">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold">{person?.name}</h1>
      <p><strong>Height:</strong> {person?.height} cm</p>
      <p><strong>Birth Year:</strong> {person?.birth_year}</p>
    </div>
  );
};

export default PersonDetails;
