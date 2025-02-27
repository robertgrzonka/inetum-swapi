import { useEffect, useState } from "react";
import { fetchPeople } from "../api/swapi";
import { Link } from "react-router-dom";

interface Person {
  name: string;
  gender: string;
  films: string[];
  url: string;
}

const PeopleList = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getPeople = async () => {
      try {
        const data = await fetchPeople();
        setPeople(data);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    getPeople();
  }, []);

  if (loading) return <p className="text-center text-lg font-bold">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Star Wars Characters</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Gender</th>
            <th className="border p-2">Films</th>
            <th className="border p-2">Details</th>
          </tr>
        </thead>
        <tbody>
          {people.map((person) => (
            <tr key={person.name} className="text-center">
              <td className="border p-2">{person.name}</td>
              <td className="border p-2">{person.gender}</td>
              <td className="border p-2">{person.films.length} films</td>
              <td className="border p-2">
                <Link to={`/person/${encodeURIComponent(person.name)}`} className="text-blue-500 underline">
                  Show Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PeopleList;
