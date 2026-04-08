import * as path from "path";

export const getEnvPath = (service?: string):string => {
  if(!service)
    return ".env";
  
  const envPath = path.resolve(
    process.cwd(), `apps/${service}/.env.${process.env.NODE_ENV || 'dev' }`
  );
  return envPath;
}