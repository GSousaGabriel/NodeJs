const { buildSchema } = require('graphql')

module.exports = buildSchema(`
    type Post{
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        author: User!
        createdAt: String!
        updatedAt: String!
    }

    type User{
        _id: ID!
        name: String!
        email: String!
        password: String
        status: String!
        posts: [Post!]!
    }

    input UserInputData{
        email: String!
        name: String!
        password: String!
    }

    input PostInputData{
        title: String!
        content: String!
        imageUrl: String!
    }

    type PostData{
        posts: [Post!]!
        totalPosts: Int!
    }

    type AuthData{
        token: String!
        userId: String!
    }

    type RootQuery{
        loginUser(email: String!, password: String!): AuthData!
        getPosts(cPage: Int): PostData!
        getPost(id: ID!): Post!
        getStatus: User! 
    }

    type RootMutation{
        createUser(userInput: UserInputData): User!
        createPost(postInput: PostInputData): Post!
        updatePost(id: ID!, postInput: PostInputData): Post!
        deletePost(id: ID!): Boolean
        updateStatus(newStatus: String!): Boolean
    }

    schema{
        query: RootQuery
        mutation:RootMutation
    }
`)