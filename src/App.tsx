import "./App.css";
import "tachyons";
import { useEffect, useState } from "react";

type UserFavorite = {
  id: string;
  name: string;
  email: string;
  team: string;
  animal: string;
  musicGenre: string;
  song: string;
  book: string;
  word: string;
  color: string;
  movie: string;
  drink: string;
  food: string;
  number: number;
  superHero: string;
  quote: string;
};

function App() {
  const [userFavorites, setUserFavorites] = useState<Array<UserFavorite>>([]);

  useEffect(() => {
    fetch("http://localhost:9001/users").then((res) =>
      res.json().then((data) => setUserFavorites(data))
    );
  }, []);

  return (
    <div className="App">
      <div className="pa2">
        {userFavorites.map((user) =>
          Object.values(user).map((value) => <div>{value}</div>)
        )}
      </div>
    </div>
  );
}

export default App;
