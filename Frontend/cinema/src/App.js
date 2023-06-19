import './App.css';
import Test from "./components/Test";
import api from "./api/axiosConfig"
import { useState, useEffect } from "react";
import Layout from './components/Layout';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Header from './components/Header';
import Trailer from './components/Trailer';
import ProgrammeView from './components/ProgrammeView';
import SeanseView from './components/SeanseView';

function App() {

  const [movies, setMovies] = useState([]);

  const getMovies = async () => { // todo
    try {
      const response = await api.get("movies/");
      console.log(response.data.movies);
      setMovies(response.data.movies);
    } catch (error) {
      console.log(error);
    }
  }
  

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <div className="App">
      <Header/>
      <Routes>
          <Route path="/" element={<Layout/>}>
            <Route path="/" element={<Home movies={movies} />} ></Route>
            <Route path="/Trailer/:ytTrailerId" element={<Trailer/>}></Route>
            <Route path="/programme" element={<ProgrammeView movies={movies}/>}></Route>
            <Route path="/seanse/:seanseId" element={<SeanseView/>}></Route> {/*todo*/}
            {/* <Route path="/Reviews/:movieId" element ={<Reviews getMovieData = {getMovieData} movie={movie} reviews ={reviews} setReviews = {setReviews} />}></Route> */}
            {/* <Route path="*" element = {<NotFound/>}></Route> */}
          </Route>
      </Routes>
    </div>
  );
}

export default App;
