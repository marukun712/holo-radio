    let isStarted = false;
    document.documentElement.addEventListener("mousedown", function() {
        if (!isStarted) {
            isStarted = true;

            mouse_IsDown = true;
            console.log("mouse down");
            document.getElementById('info').remove();
            const audioCtx = new AudioContext();

            //Create audio source
            //Here, we use an audio file, but this could also be e.g. microphone input
            const audioEle = new Audio();
            audioEle.src = "http://marukunserver.ml:8000/holo-radio.mp3"; //insert file name here
            audioEle.autoplay = true;
            audioEle.volume = 0.1
            audioEle.preload = "auto";
            audioEle.crossOrigin = "anonymous";
            const audioSourceNode = audioCtx.createMediaElementSource(audioEle);

            //Create analyser node
            const analyserNode = audioCtx.createAnalyser();
            analyserNode.fftSize = 256;
            const bufferLength = analyserNode.frequencyBinCount;
            const dataArray = new Float32Array(bufferLength);

            //Set up audio node network
            audioSourceNode.connect(analyserNode);
            analyserNode.connect(audioCtx.destination);

            //Create 2D canvas
            const canvas = document.createElement("canvas");
            canvas.width = 640;
            canvas.height = 110;
            document.body.appendChild(canvas);
            const canvasCtx = canvas.getContext("2d");
            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

            function draw() {
                //Schedule next redraw
                requestAnimationFrame(draw);

                //Get spectrum data
                analyserNode.getFloatFrequencyData(dataArray);

                //Draw black background
                canvasCtx.fillStyle = "rgb(255, 255, 255)";
                canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

                //Draw spectrum
                const barWidth = (canvas.width / bufferLength) * 2.5;
                let posX = 0;
                for (let i = 0; i < bufferLength; i++) {
                    const barHeight = (dataArray[i] + 140) * 2;
                    canvasCtx.fillStyle =
                        "rgb(" + Math.floor(barHeight + 100) + ", 50, 50)";
                    canvasCtx.fillRect(
                        posX,
                        canvas.height - barHeight / 2,
                        barWidth,
                        barHeight / 2
                    );
                    posX += barWidth + 1;
                }
            }

            draw();
        }
    });