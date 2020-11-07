# webspec

Web interface that allows to listen to tracks and label them. The spectrogram can be zoomed, panned and scaled.

* Move around by clicking and dragging 
*  Zoom with the spectrogram using the scroll wheel (shift + scroll wheel to change the ratio)
*  Add a new detction by holding shift, click and move the mouse around to make it larger (you have to be logged in from `http://127.0.0.1:8000/admin/` if you want that the changes get saved)
*  Modify the detections by clicking the borders and moving the mouse
*  You can modify the label name by clicking on it, but it won't get saved
*  Delete the label by clecking the trash icon



![Screenshot](https://github.com/plaf2000/webspec/blob/master/screenshot.jpeg)

The interface is located at `http://127.0.0.1:8000/webspec/test/`.

**Important**: The audio is located at `http://localhost/track.wav`. I used an Apache server in order to provide it (the problem was using the `currentTime` property in JavaScript, that it doesn't seem to work when providing the audio data with Django). You can specify the file path in `static/fname.js`.