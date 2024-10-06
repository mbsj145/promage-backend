const mongo = {
  db_url: process['env']['LOCALHOST_DATABASE_URL'], // Default for local dev
  options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
  },
  debug: false,
};

export default mongo;