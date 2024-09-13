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


const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
 

  

  return (
    <div className={`app-container ${theme}`}>
      <Router>
        <Header theme={theme} toggleTheme={toggleTheme} />
        <Hero />
        <Routes>
          <Route path="/" element={<Home  />} />
          <Route path="/watchlist" element={<Watchlist  />} />
          <Route path="/favorites" element={<Favorite  />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
