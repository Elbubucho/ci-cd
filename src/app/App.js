import './App.css';
import axios from "axios";
import RegisterForm from "./components/registerForm/RegisterForm";
import {useState, useEffect} from "react";


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
