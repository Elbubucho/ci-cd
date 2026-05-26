"use strict";

var _react = require("@testing-library/react");
var _RegisterForm = _interopRequireDefault(require("./RegisterForm"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const labels = {
  firstname: /first name/i,
  name: /^name$/i,
  email: /email/i,
  birth: /birth/i,
  postcode: /postcode/i,
  city: /city/i
};
const validValues = {
  firstname: 'Jean',
  name: 'Dupont',
  email: 'jean@example.com',
  birth: '1998-01-22',
  postcode: '75001',
  city: 'Paris'
};
function getInput(key) {
  return _react.screen.getByLabelText(labels[key]);
}
function fillField(key, value) {
  _react.fireEvent.change(getInput(key), {
    target: {
      value
    }
  });
}
function fillAllValid() {
  Object.keys(labels).forEach(k => fillField(k, validValues[k]));
}
describe('RegisterForm integration tests', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.useFakeTimers();
  });
  afterEach(() => {
    (0, _react.act)(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });
  it('renders all fields and the submit button', () => {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
    Object.keys(labels).forEach(k => {
      expect(getInput(k)).toBeInTheDocument();
    });
    expect(_react.screen.getByRole('button', {
      name: /send/i
    })).toBeInTheDocument();
  });
  it('associates each label with its input via id/htmlFor', () => {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
    Object.keys(labels).forEach(k => {
      expect(getInput(k)).toHaveAttribute('id', k);
    });
  });
  it('submit button is disabled when fields are empty', () => {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
    expect(_react.screen.getByRole('button', {
      name: /send/i
    })).toBeDisabled();
  });
  it('submit button is disabled when only some fields are filled', () => {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
    fillField('firstname', 'Jean');
    fillField('name', 'Dupont');
    expect(_react.screen.getByRole('button', {
      name: /send/i
    })).toBeDisabled();
  });
  it('shows an error for an invalid firstname', () => {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
    fillField('firstname', 'Jean123');
    const err = _react.screen.getByText(/invalid firstname/i);
    expect(err).toBeInTheDocument();
    expect(err).toHaveStyle({
      color: 'red'
    });
  });
  it('shows an error for an invalid name', () => {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
    fillField('name', 'Dup@nt');
    expect(_react.screen.getByText(/invalid name/i)).toBeInTheDocument();
  });
  it('shows an error for an invalid email', () => {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
    fillField('email', 'not-an-email');
    expect(_react.screen.getByText(/invalid email/i)).toBeInTheDocument();
  });
  it('shows an error for an invalid postcode', () => {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
    fillField('postcode', '12');
    expect(_react.screen.getByText(/invalid postcode/i)).toBeInTheDocument();
  });
  it('shows an error for an invalid city', () => {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
    fillField('city', 'Paris99');
    expect(_react.screen.getByText(/invalid city/i)).toBeInTheDocument();
  });
  it('shows an error when user is under 18', () => {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
    const recent = new Date();
    recent.setFullYear(recent.getFullYear() - 10);
    fillField('birth', recent.toISOString().split('T')[0]);
    expect(_react.screen.getByText(/too young/i)).toBeInTheDocument();
  });
  it('does not show errors when all fields are valid', () => {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
    fillAllValid();
    expect(_react.screen.queryByText(/invalid/i)).not.toBeInTheDocument();
    expect(_react.screen.queryByText(/too young/i)).not.toBeInTheDocument();
  });
  it('enables submit button when all fields are valid', () => {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
    fillAllValid();
    expect(_react.screen.getByRole('button', {
      name: /send/i
    })).toBeEnabled();
  });
  it('saves the user in localStorage on submit', () => {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
    fillAllValid();
    _react.fireEvent.click(_react.screen.getByRole('button', {
      name: /send/i
    }));
    const stored = JSON.parse(localStorage.getItem('users'));
    expect(stored).toHaveLength(1);
    expect(stored[0]).toEqual({
      FirstName: 'Jean',
      Name: 'Dupont',
      Email: 'jean@example.com',
      Birth: '1998-01-22',
      Postcode: '75001',
      City: 'Paris'
    });
  });
  it('appends to an existing users list in localStorage', () => {
    localStorage.setItem('users', JSON.stringify([{
      FirstName: 'Old'
    }]));
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
    fillAllValid();
    _react.fireEvent.click(_react.screen.getByRole('button', {
      name: /send/i
    }));
    const stored = JSON.parse(localStorage.getItem('users'));
    expect(stored).toHaveLength(2);
  });
  it('shows the success toaster on submit', () => {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
    fillAllValid();
    _react.fireEvent.click(_react.screen.getByRole('button', {
      name: /send/i
    }));
    const toast = _react.screen.getByTestId('toast');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveTextContent(/saved successfully/i);
    expect(toast).toHaveAttribute('role', 'alert');
  });
  it('hides the toaster after 3 seconds', () => {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
    fillAllValid();
    _react.fireEvent.click(_react.screen.getByRole('button', {
      name: /send/i
    }));
    expect(_react.screen.getByTestId('toast')).toBeInTheDocument();
    (0, _react.act)(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(_react.screen.queryByTestId('toast')).not.toBeInTheDocument();
  });
  it('does not show the users list before clicking the show button', () => {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
    expect(_react.screen.queryByTestId('users-list')).not.toBeInTheDocument();
  });
  it('shows "No registered users" when localStorage is empty', () => {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
    _react.fireEvent.click(_react.screen.getByRole('button', {
      name: /show registered users/i
    }));
    expect(_react.screen.getByTestId('users-list')).toBeInTheDocument();
    expect(_react.screen.getByText(/no registered users/i)).toBeInTheDocument();
  });
  it('displays registered users from localStorage on click', () => {
    localStorage.setItem('users', JSON.stringify([{
      FirstName: 'Jean',
      Name: 'Dupont',
      Email: 'jean@example.com',
      Birth: '1998-01-22',
      Postcode: '75001',
      City: 'Paris'
    }, {
      FirstName: 'Marie',
      Name: 'Curie',
      Email: 'marie@example.com',
      Birth: '1990-05-10',
      Postcode: '69001',
      City: 'Lyon'
    }]));
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
    _react.fireEvent.click(_react.screen.getByRole('button', {
      name: /show registered users/i
    }));
    expect(_react.screen.getByText(/Jean/)).toBeInTheDocument();
    expect(_react.screen.getByText(/Dupont/)).toBeInTheDocument();
    expect(_react.screen.getByText(/jean@example\.com/)).toBeInTheDocument();
    expect(_react.screen.getByText(/Marie/)).toBeInTheDocument();
    expect(_react.screen.getByText(/Lyon/)).toBeInTheDocument();
  });
  it('toggles the users list off when clicking show again', () => {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
    const showBtn = _react.screen.getByRole('button', {
      name: /show registered users/i
    });
    _react.fireEvent.click(showBtn);
    expect(_react.screen.getByTestId('users-list')).toBeInTheDocument();
    _react.fireEvent.click(showBtn);
    expect(_react.screen.queryByTestId('users-list')).not.toBeInTheDocument();
  });
  it('shows the newly registered user in the list after submit', () => {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
    fillAllValid();
    _react.fireEvent.click(_react.screen.getByRole('button', {
      name: /send/i
    }));
    _react.fireEvent.click(_react.screen.getByRole('button', {
      name: /show registered users/i
    }));
    expect(_react.screen.getByText(/Jean/)).toBeInTheDocument();
    expect(_react.screen.getByText(/Paris/)).toBeInTheDocument();
  });
  it('clears all fields after a successful submit', () => {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterForm.default, {}));
    fillAllValid();
    _react.fireEvent.click(_react.screen.getByRole('button', {
      name: /send/i
    }));
    Object.keys(labels).forEach(k => {
      expect(getInput(k)).toHaveValue('');
    });
  });
});