exports = module.exports = {
  'UNKNOWN_ERROR': 'UNKNOWN_ERROR',

  // Signin errors
  'INCORRECT_PASSWORD': 'Fel lösenord',
  'USER_NOT_FOUND': 'Användaren inte hittad',
  'USER_BANNED': 'Du är blockad från sidan',

  // Signup errors
  'DUPLICATE': 'Användarnamnet används',
  'INVALID_FORMAT': 'only \\w',
  'USERNAME_TOO_SHORT': 'Ditt användarnamn måste vara minst 3 tecken',
  'USERNAME_TOO_SHORT': 'Ditt användarnamn får högst innehålla 25 tecken',
  'PASSWORD_EMPTY': 'Ange ett lösenord',
  'PASSWORD_TOO_SHORT': 'Ditt lösenord måste vara minst 6 tecken'
}

;([
  'STOP_HAXING_PLZ'
]).forEach(s => exports[s] = exports.UNKNOWN_ERROR)