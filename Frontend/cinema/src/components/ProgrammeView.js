import Programme from "./Programme";
import "./ProgrammeView.css";

const ProgrammeView = ({movies}) => {
    return (
        <div className="programme-view-container">
            <Programme movie={movies[0]}/>
            <Programme movie={movies[1]}/>
            <Programme movie={movies[2]}/>
        </div>
    );
};

export default ProgrammeView;