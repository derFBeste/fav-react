import "./App.css";
import "tachyons";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { matchSorter } from "match-sorter";

type UserFavorite = {
  id: string;
  name: string;
  email: string;
  team: string;
  animal: string;
  musicGenre: string;
  song: string;
  book: string;
  color: string;
  movie: string;
  drink: string;
  food: string;
  number: number;
  superHero: string;
};

// TODO: make query param
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const {
  location: { search },
} = window;

const defaultRecordCount = 1000;
// If there is a record count specified in the URL, use that.
// If not, use the default record count.
const upperLimit = search ? search.split("=")[1] : defaultRecordCount;

function App() {
  const [userFavorites, setUserFavorites] =
    useState<Array<UserFavorite> | null>(null);
  const [originalRecords, setOriginalRecords] =
    useState<Array<UserFavorite> | null>(null);

  const [selectedUser, setSelectedUser] = useState<UserFavorite | null>(null);

  useEffect(() => {
    supabase
      .from("user-favorites")
      .select(
        "id, name, email, team, animal, musicGenre, song, book, color, movie, drink, food, number, superHero"
      )
      .range(0, Number(upperLimit) - 1)
      .then(({ data, error }) => {
        setUserFavorites(data);
        setOriginalRecords(data);
      });
  }, []);

  function handleFilter(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    const filteredRecords =
      value && userFavorites
        ? matchSorter(userFavorites, value, {
            keys: Object.keys(userFavorites[0]),
          })
        : originalRecords;

    // items.filter(item => item.toLowerCase().includes(inputValue.toLowerCase()))

    setUserFavorites(filteredRecords);
  }

  function handleSort(colName: string) {
    const results = originalRecords?.sort((a, b) =>
      a.animal > b.animal ? 1 : -1
    );
    console.log(results);
    if (results) {
      setUserFavorites(results);
    }
  }

  return userFavorites ? (
    <div className="ma1">
      <div className="flex flex-row justify-between">
        <div>
          <h2 className="mv2">Favorite Things: React.js</h2>
          <h3 className="mv2">record count: {userFavorites.length}</h3>
        </div>
        <input
          className="h2"
          type="text"
          placeholder="search"
          onChange={handleFilter}
        />
      </div>
      <table className="f6 w-100" cellSpacing="0">
        <thead>
          <tr>
            {Object.keys(userFavorites[0]).map((colName) => (
              <th
                className="fw6 tl pa1 pointer bb black--90"
                key={colName}
                onClick={() => handleSort(colName)}
              >
                {colName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {userFavorites.map((userInfo) => (
            <tr
              key={`${userInfo.id}`}
              onClick={() => setSelectedUser(userInfo)}
              className="pointer dim"
            >
              {Object.values(userInfo).map((value) => (
                <td
                  className="pa1 tl bb bl black--90"
                  key={`${userInfo.id}_${value}`}
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tbody></tbody>
      </table>
    </div>
  ) : (
    <div className="ma1">Loading...</div>
  );
}

export default App;
