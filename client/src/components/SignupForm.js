import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "../utils/mutation";
import swal from "sweetalert";
import Auth from "../utils/auth";
import { useFormik } from "formik";
import { signUpSchema } from "../utils/formValidationSchema";
import { useNavigate } from "react-router-dom";

const SignupForm = ({ handleModalClose }) => {
  const [createUser, { error }] = useMutation(CREATE_USER);
  if (error) {
    console.error("error on useMutation signup.js", error);
  }
  const navigate = useNavigate();
  // set state for form validation
  // set state for alert
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (error) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [error]);

  const onSubmit = async (values, actions) => {
    try {
      const { data } = await createUser({
        variables: { ...values },
      });
      const currentUser = data.createUser.user.username;
      // redirect user to /:username/deck... please check auth.js - login function.
      Auth.login(data.createUser.token);

      setShowAlert(false);
      swal("Success!", "Account created successfully!", "success");
      handleModalClose();
      navigate(`/${currentUser}/decks`)
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    actions.resetForm();
    console.log("Account created successfully!");
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
      username: "",
      email: "",
      password: "",
    },
    validationSchema: signUpSchema,
    onSubmit,
  });


  return (
    <>
      {/* This is needed for the validation functionality above */}
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
          Something went wrong with your signup!
        </Alert>

        <Form.Group>
          <Form.Label className="modal-text" htmlFor="username">
            Username
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Your username"
            name="username"
            onChange={handleChange}
            value={values.username}
            onBlue={handleBlur}
            className={errors.email && touched.email ? "input-error" : ""}
          />
          <Form.Control.Feedback type="invalid">
            Username is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label className="modal-text" htmlFor="email">
            Email
          </Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email address"
            name="email"
            onChange={handleChange}
            value={values.email}
            onBlue={handleBlur}
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
            placeholder="**********"
            name="password"
            onChange={handleChange}
            value={values.password}
            onBlue={handleBlur}
            className={errors.email && touched.email ? "input-error" : ""}
          />
          <Form.Control.Feedback type="invalid">
            Password is required!
          </Form.Control.Feedback>
        </Form.Group>
        <Button
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

export default SignupForm;