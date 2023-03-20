import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_DECKS } from "../utils/query";
// import { UPDATE_DECK, DELETE_DECK } from "../utils/mutation";
import DeckList from "../components/DeckList";
import { Container, Card, Modal, Row, Col } from "react-bootstrap";
import CreateDeckForm from "../components/CreateDeckForm";

const Decks = () => {
  const { username: usernameParam } = useParams();
  const { loading, data } = useQuery(QUERY_DECKS, {
    variables: { username: usernameParam },
  });

  // handles visibility of createDeck Modal
  const [showModal, setShowModal] = useState(false);

  const handleModalClose = () => setShowModal(false);
  const handleCardClick = () => setShowModal(true);

  const decks = data?.findAllDecks || {};

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Row>
      <h3 className="page-title text-center">Study Decks</h3>
        {/* button to show Card modal */}
        <Col  xs={12} sm={12} md={4} lg={3}>
          <Card
            className="text-center mt-4"
            onClick={handleCardClick}
            style={{ height: "200px" }}
          >
            <Card.Body>
              <Card.Text className="new-deck-text"
              >
                + Create New Deck
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Modal
          show={showModal}
          onHide={handleModalClose}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          {/* modal card */}
          <Modal.Header closeButton>
            <Modal.Title className="modal-Text">Create New Deck</Modal.Title>
          </Modal.Header>

          <Modal.Body id="contained-title-vcenter">
            <CreateDeckForm username={usernameParam} handleModalClose={() => setShowModal(false)} />
          </Modal.Body>
        </Modal>
        {/* list of our decks */}
        {decks.map((deck, index) => (
          <Col key={deck._id}  xs={12} sm={12} md={4} lg={3} className="g-4">
            <DeckList deck={deck} id={index} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Decks;
