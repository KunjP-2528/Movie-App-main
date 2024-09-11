// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from './pages/Home';
// import Watchlist from './pages/WatchList';
// import Favorite from './pages/Favorite';
// import Header from './component/Header';
// import './Style/App.css';
// import Hero from './component/Hero';
// import SearchResults from './pages/SearchResult';
// import useTheme from './component/CustomHook';

// const App: React.FC = () => {
//   const { theme, toggleTheme } = useTheme();
//   console.log(theme)

//   return (
//     <div className={`app-container ${theme}`}>
//       <Router>
//         <Header theme={theme} toggleTheme={toggleTheme} />
//         <Hero />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/watchlist" element={<Watchlist />} />
//           <Route path="/favorites" element={<Favorite />} />
//           <Route path="/search" element={<SearchResults />} />
//         </Routes>
//       </Router>
//     </div>
//   );
// };

// export default App;
import React, { useReducer } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Watchlist from './pages/WatchList';
import Favorite from './pages/Favorite';
import Header from './component/Header';
import './Style/App.css';
import Hero from './component/Hero';
import SearchResults from './pages/SearchResult';
import useTheme from './component/CustomHook';

// Define the Movie interface
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
}

// Define the initial state and reducer
interface State {
  favorites: Movie[];
  watchlist: Movie[];
}

type Action =
  | { type: 'ADD_TO_FAVORITES'; movie: Movie }
  | { type: 'REMOVE_FROM_FAVORITES'; movieId: number }
  | { type: 'ADD_TO_WATCHLIST'; movie: Movie }
  | { type: 'REMOVE_FROM_WATCHLIST'; movieId: number };

const initialState: State = {
  favorites: [],
  watchlist: [],
};

const movieReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TO_FAVORITES':
      return {
        ...state,
        favorites: [...state.favorites, action.movie],
      };
    case 'REMOVE_FROM_FAVORITES':
      return {
        ...state,
        favorites: state.favorites.filter((movie) => movie.id !== action.movieId),
      };
    case 'ADD_TO_WATCHLIST':
      return {
        ...state,
        watchlist: [...state.watchlist, action.movie],
      };
    case 'REMOVE_FROM_WATCHLIST':
      return {
        ...state,
        watchlist: state.watchlist.filter((movie) => movie.id !== action.movieId),
      };
    default:
      return state;
  }
};

const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [state, dispatch] = useReducer(movieReducer, initialState);

  

  return (
    <div className={`app-container ${theme}`}>
      <Router>
        <Header theme={theme} toggleTheme={toggleTheme} />
        <Hero />
        <Routes>
          <Route path="/" element={<Home dispatch={dispatch} />} />
          <Route path="/watchlist" element={<Watchlist watchlist={state.watchlist} dispatch={dispatch} />} />
          <Route path="/favorites" element={<Favorite favorites={state.favorites} dispatch={dispatch} />} />
          <Route path="/search" element={<SearchResults dispatch={dispatch}/>} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
