import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./router/Router"; // Ensure this path is correct
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css/animate.min.css";

const App = () => {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
};

export default App;
