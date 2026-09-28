export function handleError(res, error) {
  // Falló una validación del esquema (required, minlength, enum, validator...)
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map(item => item.message);
    return res.status(400).json({ errors: messages });
  }

  // Un id (o un valor de filtro) no tiene formato válido
  if (error.name === 'CastError') {
    return res.status(400).json({ error: `Invalid value for ${error.path}` });
  }

  // Valor duplicado en un campo unique (por ejemplo el email)
  if (error.code === 11000) {
    return res.status(409).json({ error: 'Duplicate value', fields: error.keyValue });
  }

  console.error(error);
  return res.status(500).json({ error: 'Internal server error' });
}