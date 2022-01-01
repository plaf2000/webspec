# webspec

Web interface that allows to listen to tracks and label them while viewing the spectrogram. The tracks can be organized into projects and devices.

![Screenshot](https://github.com/plaf2000/webspec/blob/master/screenshot.jpeg)

You can create a project from the home page, but, at the moment, forms to add devices, recorders, places and audio files are unfortunately unavailable, so you have to add them from http://localhost:8000/admin:

1. Add the desired recorder(s) and place(s)
2. Add the desired device(s) (use the recorder's id to reference it)
3. Add the device context(s) (use the project's, device's and place's ids to reference them)
4. Add the file(s) (use the device's and place's ids to reference them)

Then you should be able to see the devices by simply opening the project or going to `http://localhost:8000/admin/projects/<project_id>`.

About the spectrogram interface:

* Move around by clicking and dragging 
* Zoom the spectrogram using the scroll wheel (shift + scroll wheel to change the ratio)
* Add a new detection with shift+click and move the mouse around to make it larger (you have to be logged in from http://localhost:8000/admin/ if you want that the changes get saved)
* Modify the detections by clicking the borders and moving the mouse
* You can modify the label name by clicking on it, but it won't get saved
* Delete the label by clicking the trash icon



**The current version contains a lot of bugs. Many things are getting corrected in the unstable branch, which will be merged in the main branch once the work will be completed.**

## Installation

First, you have to create a virtual environment. Move into the desired folder and create the virtual environment: 
```shell
python3 -m venv .
```

Then activate the virtual environment:

```shell
# Linux, macOS:
source bin/activate
# Windows:
Scripts\activate
```

Now you can clone the project with either

```shell
git clone https://github.com/plaf2000/webspec.git
```

or

```shell
git clone git@github.com:plaf2000/webspec.git
```

or by downloading the zip file.

Now move into the repository folder and run the installer:

```shell
cd webspec && sh installer.sh
```

Now log in from http://localhost:8000/admin using the user name and password you've just set. Then the platform should be running at http://localhost:8000/!

To interrupt the server press `CTRL+c`. If you want to restart the server, make sure the virtual environment is activated (`deactivate` in order to deactivate it) and you're into the repository folder (`/path/to/your/venv/webspec`), then run the server by typing `python3 manage.py runserver`.

