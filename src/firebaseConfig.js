// Support both Firebase config stored locally in a file (e.g. on dev
// workstations) and passed in using environment variables (e.g. in Travis
// CI).

let config = null;  // eslint-disable-line import/no-mutable-exports
try {
  /* eslint-disable global-require */
  config = require('./localFirebaseConfig').default;
  /* eslint-enable global-require */
} catch (e) {
  config = {
    apiKey: process.env.FIREBASE_API_KEY,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  };
}

export default config;
