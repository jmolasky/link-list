# Link List

A web application that uses MongoDB and Express to allow users to save links to web pages and other web resources.

I was inspired to make this application by my experience of suddenly realizing I had 40 different tabs open while working on a coding project. They contained very specific information, so I didn't want to bookmark them, but I also wanted to keep them as references without overtaxing my computer. 

I use a Chrome extension that manages tabs, but it only displays the tab's name as a link, without any other information like notes about the tab or screenshots to remind me about the tab's contents. 

This app stores links to web pages on a database, but unlike the Chrome extension it also lets the user store a description of the resource as well as tags so the resource can be catalogued on the database and an imbedded video (in the case of the resource being a YouTube video) or screenshot that the application automatically captures and stores when the link is added to the database.

## Technologies Used

- JavaScript
- HTML5
- CSS3
- NodeJS
- Express
- EJS
- MongoDB
- Mongoose
- jQuery
- Axios
- bcrypt
- LinkPreview API

## Screenshots
![Home Page](https://i.imgur.com/D3yQJo3.png)

![Add a Link](https://i.imgur.com/WYmNJcv.png)

![Adding Tags](https://i.imgur.com/4smceJc.png)

![Adding Tags cont.](https://i.imgur.com/1foaeZ8.png)

![Populated Home Page](https://i.imgur.com/3qttnnS.png)

![Expanded Link](https://i.imgur.com/B0V3pBp.png)

![Search](https://i.imgur.com/VDcKVZg.png)

![Search Results](https://i.imgur.com/m1XJzRe.png)

![Responsive Design](https://i.imgur.com/Dm8YVs5.png)

## Getting Started 

[Click here](https://link-list-92.herokuapp.com/) to see the site live!

Simply sign up for an account and start adding links and tags!

## Future Enhancements/Next Steps

- I think it would be interesting to add a public feed available to logged-in users where links that users didn't mark as "private" when they uploaded them (all links are marked as private by default unless a user opts out) are displayed. I have a "private" property for the links on the database but I haven't yet implemented this feature.

- I would also like to add the ability to edit a link's tags (add or delete tags) as well as its other properties.

- Users can currently filter links by a single tag but I would like to add functionality that allows a user to filter by more than one tag at once.
