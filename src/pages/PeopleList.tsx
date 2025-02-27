import { useEffect, useState } from 'react';
import { fetchPeople } from '../api/swapi';
import { Link } from 'react-router-dom';

interface Person {
  name: string;
  gender: string;
  films: string[];
}

const PeopleList = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [sortKey, setSortKey] = useState<'name' | 'gender' | 'films'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const getPeople = async () => {
      try {
        setLoading(true);
        const data = await fetchPeople();
        setPeople(data);
        setFilteredPeople(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    getPeople();
  }, []);

  useEffect(() => {
    let sortedData = [...people];

    sortedData = sortedData.sort((a, b) => {
      let valueA: string | number | string[] = a[sortKey];
      let valueB: string | number | string[] = b[sortKey];

      if (sortKey === 'films') {
        valueA = a.films.length;
        valueB = b.films.length;
      }

      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredPeople(sortedData);
  }, [sortKey, sortOrder, people]);

  if (loading) return <p className="text-center text-lg font-bold">Loading...</p>;
  if (error) return <p className="text-red-600 text-center text-lg font-bold bg-red-100 p-4 rounded-lg">{error}</p>;
  
  const options = ['all', 'male', 'female', 'n/a', 'hermaphrodite'];

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
<div className="text-center tracking-wide">
  <img src="/sw-logo.png" alt="Star Wars" className="h-50 inline-block" /> 
</div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 text-yellow-400 p-2 rounded w-full"
        />
        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          className="border border-gray-300 text-yellow-400 p-2 rounded"
        >
          { options.map( options => (
            <option key={ options } value={ options }>{ options }</option>
          ) ) }
        </select>
      </div>

      <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-black/60 shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-black text-yellow-400">
          <tr>
            <th
              className="p-3 text-left cursor-pointer hover:bg-gray-300 hover:text-black transition"
              onClick={() => {
                setSortKey('name');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
            >
              Name {sortKey === 'name' ? (sortOrder === 'asc' ? '⬆' : '⬇') : ''}
            </th>
            <th
              className="p-3 text-left cursor-pointer hover:bg-gray-300 hover:text-black transition"
              onClick={() => {
                setSortKey('gender');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
            >
              Gender {sortKey === 'gender' ? (sortOrder === 'asc' ? '⬆️' : '⬇️') : ''}
            </th>
            <th
              className="p-3 text-left cursor-pointer hover:bg-gray-300 hover:text-black transition"
              onClick={() => {
                setSortKey('films');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
            >
              Films {sortKey === 'films' ? (sortOrder === 'asc' ? '⬆️' : '⬇️') : ''}
            </th>
            <th className="p-3 text-center">Details</th>
          </tr>
        </thead>
        <tbody>
          {filteredPeople.map((person) => (
            <tr key={person.name} className="border-b hover:bg-yellow-100 transition hover:text-black">
              <td className="p-3">{person.name}</td>
              <td className="p-3">{person.gender}</td>
              <td className="p-3">{person.films.length} films</td>
              <td className="p-3 text-center">
                <Link
                  to={`/person/${encodeURIComponent(person.name)}`}
                  className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-black hover:text-white shadow-md transition"
                >
                  Show Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default PeopleList;
