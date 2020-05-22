const config = {
  production: {
    public_url: process.env.PUBLIC_URL,
    secret: process.env.SECRET,
    database: process.env.DB_PRODUCTION,
  },
  development: {
    public_url: 'http://localhost:3000',
    secret: process.env.SECRET,
    database: process.env.DB_DEV,
  },
  default: {
    public_url: 'http://localhost:3000',
    secret: process.env.SECRET,
    database: process.env.DB_DEV,
  },
};

function get(env) {
  return config[env] || config.default;
}

module.exports = get;