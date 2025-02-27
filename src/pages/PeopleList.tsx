import { useEffect, useState } from 'react';
import { fetchPeople } from '../api/swapi';
import { Link } from 'react-router-dom';

interface Person {
  name: string;
  gender: string;
  url: string;
}

const PeopleList = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchName, setSearchName] = useState('');
  const [filterGender, setFilterGender] = useState('');

  useEffect(() => {
    const getPeople = async () => {
      try {
        const data = await fetchPeople();
        setPeople(data);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    getPeople();
  }, []);

  const filteredPeople = people.filter((person) => {
    return (
      person.name.toLowerCase().includes(searchName.toLowerCase()) &&
      (filterGender === '' || person.gender === filterGender)
    );
  });

  if (loading) return <p className="text-center text-lg font-bold">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Star Wars Characters</h1>
      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <select
          value={filterGender}
          onChange={(e) => setFilterGender(e.target.value)}
        >
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="n/a">N/A</option>
        </select>
      </div>
      <ul>
        {filteredPeople.map((person) => (
          <li key={person.name} className="border-b py-2">
            <Link to={`/person/${encodeURIComponent(person.name)}`} className="text-blue-500 hover:underline">
              {person.name} - {person.gender}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PeopleList;
