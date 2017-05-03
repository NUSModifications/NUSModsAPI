// When modifying this, copy this over to '__mocks__' as well!
module.exports = {
  env: {
    jest: true,
  },
  rules: {
    // eslint thinks testing tools are dependencies
    'import/no-extraneous-dependencies': 'off',
  },
};
