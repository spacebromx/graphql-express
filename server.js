const express = require('express')
const {graphqlHTTP} = require('express-graphql')
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
} = require('graphql')
const {Artists, Songs} = require('./data.js')
const app = express()

/**
 * Tutorial: https://www.youtube.com/watch?v=ZQL7tL2S0oQ
 */

const ArtistType = new GraphQLObjectType({
  name: 'Artist',
  description: 'Artist',
  fields: () => ({
    id: {type: GraphQLNonNull(GraphQLInt)},
    name: {type: GraphQLNonNull(GraphQLString)},
    songs: {
      type: GraphQLList(SongType),
      resolve: (artist) => Songs.filter((song) => song.artistId === artist.id),
    },
  }),
})

const SongType = new GraphQLObjectType({
  name: 'Song',
  description: 'Represents a song',
  fields: () => ({
    id: {type: GraphQLNonNull(GraphQLInt)},
    name: {type: GraphQLNonNull(GraphQLString)},
    artist: {
      type: ArtistType,
      resolve: (song) => Artists.find((artist) => artist.id === song.artistId),
    },
  }),
})

const RootQuery = new GraphQLObjectType({
  name: 'Query',
  description: 'Represents the main set of queries',
  fields: () => ({
    artists: {
      type: GraphQLList(ArtistType),
      resolve: () => Artists,
    },
    artist: {
      type: ArtistType,
      args: {id: {type: GraphQLNonNull(GraphQLInt)}},
      resolve: (_, args) => Artists.find((artist) => artist.id === args.id),
    },
    songs: {
      type: GraphQLList(SongType),
      resolve: () => Songs,
    },
    song: {
      type: SongType,
      args: {id: {type: GraphQLNonNull(GraphQLInt)}},
      resolve: (_, args) => Songs.find((song) => song.id === args.id),
    },
  }),
})

const schema = new GraphQLSchema({
  query: RootQuery,
})

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  }),
)

app.listen(5000, () => {
  console.log('✅ Server running on http://localhost:5000')
})
