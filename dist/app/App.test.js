"use strict";

var _react = require("@testing-library/react");
var _App = _interopRequireDefault(require("./App"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
describe('App', () => {
  it('renders the RegisterForm with all its fields', () => {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_App.default, {}));
    expect(_react.screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(_react.screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(_react.screen.getByLabelText(/city/i)).toBeInTheDocument();
  });
});