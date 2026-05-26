"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = RegisterForm;
var _react = require("react");
var _module = require("../../utils/module");
var _jsxRuntime = require("react/jsx-runtime");
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
 */function RegisterForm() {
  const [firstname, setFirstname] = (0, _react.useState)("");
  const [name, setName] = (0, _react.useState)("");
  const [email, setEmail] = (0, _react.useState)("");
  const [birth, setBirth] = (0, _react.useState)("");
  const [postcode, setPostcode] = (0, _react.useState)("");
  const [city, setCity] = (0, _react.useState)("");
  const [showData, setShowData] = (0, _react.useState)(false);
  const [users, setUsers] = (0, _react.useState)([]);
  const [toast, setToast] = (0, _react.useState)("");
  function toggleGetData() {
    if (showData) {
      setShowData(false);
      return;
    }
    const list = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(list);
    setShowData(true);
  }
  const firstnameError = firstname && !(0, _module.isValidName)(firstname) ? "Invalid firstname" : "";
  const nameError = name && !(0, _module.isValidName)(name) ? "Invalid name" : "";
  const emailError = email && !(0, _module.isValidEmail)(email) ? "Invalid email" : "";
  const postCodeError = postcode && !(0, _module.isValidCodePost)(postcode) ? "Invalid postcode" : "";
  const cityError = city && !(0, _module.isValidName)(city) ? "Invalid city" : "";
  const birthError = birth && !(0, _module.isAdult)(new Date(birth)) ? "You are too young" : "";
  const isFormValid = firstname && name && email && birth && postcode && city && (0, _module.isValidName)(firstname) && (0, _module.isValidName)(name) && (0, _module.isValidName)(city) && (0, _module.isValidEmail)(email) && (0, _module.isValidCodePost)(postcode) && (0, _module.isAdult)(new Date(birth));
  function handleSubmission() {
    let userData = {
      FirstName: firstname,
      Name: name,
      Email: email,
      Birth: birth,
      Postcode: postcode,
      City: city
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
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
      htmlFor: "firstname",
      children: "First Name "
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
      id: "firstname",
      type: "text",
      name: "first name",
      placeholder: "Type your first name",
      onChange: e => setFirstname(e.target.value),
      value: firstname
    }), firstnameError && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
      style: {
        color: 'red'
      },
      children: firstnameError
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
      htmlFor: "name",
      children: " Name "
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
      id: "name",
      type: "text",
      name: "name",
      placeholder: "Type your name",
      onChange: e => setName(e.target.value),
      value: name
    }), nameError && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
      style: {
        color: 'red'
      },
      children: nameError
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
      htmlFor: "email",
      children: " Email "
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
      id: "email",
      type: "email",
      name: "email",
      placeholder: "Type your email",
      onChange: e => setEmail(e.target.value),
      value: email
    }), emailError && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
      style: {
        color: 'red'
      },
      children: emailError
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
      htmlFor: "birth",
      children: " birth "
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
      id: "birth",
      type: "date",
      name: "birth",
      placeholder: "Type your birth",
      onChange: e => setBirth(e.target.value),
      value: birth
    }), birthError && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
      style: {
        color: 'red'
      },
      children: birthError
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
      htmlFor: "postcode",
      children: " postcode "
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
      id: "postcode",
      type: "text",
      name: "postcode",
      placeholder: "Type your postcode",
      onChange: e => setPostcode(e.target.value),
      value: postcode
    }), postCodeError && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
      style: {
        color: 'red'
      },
      children: postCodeError
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
      htmlFor: "city",
      children: " city "
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
      id: "city",
      type: "text",
      name: "city",
      placeholder: "Type your city",
      onChange: e => setCity(e.target.value),
      value: city
    }), cityError && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
      style: {
        color: 'red'
      },
      children: cityError
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
      onClick: handleSubmission,
      disabled: !isFormValid,
      children: "Send"
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
      onClick: toggleGetData,
      children: "Show registered users"
    }), toast && /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      role: "alert",
      "data-testid": "toast",
      style: {
        position: 'fixed',
        bottom: 20,
        right: 20,
        background: '#16a34a',
        color: 'white',
        padding: '10px 16px',
        borderRadius: 4
      },
      children: toast
    }), showData && /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: "data",
      "data-testid": "users-list",
      children: users.length === 0 ? /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        children: "No registered users"
      }) : users.map((u, i) => /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: "user-item",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          children: ["First Name - ", u.FirstName]
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          children: ["Name - ", u.Name]
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          children: ["Email - ", u.Email]
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          children: ["Birth - ", u.Birth]
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          children: ["Postcode - ", u.Postcode]
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          children: ["City - ", u.City]
        })]
      }, i))
    })]
  });
}