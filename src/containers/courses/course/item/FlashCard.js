import { SoundOutlined } from "@ant-design/icons";
import { Button, Spin } from "antd";
import React, { useState } from "react";
import "../CourseDetail.scss";

export const FlashCard = (props) => {
  const [flip, setFlip] = useState(false);
  let msg = new SpeechSynthesisUtterance();
  let synth = speechSynthesis;

  const speechHandler = (msg) => {
    msg.text = props.name;
    msg.voice = synth.getVoices()[props.voiceId || 13];
    window.speechSynthesis.speak(msg);
    console.log(synth.getVoices());
  };
  return (
    <div className="FlashCard">
      {props.loadingCard ? (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Spin size={"large"} />
        </div>
      ) : (
        <div className="card-holder">
          <div
            className={`card ${flip ? "flip" : ""}`}
            onClick={() => setFlip(!flip)}
          >
            {/* <div className="soundBtn" onClick={() => speechHandler(msg)}>
              <SoundOutlined />
            </div> */}
            <div className="front">
              <p className="p-front">{props.curCardId}</p>
              <p>{props.name}</p>
            </div>
            <div className="back">
              <p>{props.description}</p>
            </div>
          </div>
          <div
            className={`soundBtn ${
              !flip ? "blockSound" : "hiddenSound"
            }`}
            onClick={() => speechHandler(msg)}
          >
            <SoundOutlined />
          </div>
        </div>
      )}
    </div>
  );
};
