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
      
          <div className="Social_links my-5">
            <a href="https://www.youtube.com/channel/UCrKYr_V7e_iDu-AikEWeB5A">
              <AiFillYoutube size="24px" />
            </a>
            <a href="https://discord.gg/zFuHN4H7Tx">
              <FaDiscord size="24px" />
            </a>
            <a href="https://www.facebook.com/farm2earn/?_rdc=2&_rdr">
              <FaFacebookF size="24px" />
            </a>
            <a href="https://twitter.com/farmtoearn">
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
