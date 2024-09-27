const ensure = (value: string | undefined, name: string): string | void => {
  if (value === undefined || value === '') {
    throw new Error(`Environment variable ${name} is not defined or is empty.`);
  }
  return value;
};

export const envConfig = {
  PORT: ensure(process.env.PORT, 'PORT'),
  JWT_SECRET_TOKEN: ensure(process.env.JWT_SECRET_TOKEN, 'JWT_SECRET_TOKEN'),
};
