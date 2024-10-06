const mongo = {
      db_url: process['env']['DEV_DATABASE_URL'],
      options: {
          useNewUrlParser: true,
          useUnifiedTopology: true
      },
      debug: false,
};

export default mongo;