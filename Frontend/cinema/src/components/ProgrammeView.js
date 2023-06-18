import Programme from "./Programme";


const ProgrammeView = ({movies}) => {
    return (
        <div>
            {console.log(movies)}
            {console.log(movies[0])}
            <Programme movie={movies[0]}/>
        </div>
    );
};

export default ProgrammeView;