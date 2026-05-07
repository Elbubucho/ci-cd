import {calculateAge, isAdult, isValidCodePost, isValidName, isValidEmail} from './module';
/**
*@function calculateAge
*/

describe('calculateAge Unit Test Suites', () => {
    it('should calculate the correct age', () => {
        const valentin = {
            birth: new Date("01/22/1998")
        };
        expect(calculateAge(valentin)).toEqual(28)
    })

    it('should throw a "missing param p" error', () => {
        expect(() => calculateAge()).toThrow("missing param p")
    })

    it('should throw a wrong format error', () =>{
        expect(() => calculateAge(17)).toThrow('wrong format')
    })

    it('p should have a birth field', () =>{
        const p = {
            naissance: new Date("01/22/1998"),
        }
        expect(() => calculateAge(p)).toThrow('no birth field')
    })

    it('p.birth should be a date', () =>{
        const p = {
            birth: 'ma date de naissance',
        }
        expect(() => calculateAge(p)).toThrow('no birth field')
    })

    it('should be NaN is the date is wrong', () => {
        const p = {
            birth: new Date("22/40/1998")
        }
        expect(calculateAge(p)).toBeNaN()
    })
})

/**
 * @function isValidCodePost
 */

describe('isValuidCodePost unit test suites', () => {
    it('should return false if code post do not have 5 numbers exactly', () => {
        const codePost = "0614"
        expect(isValidCodePost(codePost)).toBe(false)
    })
    it('should return false if code post have letters', () => {
        const codePost = "123LE"
        expect(isValidCodePost(codePost)).toBe(false)
    })
    it('should return true if code post have exactly 5 numbers', () => {
        const codePost = "12345"
        expect(isValidCodePost(codePost)).toBe(true)
    })
})

/**
 * @function isValidName
 */
describe('isValidName unit test suites', () => {
    it('should return true for a simple name', () => {
        expect(isValidName("Jean")).toBe(true)
    })
    it('should return true for a name with accents', () => {
        expect(isValidName("Élodie")).toBe(true)
    })
    it('should return true for a name with hyphen', () => {
        expect(isValidName("Jean-Pierre")).toBe(true)
    })
    it('should return true for a name with apostrophe', () => {
        expect(isValidName("L'Étoile")).toBe(true)
    })
    it('should return true for a name with diaeresis', () => {
        expect(isValidName("Loïc")).toBe(true)
    })
    it('should return false for a name with numbers', () => {
        expect(isValidName("Jean123")).toBe(false)
    })
    it('should return false for a name with special characters', () => {
        expect(isValidName("Jean@Pierre")).toBe(false)
    })
    it('should return false for an empty name', () => {
        expect(isValidName("")).toBe(false)
    })
})

/**
 * @function isValidEmail
 */
describe('isValidEmail unit test suites', () => {
    it('should return true for a valid email', () => {
        expect(isValidEmail("test@example.com")).toBe(true)
    })
    it('should return true for an email with subdomain', () => {
        expect(isValidEmail("user@mail.example.com")).toBe(true)
    })
    it('should return false for an email without @', () => {
        expect(isValidEmail("testexample.com")).toBe(false)
    })
    it('should return false for an email without domain', () => {
        expect(isValidEmail("test@")).toBe(false)
    })
    it('should return false for an email without extension', () => {
        expect(isValidEmail("test@example")).toBe(false)
    })
    it('should return false for an email with spaces', () => {
        expect(isValidEmail("test @example.com")).toBe(false)
    })
    it('should return false for an empty email', () => {
        expect(isValidEmail("")).toBe(false)
    })
})

/**
 * @function isAdult
 */
describe('isAdult unit test suites', () => {
    it('should return true for an adult', () => {
        const birth = new Date("01/22/1998")
        expect(isAdult(birth)).toBe(true)
    })
    it('should return false for a minor', () => {
        const birth = new Date()
        birth.setFullYear(birth.getFullYear() - 10)
        expect(isAdult(birth)).toBe(false)
    })
    it('should return true for someone exactly 18', () => {
        const birth = new Date()
        birth.setFullYear(birth.getFullYear() - 18)
        expect(isAdult(birth)).toBe(true)
    })
})
