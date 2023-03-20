import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { LOGIN_USER } from "../utils/mutation";
import { useMutation } from "@apollo/client";
import { useFormik } from "formik";
import Auth from "../utils/auth";
import { useNavigate } from "react-router-dom";

const LoginForm = ({handleModalClose}) => {
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [login, { error }] = useMutation(LOGIN_USER);
  const navigate = useNavigate();

  const onSubmit = async (values, actions) => {
    try {
      const { data } = await login({
        variables: { ...values },
      });

      const user = data.login.user.username;
      Auth.login(data.login.token);

      handleModalClose();
      navigate(`/${user}/decks`)
    } catch (error) {
      console.error(error);
      setShowAlert(true);
    }

    actions.resetForm();
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleSubmit,
    handleBlur,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit,
  });

  if (error) {
    console.error("error on useMutation loginform.js", error);
  }

  return (
    <>
      <Form
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <Alert
          dismissible
          onClose={() => setShowAlert(false)}
          show={showAlert}
          variant="danger"
        >
          Something went wrong with your login credentials!
        </Alert>

        <Form.Group>
          <Form.Label className="modal-text" htmlFor="email">
            Email
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Your email"
            name="email"
            onChange={handleChange}
            value={values.email}
            onBlur={handleBlur}
            className={errors.email && touched.email ? "input-error" : ""}
          />
          <Form.Control.Feedback type="invalid">
            Email is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label className="modal-text" htmlFor="password">
            Password
          </Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            name="password"
            onChange={handleChange}
            value={values.password}
            onBlur={handleBlur}
            className={errors.password && touched.password ? "input-error" : ""}
          />
          <Form.Control.Feedback type="invalid">
            Password is required!
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          // TODO: styling when the button is disabled
          // target it with === button:disabled
          disabled={isSubmitting}
          type="submit"
          variant="success"
          className="auth-btn"
        >
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;