import "./App.css";
import Test from "./components/Test";
import api from "./api/axiosConfig";
import { useState, useEffect } from "react";
import Layout from "./components/Layout";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Header from "./components/Header";
import Trailer from "./components/Trailer";
import ProgrammeView from "./components/ProgrammeView";
import SeanseView from "./components/SeanseView";
import LoginView from "./components/LoginView";
import RegisterView from "./components/RegisterView";

function App() {
  const [movies, setMovies] = useState([]);
  const [programme, setProgramme] = useState([]);
  const [user, setUser] = useState(null);

  const getMovies = async () => {
    try {
      const response = await api.get("movies/");
      // console.log(response.data.movies);
      setMovies(response.data.movies);
    } catch (error) {
      console.log(error);
    }
  };

  const getProgramme = async () => {
    try {
      const response = await api.get("programmes/getProgrammesWeekly");
      const seansesByDay = response.data.programmes.map((item) =>
        Object.entries(item.days).map(([day, { seanses }]) => seanses)
      );
      setProgramme(seansesByDay.flat());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMovies();
    getProgramme();
  }, []);

  return (
    <div className="App">
      <Header user={user} setUser={setUser}/>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home movies={movies} />}></Route>
          <Route path="/Trailer/:ytTrailerId" element={<Trailer />}></Route>
          <Route
            path="/programme"
            element={<ProgrammeView programme={programme} />}
          ></Route>
          <Route path="/seanse/:seanseId" element={<SeanseView programme={programme} user={user}/>}></Route>
          <Route path="/login" element={<LoginView user={user} setUser={setUser}/>}></Route>
          <Route path="/register" element={<RegisterView />}></Route>
          {/* <Route path="/Reviews/:movieId" element ={<Reviews getMovieData = {getMovieData} movie={movie} reviews ={reviews} setReviews = {setReviews} />}></Route> */}
          {/* <Route path="*" element = {<NotFound/>}></Route> */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
