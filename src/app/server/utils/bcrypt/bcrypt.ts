import bcrypt from "bcrypt";

import { bcryptOptions } from "./bcrypt.constants";

export const generateHash = (password: string) => bcrypt.hash(password, bcryptOptions.Salt);

export const compareHash = (password: string, hash: string) => bcrypt.compare(password, hash);
