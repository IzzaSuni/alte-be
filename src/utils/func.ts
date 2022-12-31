export const validation = (email: any) => {
  let isDomainValid = false;
  const domain = email.slice(email.indexOf('@') + 1, email.length);
  const nim = email.slice(email.indexOf('.') + 1, email.indexOf('@'));
  const allowedDomain = 'itera.ac.id';
  let angkatan = `20${nim[1]}${nim[2]}`;
  const isElektro = Number(nim.slice(3, 6)) === 130;

  if (domain.includes(allowedDomain)) {
    isDomainValid = true;
  }
  return { isDomainValid, isElektro, angkatan, nim };
};

export const sendRespObj = (code: number, message: string, result: object) => {
  return {
    status: code === 1 ? 'success' : 'error',
    code,
    data: { message, result },
  };
};
