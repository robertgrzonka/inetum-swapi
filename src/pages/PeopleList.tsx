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
        const data = await fetchPeople();
        setPeople(data);
        setFilteredPeople(data);
      } catch (err) {
        setError('Failed to fetch data');
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
  if ( error ) return <p className="text-red-500 text-center">{ error }</p>;
  
  const options = ['all', 'male', 'female', 'n/a', 'hermaphrodite'];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Star Wars Characters</h1>

      {/* Filtry */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full"
        />
        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          className="border border-gray-300 p-2 rounded"
        >
          { options.map( options => (
            <option key={ options } value={ options }>{ options }</option>
          ) ) }
        </select>
      </div>

      {/* Tabela */}
      <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-800">
          <tr>
            <th
              className="p-3 text-left cursor-pointer hover:bg-gray-300 transition"
              onClick={() => {
                setSortKey('name');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
            >
              Name {sortKey === 'name' ? (sortOrder === 'asc' ? '⬆' : '⬇') : ''}
            </th>
            <th
              className="p-3 text-left cursor-pointer hover:bg-gray-300 transition"
              onClick={() => {
                setSortKey('gender');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
            >
              Gender {sortKey === 'gender' ? (sortOrder === 'asc' ? '⬆️' : '⬇️') : ''}
            </th>
            <th
              className="p-3 text-left cursor-pointer hover:bg-gray-300 transition"
              onClick={() => {
                setSortKey('films');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
            >
              Films {sortKey === 'films' ? (sortOrder === 'asc' ? '⬆️' : '⬇️') : ''}
            </th>
            <th className="p-3 text-left">Details</th>
          </tr>
        </thead>
        <tbody>
          {filteredPeople.map((person) => (
            <tr key={person.name} className="border-b hover:bg-gray-100 transition">
              <td className="p-3">{person.name}</td>
              <td className="p-3">{person.gender}</td>
              <td className="p-3">{person.films.length} films</td>
              <td className="p-3">
                <Link
                  to={`/person/${encodeURIComponent(person.name)}`}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                >
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
