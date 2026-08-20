const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class ValidationError extends Error {
  constructor(errors) {
    super('Validation failed');
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.errors = errors;
  }
}

function validateFields(fields) {
  const errors = [];

  if (typeof fields.email !== 'string' || !emailRegex.test(fields.email.trim())) {
    errors.push('El correo electrónico no es válido');
  }

  return errors;
}

export function validateRegistration({ email, password, name } = {}) {
  const errors = validateFields({ email });

  if (typeof password !== 'string' || password.length < 8) {
    errors.push('La contraseña debe tener al menos ocho caracteres');
  }

  if (typeof name !== 'string' || name.trim().length < 3) {
    errors.push('El nombre debe tener al menos tres caracteres');
  }

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }
}

export function validateLogin({ email, password } = {}) {
  const errors = validateFields({ email });

  if (typeof password !== 'string' || password.length === 0) {
    errors.push('La contraseña es obligatoria');
  }

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }
}

export function validateUserUpdate({ email, name } = {}) {
  const errors = [];

  if (name !== undefined && (typeof name !== 'string' || name.trim().length < 3)) {
    errors.push('El nombre debe tener al menos tres caracteres');
  }

  if (email !== undefined) {
    errors.push(...validateFields({ email }));
  }

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }
}