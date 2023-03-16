import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_DECK } from "../utils/query";

import CardList from "../components/CardList";
import { Card, Modal, Row, Col, Container } from "react-bootstrap";
import CreateCardForm from "../components/CreateCardForm";

import { useDispatch, useSelector } from 'react-redux';
import { START_CAR, STOP_CAR, ADD_CAR } from '../utils/actions';

function CardWithModal() {
  const [showModal, setShowModal] = useState(false);
  const handleModalClose = () => setShowModal(false);
  const handleCardClick = () => setShowModal(true);

  // Get all cards from DB
  const { deckId: deckParam } = useParams();
  const { loading, data } = useQuery(QUERY_DECK, {
    variables: {
      _id: deckParam,
    },
  });

  const cards = data?.findSingleDeck.cards || [];

  // display loading
  if (loading) {
    return <h1>Loading...</h1>;
  }
  console.log(deckParam);
  console.log(data);
  return (
    <Container>
      {/* title for the page */}
      {/* <Row> */}
      <Row className="g-4 m-1">
        <h3 className="page-title text-center">Study Cards</h3>

      {/* create new card and Card List */}
      {/* <Row className="g-4 m-1"> */}
        <Col xs={12} sm={12} md={4} lg={3}>
          <Card
            className="text-center"
            onClick={handleCardClick}
            style={{ height: "200px" }}
          >
            <Card.Body>
              <Card.Text className="new-card-text">+ Create New Card</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        {/* render each card */}
        {cards.map((card, index) => (
          <Col key={card._id} xs={12} sm={12} md={6} lg={3} className="g-4">
            <CardList deckParam={deckParam} card={card} id={index} />
          </Col>
        ))}
      </Row>

      {/* create new card modal */}
      <Modal
        show={showModal}
        onHide={handleModalClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="modal-text ">Create New Card</Modal.Title>
        </Modal.Header>
        <Modal.Body id="contained-modal-title-vcenter">
          <CreateCardForm deckParam={deckParam} />
        </Modal.Body>
      </Modal>
      </Container>
  );
}

export default CardWithModal;
