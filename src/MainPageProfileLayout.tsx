import {Link} from "react-router-dom";

function MainPageProfileLayout() {
    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link to="/index">Assets</Link>
                    </li>
                    <li>
                        <Link to="/articles">Articles</Link>
                    </li>
                    <li>
                        <Link to="/scripts">Scripts</Link>
                    </li>
                </ul>
            </nav>
        </>)
};

export default MainPageProfileLayout;
