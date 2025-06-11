export const authorize = async () => {
    const credentialsPath = path.join(process.cwd(), filename);
    const auth = new JWT({
      keyFile: credentialsPath,
      scopes,
    });
  
    await auth.authorize();
    return auth;
  };