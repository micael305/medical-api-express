// Validación de correo electrónico mediante Regex
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validación de nombre (mínimo 3 caracteres)
function isValidName(name) {
  return typeof name === 'string' && name.length >= 3;
}

// Validación de ID (numérico y único)
function isNumericId(id) {
  return !isNaN(Number(id));
}

function isUniqueId(id, users) {
  return !users.some(user => user.id === id);
}

// Función principal de validación
export function validateUser(user, users = [], method = 'post') {
  const errors = [];

  if (!user || typeof user !== 'object') {
    return {
      isValid: false,
      errors: ['Los datos del usuario no son válidos']
    };
  }

  if (!isValidName(user.name)) {
    errors.push('El nombre debe tener al menos tres caracteres');
  }

  if (!isValidEmail(user.email)) {
    errors.push('El correo electrónico no es válido');
  }

  if (!isNumericId(user.id)) {
    errors.push('El ID debe de ser numérico y único');
  }

  if (method === 'post' && !isUniqueId(user.id, users)) {
    errors.push('El ID debe de ser único');
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
}