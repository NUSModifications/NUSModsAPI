import { graphql } from 'graphql';
import { schema } from '../../schema';

it('should be null when user is not logged in', async () => {
  const query = `
    query {
      modules(acadYear: "2016-2017") {
        code
        title
        department
        description
      }
    }
  `;

  const rootValue = {};
  const context = {};

  const result = await graphql(schema, query, rootValue, context);
  const { data } = result;

  expect(data.viewer.me).toBe(null);
});
