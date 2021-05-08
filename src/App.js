import React, { useEffect } from "react";
import "./App.css";
import { AppBar, CssBaseline, Fab, Grid, Toolbar } from "@material-ui/core";

var buffer, camera, canvas;
function App() {
  useEffect(() => {
    initCanvas();
    getAccesbleDeviceList().then((e) => initDevices(e));
  }, []);

  const initCanvas = () => {
    buffer = document.getElementById("buffer");
    canvas = document.getElementById("cameraDisplay");
    camera = canvas.getContext("2d");
    camera.canvas.height = window.innerHeight - 20;
    camera.canvas.width = window.innerWidth;
  };

  const initDevices = (dev) => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          deviceId: dev,
        },
      })
      .then((e) => {
        buffer.srcObject = e;
        render();
      });
  };

  const render = () => {
    camera.drawImage(buffer, 0, 0, canvas.width, canvas.height);
    requestAnimationFrame(render);
  };

  const saveImage = () => {
    let a = document.createElement("a");
    a.href = canvas.toDataURL("image/jpeg", 1);
    a.download = `pwacam${new Date().toISOString()}.jpg`;
    a.click();
  };

  const getAccesbleDeviceList = async () => {
    let devList = await navigator.mediaDevices.enumerateDevices();
    let filterKind = devList.filter((e) => {
      return e.kind === "videoinput";
    });
    let filteredGoodDevices = "";
    for (let i = 0; i < filterKind.length; i++) {
      try {
        await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: filterKind[i].deviceId,
          },
        });
        filteredGoodDevices = filterKind[i].deviceId;
        break;
      } catch (e) {}
    }
    return filteredGoodDevices;
  };

  return (
    <CssBaseline style={{ overflow: "hidden" }}>
      <canvas id="cameraDisplay"></canvas>
      <video id="buffer" autoPlay style={{ display: "none" }}></video>
      <AppBar
        position="fixed"
        color="primary"
        style={{ top: "auto", bottom: 0 }}
      >
        <Toolbar>
          <Grid
            container
            direction="row"
            justify="space-around"
            alignItems="center"
          >
            <Fab
              color="secondary"
              style={{
                position: "absolute",
                zIndex: 1,
                top: -30,
                left: 0,
                right: 0,
                margin: "0 auto",
                border: "1px solid white",
              }}
              onClick={saveImage}
            >
              +
            </Fab>
          </Grid>
        </Toolbar>
      </AppBar>
    </CssBaseline>
  );
}

export default App;
