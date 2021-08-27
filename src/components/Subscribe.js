import React, { useEffect, useRef } from "react";
import { subscribeCall } from "../helper/LiveApi";

let url;
let jwt;
let iceServers;

const Subscribe = () => {
  const videoRef = useRef();

  const connect = async () => {
    const config = {
      iceServers: iceServers,
      rtcpMuxPolicy: "require",
      bundlePolicy: "max-bundle",
    };

    // RTC객체 생성 및 스트림 생성
    const pc = new RTCPeerConnection(config);

    pc.ontrack = function (event) {
      //Play it
      console.log(event);
      const vidWin = videoRef?.current;
      if (vidWin) {
        vidWin.srcObject = event.streams[0];
        vidWin.controls = false;
      }
    };
    const ws = new WebSocket(`${url}?token=${jwt}`);
    ws.onopen = async function () {
      if (pc.addTransceiver) {
        const stream = new MediaStream();
        pc.addTransceiver("audio", {
          direction: "recvonly",
          streams: [stream],
        });
        pc.addTransceiver("video", {
          direction: "recvonly",
          streams: [stream],
        });
      }

      const desc = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });

      console.log("createOffer Success!");
      pc.setLocalDescription(desc).then(() => {
        console.log("setLocalDescription Success!");
        let data = {
          streamId: "CEANfN/krmxvbmm",
          sdp: desc.sdp,
        };

        let payload = {
          type: "cmd",
          transId: 0,
          name: "view",
          data,
        };

        ws.send(JSON.stringify(payload));
      });
    };
    ws.addEventListener("message", (event) => {
      let msg = JSON.parse(event.data);
      console.log(msg);
      switch (msg.type) {
        //Handle counter response coming from the Media Server.
        case "response":
          let data = msg.data;
          let answer = new RTCSessionDescription({
            type: "answer",
            sdp: data.sdp + "a=x-google-flag:conference\r\n",
          });
          pc.setRemoteDescription(answer);
          break;
        default:
          return;
      }
    });
  };

  const init = async () => {
    const { data } = await subscribeCall();
    console.log(data);
    const { jwt: responseJwt, urls } = data.data;

    jwt = responseJwt;
    url = urls?.[0];
    await connect();
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay />
    </div>
  );
};

export default Subscribe;
