# catalog
Udacity - item catalog app


## Description
This app is meant to collect italian recipes. Each recipe belongs to one of the [20 italian regions](https://en.wikipedia.org/wiki/Regions_of_Italy). Considering this app as a catalog, recipes correspond to items and regions correspond to categories. A 3rd party authentication system (Google and Facebook) is implemented to let users add, update and delete recipes. Also, this app implements API endpoints, where the response format can be either JSON or XML.
This app is based upon the Flask Python framework for the back end, and it leverages the Backbone JS framework for the front end. The UX should be fine on any device.


## Requirements
- [Vagrant](https://www.vagrantup.com/)
- [VirtualBox](https://www.virtualbox.org/)
- [Python ~2.7](https://www.python.org/)


## Set Up

For an initial set up please follow these 2 steps:

1. Download or clone the [fullstack-nanodegree-vm repository](https://github.com/udacity/fullstack-nanodegree-vm).

2. Find the *catalog* folder and replace it with the content of this current repository, by either downloading it or cloning it - [Github Link](https://github.com/iliketomatoes/tournament).


## Usage

Launch the Vagrant VM from inside the *vagrant* folder with:

`vagrant up`

`vagrant ssh`

Then move inside the catalog folder:

`cd /vagrant/catalog`

Then lift the application:

`python app.py`

After the last command you are able to browse the application at this URL:

`http://localhost:8000/`

It is important you use *localhost* instead of *0.0.0.0* inside the URL address. That will prevent OAuth from failing.


## API endpoints (only works with GET requests)

Standard response format is JSON. By adding the **?xml=true** query parameter you will get the same data you requested, receiving it in an XML format. 

Endpoints:

| Request | What you get | 
| ------------- |:-------------:|
| /recipes | Get all recipes |
| /recipes?region_id=*REGION ID* | Get all recipes that belongs to the given region |
| /recipes?user_id=*USER ID* | Get all recipes that belongs to the given user. Can't be used together with **region_id** |
| /recipes/*RECIPE ID* | Get single recipe |
| /regions | Get all the regions |
| /regions?catalog=true | Get all the regions with the recipes belonging to each region. It basically return the whole catalog. |
| /regions?count=true | Get all the regions with the recipe counter for each region. Can't be used together with **catalog** |
| /regions/*REGION ID* | Get single region |
| /regions/*REGION ID*?catalog=true | Get the given region and all its recipes. |
| /users | Get all registered users |
| /users/*USER ID* | Get single user |


## Credits

This project was inspired by [www.academiabarilla.com](http://www.academiabarilla.com/en/italian-recipes/dir/Speciali/Ricette.aspx). I didn't like that website's UX and UI, though I found it to have interesting contents. So I decided to make a prototype of a more modern version of that website. Some (if not all) the recipes and the images you will find in this app are borrowed from [www.academiabarilla.com](http://www.academiabarilla.com/en/italian-recipes/dir/Speciali/Ricette.aspx) indeed. 

The default recipe's picture was taken from [www.subtlepatterns.com](http://subtlepatterns.com/?s=food).

This app is not intended for commercial use. It's just for educational purpose.
