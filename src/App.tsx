import "./App.css";
import "tachyons";
import { useCallback, useEffect, useState } from "react";
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

  const [selectedUser, setSelectedUser] = useState<UserFavorite | null>(null);

  const fetchRecords = useCallback(() => {
    supabase
      .from("user-favorites")
      .select(
        "id, name, email, team, animal, musicGenre, song, book, color, movie, drink, food, number, superHero"
      )
      .range(0, Number(upperLimit) - 1)
      .then(({ data, error }) => {
        setUserFavorites(data);
      });
  }, [upperLimit]);

  useEffect(() => {
    fetchRecords();
  }, [upperLimit]);

  function handleFilter(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;

    if (value && userFavorites) {
      setUserFavorites(
        matchSorter(userFavorites, value, {
          keys: Object.keys(userFavorites[0]),
          threshold: matchSorter.rankings.WORD_STARTS_WITH,
        })
      );
    } else {
      fetchRecords();
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
          onInput={handleFilter}
        />
      </div>
      <table className="f6 w-100" cellSpacing="0">
        <thead>
          <tr>
            {Object.keys(userFavorites[0]).map((colName) => (
              <th className="fw6 tl pa1 pointer bb black--90" key={colName}>
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
              className={`pointer dim ${
                selectedUser?.id === userInfo.id ? "bg-lightest-blue" : ""
              }`}
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
