import './App.css';
import axios from "axios";
import RegisterForm from "./components/registerForm/RegisterForm";
import {useState, useEffect} from "react";


/**
 * Composant racine de l'application "Users manager".
 *
 * Au montage, interroge l'API backend (`GET /users`) pour compter
 * les utilisateurs enregistrés et affiche le total. Rend également
 * le composant {@link RegisterForm} permettant l'inscription.
 *
 * @component
 * @returns {JSX.Element} La page principale de l'application.
 */
function App() {
    const port = process.env.REACT_APP_SERVER_PORT;
    let [usersCount, setUsersCount] = useState(0);

    useEffect(() => {
        async function countUsers() {
            try {
                const api = axios.create({
                    baseURL: `http://localhost:${port}`,
                });
                const response = await api.get('/users');
                console.log(response.data)
                setUsersCount(response.data.users.length);
            } catch(error) {
                console.error(error);
            }
        }
        countUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  return (
      <div className="App">
          <header className="App-header">
              <h1>Users manager</h1>
              <p>{usersCount} user(s) already registered</p>
          </header>
          <div>
            <RegisterForm/>
          </div>
      </div>)
}

export default App;
