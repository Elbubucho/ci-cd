import {useState} from "react";
import  "../../utils/module";
import {isAdult, isValidCodePost, isValidEmail, isValidName} from "../../utils/module";

/**
 * Formulaire d'inscription utilisateur.
 *
 * Champs : prénom, nom, email, date de naissance, code postal, ville.
 * - Affiche un message d'erreur en rouge sous chaque champ invalide.
 * - Le bouton "Send" est désactivé tant que les champs ne sont pas tous valides.
 * - À la soumission : enregistre l'utilisateur dans `localStorage` (clé `users`),
 *   affiche un toaster de succès et vide le formulaire.
 *
 * Règles de validation (voir `utils/module.js`) :
 * - prénom, nom, ville : lettres, accents, trémas, tirets, apostrophes, espaces.
 * - email : format `local@domaine.ext`.
 * - code postal : 5 chiffres (format français).
 * - date de naissance : majorité requise (>= 18 ans).
 *
 * @component
 * @returns {JSX.Element} Le formulaire d'inscription.
 */
export default function RegisterForm() {

    const [firstname, setFirstname] = useState("")
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [birth, setBirth] = useState("");
    const [postcode, setPostcode] = useState("");
    const [city, setCity] = useState("");

    const [showData, setShowData] = useState(false);
    const [users, setUsers] = useState([]);
    const [toast, setToast] = useState("");

    function toggleGetData() {
        if (showData) {
            setShowData(false);
            return;
        }
        const list = JSON.parse(localStorage.getItem("users")) || [];
        setUsers(list);
        setShowData(true);
    }

    const firstnameError = firstname && !isValidName(firstname) ? "Invalid firstname" : "";
    const nameError = name && !isValidName(name) ? "Invalid name" : "";
    const emailError = email && !isValidEmail(email) ? "Invalid email" : "";
    const postCodeError = postcode && !isValidCodePost(postcode) ? "Invalid postcode" : "";
    const cityError = city && !isValidName(city) ? "Invalid city" : "";
    const birthError = birth && !isAdult(new Date(birth)) ? "You are too young" : "";

    const isFormValid =
        firstname && name && email && birth && postcode && city &&
        isValidName(firstname) && isValidName(name) && isValidName(city) &&
        isValidEmail(email) && isValidCodePost(postcode) &&
        isAdult(new Date(birth));

    function handleSubmission() {
        let userData = {
            FirstName: firstname,
            Name: name,
            Email: email,
            Birth: birth,
            Postcode: postcode,
            City: city,
        };
        const list = JSON.parse(localStorage.getItem('users')) || [];
        list.push(userData);
        localStorage.setItem('users', JSON.stringify(list));
        setToast("Saved Successfully");
        setTimeout(() => setToast(""), 3000);
        setFirstname("");
        setName("");
        setEmail("");
        setBirth("");
        setPostcode("");
        setCity("");
    }

    return(
        <div>
            <label htmlFor="firstname">First Name </label>
            <input
                id="firstname"
                type="text"
                name="first name"
                placeholder="Type your first name"
                onChange={(e) => setFirstname(e.target.value)}
                value={firstname}
            />
            {firstnameError && <span style={{color: 'red'}}>{firstnameError}</span>}

            <label htmlFor="name"> Name </label>
            <input
                id="name"
                type="text"
                name="name"
                placeholder="Type your name"
                onChange={(e) => setName(e.target.value)}
                value={name}
            />
            {nameError && <span style={{color: 'red'}}>{nameError}</span>}

            <label htmlFor="email"> Email </label>
            <input
                id="email"
                type="email"
                name="email"
                placeholder="Type your email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />
            {emailError && <span style={{color: 'red'}}>{emailError}</span>}

            <label htmlFor="birth"> birth </label>
            <input
                id="birth"
                type="date"
                name="birth"
                placeholder="Type your birth"
                onChange={(e) => setBirth(e.target.value)}
                value={birth}
            />
            {birthError && <span style={{color: 'red'}}>{birthError}</span>}

            <label htmlFor="postcode"> postcode </label>
            <input
                id="postcode"
                type="text"
                name="postcode"
                placeholder="Type your postcode"
                onChange={(e) => setPostcode(e.target.value)}
                value={postcode}/>
            {postCodeError && <span style={{color: 'red'}}>{postCodeError}</span>}

            <label htmlFor="city"> city </label>
            <input
                id="city"
                type="text"
                name="city"
                placeholder="Type your city"
                onChange={(e) => setCity(e.target.value)}
                value={city}/>
            {cityError && <span style={{color: 'red'}}>{cityError}</span>}

            <button onClick={handleSubmission} disabled={!isFormValid}>Send</button>

            <button onClick={toggleGetData}>Show registered users</button>

            {toast && (
                <div
                    role="alert"
                    data-testid="toast"
                    style={{
                        position: 'fixed',
                        bottom: 20,
                        right: 20,
                        background: '#16a34a',
                        color: 'white',
                        padding: '10px 16px',
                        borderRadius: 4,
                    }}
                >
                    {toast}
                </div>
            )}

            {showData && (
                <div className="data" data-testid="users-list">
                    {users.length === 0 ? (
                        <div>No registered users</div>
                    ) : (
                        users.map((u, i) => (
                            <div key={i} className="user-item">
                                <div>First Name - {u.FirstName}</div>
                                <div>Name - {u.Name}</div>
                                <div>Email - {u.Email}</div>
                                <div>Birth - {u.Birth}</div>
                                <div>Postcode - {u.Postcode}</div>
                                <div>City - {u.City}</div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>)

}
