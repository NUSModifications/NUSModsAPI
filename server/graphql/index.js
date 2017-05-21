import { makeExecutableSchema } from 'graphql-tools';
import bunyan from 'bunyan';

import jsonData from './jsonData';

const log = bunyan.createLogger({ name: 'graphql' });

const Schema = `
type Module {
  code: String!
  title: String!
  department: String
  description: String
  credit: Float
  workload: String
  prerequisite: String
  corequisite: String
  corsBiddingStats: [CorsBiddingStats]
  history: [ModuleInfo]
}

type ModuleInfo {
  semester: Int
  examDate: String
  examOpenBook: Boolean
  examDuration: String
  examVenue: String
  timetable: [Lesson]
}

type CorsBiddingStats {
  quota: Int
  bidders: Int
  lowestBid: Int
  lowestSuccessfulBid: Int
  highestBid: Int
  faculty: String
  studentAcctType: String # TODO: Convert to ENUM
  acadYear: String
  semester: Int
  round: String # TODO: Convert to ENUM
  group: String
}

type Lesson {
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
  modules(acadYear: String!): [Module]
  module(acadYear: String!, code: String!): Module
}

schema {
  query: Query
}
`;

const Resolvers = {
  Query: {
    modules(root, { acadYear }) {
      return jsonData[acadYear];
    },
    module(root, { acadYear, code }) {
      return jsonData[acadYear][code];
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
