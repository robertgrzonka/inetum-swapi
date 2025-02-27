import { useEffect, useState } from 'react';
import { fetchPeople } from '../api/swapi';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader'

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
  
    if (sortKey === 'films') {
      sortedData.sort((a, b) => a.films.length - b.films.length);
    } else {
      sortedData.sort((a, b) => (a[sortKey] < b[sortKey] ? -1 : 1));
    }
  
    if (sortOrder === 'desc') sortedData.reverse();
  
    setFilteredPeople(sortedData);
  }, [sortKey, sortOrder, people]);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-600 text-center text-lg font-bold bg-red-100 p-4 rounded-lg">{error}</p>;
  
  const options = ['all', 'male', 'female', 'n/a', 'hermaphrodite'];

  const handleSort = (key: 'name' | 'gender' | 'films') => {
    setSortKey(key);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const filterPeople = (person: Person) => {
    const matchesGender = genderFilter === 'all' || person.gender === genderFilter;
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase());
  
    return matchesGender && matchesSearch;
  };  

  return ( 
    <div className="max-w-4xl mx-auto p-6 min-h-screen ">
      <div className="text-center ">
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
          {options.map( options => (
            <option key={ options } value={ options }>{ options }</option>
          ) ) }
        </select>
      </div>

      <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-black/60 shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-black text-yellow-400">
          <tr>
          <th onClick={() => handleSort('name')} className="cursor-pointer sortable">Name {sortKey === 'name' ? (sortOrder === 'asc' ? '⬆' : '⬇') : ''}</th>
          <th onClick={() => handleSort('gender')} className="cursor-pointer sortable">Gender {sortKey === 'gender' ? (sortOrder === 'asc' ? '⬆' : '⬇') : ''}</th>
          <th onClick={() => handleSort('films')} className="cursor-pointer sortable">Films {sortKey === 'films' ? (sortOrder === 'asc' ? '⬆' : '⬇') : ''}</th>
            <th className="p-3 text-center">Details</th>
          </tr>
        </thead>
        <tbody>
          {filteredPeople.filter(filterPeople).map((person) => (
            <tr key={person.name} className="border-b hover:bg-yellow-100 transition hover:text-black">
              <td className="p-3 text-center">{person.name}</td>
              <td className="p-3 text-center">{person.gender}</td>
              <td className="p-3 text-center">{person.films.length} films</td>
              <td className="p-3 text-center">
                <Link
                  to={`/person/${encodeURIComponent(person.name)}`}
                  className="w-[120px] bg-yellow-400 text-black px-4 py-2 rounded hover:bg-black hover:text-white shadow-md transition"
                >
                  Details
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
