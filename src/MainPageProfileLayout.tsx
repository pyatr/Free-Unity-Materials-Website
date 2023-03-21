import {Outlet, Link} from "react-router-dom";

function MainPageProfileLayout() {
    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                    <li>
                        <Link to="/register">Register</Link>
                    </li>
                </ul>
            </nav>
        </>)
};

export default MainPageProfileLayout;
