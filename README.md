# webspec

Web interface that allows to listen to tracks and label them. The spectrogram can be zoomed, panned and scaled.

![Screenshot](https://github.com/plaf2000/webspec/blob/master/screenshot.jpeg)

The interface is located at `http://127.0.0.1:8000/webspec/test/`.

* Move around by clicking and dragging 
*  Zoom the spectrogram using the scroll wheel (shift + scroll wheel to change the ratio)
*  Add a new detection with shift+click and move the mouse around to make it larger (you have to be logged in from `http://127.0.0.1:8000/admin/` if you want that the changes get saved)
*  Modify the detections by clicking the borders and moving the mouse
*  You can modify the label name by clicking on it, but it won't get saved
*  Delete the label by clicking the trash icon

## Installation

First, create a virtual environment in the desired folder: 
```python3 -m venv /path/to/new/virtual/environment
```