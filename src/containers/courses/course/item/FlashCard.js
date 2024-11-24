import React, { useState, useEffect } from "react";
import { Button, Spin } from "antd";
import { SoundOutlined } from "@ant-design/icons";
import "../CourseDetail.scss";

export const FlashCard = (props) => {
  const [flip, setFlip] = useState(false);
  const synth = speechSynthesis;

  useEffect(() => {
    setFlip(false); // Reset trạng thái flip khi dữ liệu thẻ thay đổi
  }, [props.curCardId, props.name]);

  const speechHandler = () => {
    const msg = new SpeechSynthesisUtterance(props.name);
    const voices = synth.getVoices();
    msg.voice = voices[props.voiceId || 13];
    synth.speak(msg);
  };

  return (
    <div className="FlashCard">
      {props.loadingCard ? (
        <div className="loading-spinner">
          <Spin size="large" />
        </div>
      ) : (
        <div className="card-holder">
          <div
            className={`card ${flip ? "flip" : ""}`}
            onClick={() => setFlip(!flip)}
          >
            <div className="front">
              <p className="p-front">{props.curCardId}</p>
              <p>{props.name}</p>
            </div>
            <div className="back">
              <p>{props.description}</p>
            </div>
          </div>
          {!flip && (
            <div className="soundBtn" onClick={speechHandler}>
              <SoundOutlined />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
