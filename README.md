# webspec

Web interface that allows to listen to tracks and label them. The spectrogram can be zoomed, panned and scaled.
![Screenshot](https://github.com/plaf2000/webspec/blob/master/screenshot.jpeg)

The interface is located at `http://127.0.0.1:8000/webspec/test/`.

**Important**: The audio is located at `http://localhost/track.wav`. I used an Apache server in order to provide it (the problem was using the `currentTime` property in JavaScript, that it doesn't seem to work when providing the audio data with Django). You can specify the file path in `statc/fname.js`.