import React, { Component } from "react";
import { publishCall } from "../helper/LiveApi";

let url;
let jwt;
let iceServers;

export default class LiveCast extends Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
  }
  componentDidMount() {
    this.init();
  }

  connect = async () => {
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
    console.log(stream);

    // 피어커넥션 등록
    stream.getTracks().forEach((track) => {
      console.log("track: ", track);
      pc.addTrack(track, stream);
    });

    this.videoRef.current.srcObject = stream;
    console.log(this.videoRef.current.srcObject);

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
          name: "krmxvbmm",
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
    ws.addEventListener("message", (event) => {
      console.log("ws::message", event);

      let msg = JSON.parse(event.data);
      switch (msg.type) {
        case "response":
          let data = msg.data;
          let answer = new RTCSessionDescription({
            type: "answer",
            sdp: data.sdp + "a=x-google-flag:conference\r\n",
          });
          pc.setRemoteDescription(answer)
            .then(() => {
              console.log("setRemoteDescription Success! ");
              console.log("YOU ARE BROADCASTING!");
            })
            .catch((e) => {
              console.log("setRemoteDescription failed: ", e);
            });
          break;
      }
    });
  };

  init = async () => {
    const { data } = await publishCall();
    const { jwt: responseJwt, urls } = data.data;

    jwt = responseJwt;
    url = urls?.[0];
    await this.connect();
  };

  render() {
    return (
      <div>
        <video ref={this.videoRef} />
      </div>
    );
  }
}
