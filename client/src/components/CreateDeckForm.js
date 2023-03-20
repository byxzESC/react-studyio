import React, { useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { CREATE_DECK } from "../utils/mutation";
import { useMutation } from "@apollo/client";
// import { useNavigate } from "react-router-dom";

const CreateDeckForm = ({ username }) => {
  const [deckName, setDeckName] = useState("");
  const [createDeck, { error }] = useMutation(CREATE_DECK);
  // const navigate = useNavigate();
  // console logging error from useMutation
  if (error) {
    console.error("error on line 11 createDeckForm.js", error);
  }
  const handleFormSubmit = async (e) => {
    e.preventDefault();

        try {
            console.log(deckName)
            const { data } = await createDeck({
              variables: { username: username, name: deckName },
            })
            console.log(username)
            const user = data.createDeck.username;
            // window.location.assign(`${username}/decks`)
            window.location.reload()
            // navigate(`/${user}/decks`)
            setDeckName('')
        } catch (err) {
            console.error(err)
        }

    }
  

  const handleChange = (e) => {
    console.log(e);
    const { name, value } = e.target;
    console.log(name, value);
    if (name === "deckName" && value.length <= 30) {
      setDeckName(value);
    }
  };

  return (
    <div>
      {/* <Modal.Header closeButton>
          <Modal.Title className="modal-Text">Create New Deck</Modal.Title>
        </Modal.Header>

        <Modal.Body> */}
      <Form.Group className="mb-3" controlId="cardQ">
        <Form.Label className="modal-text text-center" htmlFor="deckName">
          Deck Name
        </Form.Label>
        <Form.Control
          as="textarea"
          name="deckName"
          onChange={handleChange}
          rows={1}
        />
      </Form.Group>
      {/* </Modal.Body> */}
      <Modal.Footer>
        <Button variant="secondary">Close</Button>
        <Button type="submit" variant="primary" onClick={handleFormSubmit}>
          Save changes
        </Button>
      </Modal.Footer>
    </div>
  );
};

export default CreateDeckForm;
