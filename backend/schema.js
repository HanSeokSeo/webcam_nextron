const axios = require("axios");
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList } = require("graphql");

const API_HOSTNAME = "http://localhost:3000";

const PatientType = new GraphQLObjectType({
  name: "Patient",
  fields: {
    chartNumber: { type: GraphQLString },
    name: { type: GraphQLString },
    dateOfBirth: { type: GraphQLString },
    gender: { type: GraphQLString },
    attendingPhysician: { type: GraphQLString },
  },
});

const query = new GraphQLObjectType({
  name: "Query",
  fields: {
    patients: {
      type: new GraphQLList(PatientType),
      resolve(parentValue, args) {
        return axios.get(`${API_HOSTNAME}/patient`).then((res) => res.data);
      },
    },
    patientByChartNumber: {
      type: PatientType,
      args: {
        chartNumber: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        return axios.get(`${API_HOSTNAME}/patient?chartNumber=${args.chartNumber}`).then((res) => res.data[0]);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query,
});
