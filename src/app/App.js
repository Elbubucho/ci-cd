import './App.css';
import RegisterForm from "./components/registerForm/RegisterForm";
import Login from "./components/login/Login";
import { countUsers } from "./api";
import {useState, useEffect} from "react";


/**
 * Composant racine de l'application "Users manager".
 *
 * Au montage, interroge l'API backend (`GET /users`) pour compter
 * les utilisateurs enregistrés et affiche le total. Rend également
 * le composant {@link RegisterForm} permettant l'inscription, et
 * la {@link Login} page pour passer en mode admin.
 *
 * @component
 * @returns {JSX.Element} La page principale de l'application.
 */
function App() {
    const [usersCount, setUsersCount] = useState(0);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        countUsers()
            .then(setUsersCount)
            .catch(() => setUsersCount(0));
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <h1>Users manager</h1>
                <p>{usersCount} user(s) already registered</p>
                {isAdmin && <p data-testid="admin-badge">Admin mode</p>}
            </header>
            {!isAdmin && (
                <div>
                    <Login onLogin={setIsAdmin} />
                </div>
            )}
            <div>
                <RegisterForm isAdmin={isAdmin} />
            </div>
        </div>
    );
}

export default App;
