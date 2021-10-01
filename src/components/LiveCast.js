import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { publishCall, streamName } from "../helper/LiveApi";
import { startUserCount } from "./UserCount";

let url;
let jwt;
let iceServers = [
  { urls: ["stun:tk-turn2.xirsys.com"] },
  {
    username:
      "9q5mE7MfPmIPCZJ2BhMrmI9HrmZkFB9mBfZuKzj6z3nfMLEu0YySXf27IDjXDtHzAAAAAGD1NFMxbWlsbGlvbg==",
    credential: "4c94fb70-e869-11eb-ae82-0242ac140004",
    urls: [
      "turn:tk-turn2.xirsys.com:80?transport=udp",
      "turn:tk-turn2.xirsys.com:3478?transport=udp",
      "turn:tk-turn2.xirsys.com:80?transport=tcp",
      "turn:tk-turn2.xirsys.com:3478?transport=tcp",
      "turns:tk-turn2.xirsys.com:443?transport=tcp",
      "turns:tk-turn2.xirsys.com:5349?transport=tcp",
    ],
  },
];
const accountId = "CEANfN";

const LiveCast = () => {
  const videoRef = useRef();

  const connect = async () => {
    const config = {
      iceServers: iceServers,
      rtcpMuxPolicy: "require",
      bundlePolicy: "max-bundle",
    };

    // RTC객체 생성 및 스트림 생성
    const pc = new RTCPeerConnection(config);
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    videoRef.current.srcObject = stream;

    console.log(stream);

    // 피어커넥션 등록
    stream.getTracks().forEach((track) => {
      console.log("track: ", track);
      pc.addTrack(track, stream);
    });

    console.log(videoRef.current.srcObject);

    const ws = new WebSocket(`${url}?token=${jwt}`);
    console.log(ws);
    ws.onopen = async function () {
      const desc = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      console.log("createOffer Success!");
      pc.setLocalDescription(desc).then(() => {
        console.log("setLocalDescription Success!");
        let data = {
          name: streamName,
          sdp: desc.sdp,
          codec: "h264",
        };

        let payload = {
          type: "cmd",
          transId: Math.random() * 10000,
          name: "publish",
          data,
        };

        ws.send(JSON.stringify(payload));
      });
    };

    ws.addEventListener("message", (evt) => {
      console.log("ws::message", evt);
      let msg = JSON.parse(evt.data);
      switch (msg.type) {
        //Handle counter response coming from the Media Server.
        case "response":
          console.log(msg);

          let data = msg.data;
          let answer = new RTCSessionDescription({
            type: "answer",
            sdp: data.sdp + "a=x-google-flag:conference\r\n",
          });
          pc.setRemoteDescription(answer)
            .then((d) => {
              console.log("setRemoteDescription Success! ");
              console.log("YOU ARE BROADCASTING!");
            })
            .catch((e) => {
              console.log("setRemoteDescription failed: ", e);
            });
          break;
      }
    });
    const countEle = document.querySelector(".count");
    startUserCount(accountId, streamName, countEle);
  };

  const init = async () => {
    const { data } = await publishCall();
    const { jwt: responseJwt, urls } = data.data;

    jwt = responseJwt;
    url = urls?.[0];
    await connect();
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <PlayerContainer>
      <span>{streamName}</span>
      <Player ref={videoRef} autoPlay />
      <div className="count"></div>
    </PlayerContainer>
  );
};

export default LiveCast;

const PlayerContainer = styled.div`
  width: 100%;
  height: 600px;
`;

const Player = styled.video`
  width: 600px;
  height: 400px;
`;
