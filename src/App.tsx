import "./App.css";
import "tachyons";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

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
const recordCount = 1000;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function App() {
  const [userFavorites, setUserFavorites] =
    useState<Array<UserFavorite> | null>(null);

  useEffect(() => {
    supabase
      .from("user-favorites")
      .select(
        "id, name, email, team, animal, musicGenre, song, book, color, movie, drink, food, number, superHero"
      )
      .range(0, Number(recordCount))
      .then(({ data, error }) => setUserFavorites(data));
  }, []);

  return userFavorites ? (
    <div className="ma1">
      <h2 className="mv2">Favorite Things: React.js</h2>
      <h3 className="mv2">record count: {recordCount}</h3>
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
            <tr key={`${userInfo.id}`}>
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
