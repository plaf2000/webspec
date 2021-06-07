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

First, you have to create a virtual environment. Move into the desired folder and start the virtual environment: 
```shell
python3 -m venv .
```

Then activate the virtual environment:

```shell
source bin/activate
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

Now move into the repository folder and install the dependencies:

```shell
cd webspec
pip3 install -r requirements.txt
```

Then you have to set the `SECRET_KEY` for Django. The script `generatekey.py` already does that

```
python3 generatekey.py
```

Now you have to update the models and create a super user

```shell
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py createsuperuser
```

and finally run the server via Django

```
python3 manage.py runserver
```

Now the project is running at `http://localhost:8000/`!

