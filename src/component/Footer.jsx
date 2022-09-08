import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { AiFillYoutube } from "react-icons/ai";
import { FaDiscord, FaFacebookF, FaTwitter } from "react-icons/fa";
class footer extends Component {
  state = {};
  render() {
    return (
      <div className="footer">
        <div className="content">
          <h5 className="text-center mt-4">Subscribe Form</h5>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Control type="email" placeholder="Email Address" />
          </Form.Group>
          <Button variant="dark" className="mb-5">
            Submit
          </Button>
          <div className="Social_links my-5">
            <a href="#">
              <AiFillYoutube size="24px" />
            </a>
            <a href="#">
              <FaDiscord size="24px" />
            </a>
            <a href="#">
              <FaFacebookF size="24px" />
            </a>
            <a href="#">
              <FaTwitter size="24px" />
            </a>
          </div>
          <p className="text-center">©2022 by Enhanced Finance Solution Ltd.</p>
        </div>
      </div>
    );
  }
}

export default footer;
