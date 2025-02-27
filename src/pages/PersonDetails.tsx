import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

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
        const response = await axios.get(
          `https://swapi.dev/api/people/?search=${id}`
        );
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

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="min-h-screen flex items-center justify-center text-white p-6">
      <Link
        to="/"
        className="absolute top-5 left-5 text-black px-4 py-2 rounded-lg shadow-md hover:bg-yellow-400 transition"
      >
        ← Back to List
      </Link>
      <div className="bg-darkCard p-8 rounded-lg shadow-lg max-w-lg text-center border border-gray-800 bg-black/70">
        <h1 className="text-4xl font-extrabold mb-4">{person?.name}</h1>
        <p className="text-lg">
          <span className="font-bold text-gray-100">Height:</span>{" "}
          {person?.height} cm
        </p>
        <p className="text-lg">
          <span className="font-bold text-gray-100">Birth Year:</span>{" "}
          {person?.birth_year}
        </p>
      </div>
    </div>
  );
};

export default PersonDetails;
