"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateAge = calculateAge;
exports.isAdult = isAdult;
exports.isValidCodePost = isValidCodePost;
exports.isValidEmail = isValidEmail;
exports.isValidName = isValidName;
/**
 * Calcule l'âge en années d'une personne à partir de sa date de naissance.
 *
 * @param {{birth: Date}} p Objet représentant une personne, avec un champ `birth` de type Date.
 * @returns {number} L'âge en années (NaN si la date est invalide).
 * @throws {Error} "missing param p" si `p` est undefined.
 * @throws {Error} "wrong format" si `p` n'est pas un objet.
 * @throws {Error} "no birth field" si `p.birth` est manquant ou n'est pas une Date.
 *
 * @example
 * calculateAge({ birth: new Date("1998-01-22") }); // 28
 */
function calculateAge(p) {
  if (p === undefined) {
    throw new Error('missing param p');
  }
  if (typeof p !== 'object') {
    throw new Error('wrong format');
  }
  if (!p.birth || !(p.birth instanceof Date)) {
    throw new Error('no birth field');
  }
  if (isNaN(p.birth)) {
    return NaN;
  }
  let dateDiff = new Date(Date.now() - p.birth.getTime());
  let age = Math.abs(dateDiff.getUTCFullYear() - 1970);
  return age;
}

/**
 * Vérifie qu'un code postal est au format français (exactement 5 chiffres).
 *
 * @param {string} code Le code postal à valider.
 * @returns {boolean} `true` si le code est composé de 5 chiffres exactement, sinon `false`.
 *
 * @example
 * isValidCodePost("75001"); // true
 * isValidCodePost("123");   // false
 */
function isValidCodePost(code) {
  const codeRegexp = /^\d{5}$/;
  return codeRegexp.test(code);
}

/**
 * Vérifie qu'une chaîne contient uniquement des lettres (accents/trémas inclus),
 * espaces, apostrophes ou tirets — utilisé pour nom, prénom et ville.
 *
 * @param {string} name La chaîne à valider.
 * @returns {boolean} `true` si la chaîne est valide, sinon `false`.
 *
 * @example
 * isValidName("Jean-Pierre"); // true
 * isValidName("Élodie");      // true
 * isValidName("Jean123");     // false
 */
function isValidName(name) {
  const nameRegexp = /^[a-zA-ZÀ-ÿ' -]+$/;
  return nameRegexp.test(name);
}

/**
 * Vérifie qu'une adresse email a un format valide (`local@domaine.ext`, sans espaces).
 *
 * @param {string} email L'email à valider.
 * @returns {boolean} `true` si l'email est valide, sinon `false`.
 *
 * @example
 * isValidEmail("test@example.com"); // true
 * isValidEmail("test@example");     // false
 */
function isValidEmail(email) {
  const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegexp.test(email);
}

/**
 * Vérifie qu'une personne est majeure (>= 18 ans) à partir de sa date de naissance.
 *
 * @param {Date} birth La date de naissance.
 * @returns {boolean} `true` si la personne a 18 ans ou plus, sinon `false`.
 *
 * @example
 * isAdult(new Date("1998-01-22")); // true
 */
function isAdult(birth) {
  let objectDate = {
    birth: birth
  };
  return calculateAge(objectDate) >= 18;
}