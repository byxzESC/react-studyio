const { AuthenticationError } = require("apollo-server-express");
const { Card, Deck, User } = require("../models");
const { signToken } = require("../utils/Auth");

const resolvers = {
  Query: {
    // Find by username populate decks
    findUser: async (parent, { username }) => {
      const user = await User.findOne({ username: username }).populate({
        path: "decks",
        populate: {
          path: "cards",
        },
      });
      console.log(user);
      return user;
    },
    // Find by userId sort deck
    findAllDecks: async (parent, { username }) => {
      return Deck.find({ username: username })
        .sort({ _id: -1 })
        .populate("cards");
    },
    // Find by deck id populate cards
    findSingleDeck: async (parent, { deckId }) => {
      return Deck.findOne({ _id: deckId }).populate("cards");
    },
    // Find by card id sort cards
    findSingleCard: async (parent, { cardId }) => {
      return Card.findOne({ _id: cardId }).sort({ _id: -1 });
    },
  },

  Mutation: {
    createDeck: async (parent, { username, name }, context) => {
      // if (context.user) {
      // const decks = await Deck.create({
      //     name
      // });
      //   const cardInputs = await Card.collection.insertMany(cards)
      //     console.log("==============", cards, "=====================")
      //     console.log(cardInputs)

      const deck = await Deck.create({ name, username });

      // await User.findOneAndUpdate(
      // { _id: context.user._id },
      //     { $addToSet: { deck: decks._id } }
      // );
      await User.findOneAndUpdate(
        { username: username },
        { $addToSet: { decks: deck._id } }
      );

      return deck;
      // }
      throw new AuthenticationError("You need to be logged in!");
    },
    createCard: async (parent, { deckId, question, answer }, context) => {
      // find user using context.user after auth works
      try {
        const newCard = await Card.create({
          deckId,
          question,
          answer,
        });
        const deck = await Deck.findOneAndUpdate(
          { _id: deckId },
          { $addToSet: { cards: newCard._id } },
          { new: true, runValidators: true, versionKey: false }
        );
        return newCard;
      } catch (error) {
        console.error(error);
      }
    },
    updateDeck: async (parent, { deckId, name }) => {
      return Deck.findOneAndUpdate({ _id: deckId }, { name }, { new: true });
    },
    updateCard: async (parent, { cardId, question, answer }) => {
      return await Card.findOneAndUpdate(
        { _id: cardId },
        { question, answer },
        { new: true }
      );
    },

    deleteDeck: async (parent, { userId, deckId }, context) => {
      const deck = await Deck.findOneAndDelete({
        _id: deckId,
      });

      const updateUser = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { decks: { $in: [deckId] } } },
        { new: true }
      );

      console.log(updateUser);
      return deck;
    },

    deleteCard: async (parent, { deckId, cardId }, context) => {
      // find the deck and update its cards array
      const updatedDeck = await Deck.findOneAndUpdate(
        { _id: deckId },
        { $pull: { cards: { $in: [cardId] } } },
        { new: true }
      );
      // find the card and delete it
      return Card.findOneAndDelete({ _id: cardId });
    },

    createUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      console.log("successfully created " + user);

      return { token, user };
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const token = signToken(user);

      return { token, user };
    },
  },
};

module.exports = resolvers;
