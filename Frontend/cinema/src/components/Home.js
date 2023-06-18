import React from 'react';
import Hero from './Hero';

const Home = ({movies}) => {
    return (
        <div>
            <Hero movies={movies}/>
        </div>
    );
}

export default Home;