import { makeExecutableSchema } from 'graphql-tools';
import bunyan from 'bunyan';
import camelize from 'underscore.string/camelize';

import { walkJsonDirSync } from '../util/walkDir';
import mapKeysDeep from '../util/mapKeysDeep';
import config from '../../config';

const log = bunyan.createLogger({ name: 'graphql' });

const Schema = `
type Module {
  code: String!
  title: String!
  department: String
  description: String
}

type ModuleInfo {
  credit: Float
  workload: String
  prerequisite: String
  corequisite: String
  examDate: String
  examOpenBook: Boolean
  examDuration: String
  examVenue: String
  timetable: [Lesson]
}

type Lesson {
  id: Int!
  classNo: String
  lessonType: String
  weekText: String
  dayText: String
  startTime: String
  endTime: String
  venue: String
}

# the schema allows the following query:
type Query {
  modules(acadYear: String): [Module]
  module(code: String): Module
}

schema {
  query: Query
}
`;

const apiFolder = config.defaults.destFolder;
const modulesFile = config.consolidate.destFileName;
const camelizeAllKeys = mapKeysDeep(obj => camelize(obj, true));
const data = camelizeAllKeys(walkJsonDirSync(apiFolder, modulesFile));

const Resolvers = {
  Query: {
    modules(root, { acadYear }) {
      log.info({ acadYear });
      log.info(Object.keys(data));
      log.info(data[acadYear]);
      return 'data[acadYear]';
    },
  },
};

const subLog = log.child({ path: 'graphql' });
const logger = {
  log: e => subLog.error(e),
};

const schema = makeExecutableSchema({
  typeDefs: Schema,
  resolvers: Resolvers,
  logger,
});

export default schema;
