const directory = document.getElementById('directory');

/*====================
     HTTP REQUEST
=====================*/
//A reusable function for fetching data from a server
//Fetches data from the specified URL
//Checks the status of the request, if OK, parses results to JSON format
//Logs an error if anything goes wrong
const fetchData = (url) => {
  return fetch(url)
    .then(checkStatus)
    .then(res => res.json())
    .catch(error => console.log('Looks like there was a problem', error))
}

//A reusable function for checking the status of a request
//If the response status is OK, promise resolves, else, throws an error
const checkStatus = (response) => {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

/*=========================
     PAGE CONSTRUCTION
==========================*/
let employeeData = {}

//Resuable function for capitalizing data taken from fetched data
const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//Takes the fetched data and builds mark up around it to display on page.
//Loops through the 12 returned objects and creates a div for each
const generateMarkup = (data) => {
  for (i = 0; i < 12; i += 1) {
    let pageMarkup = `
      <div id="${i}" class="employee">
        <div class="avatar">
          <img src="${data[i].picture.medium}" class="photo">
        </div>
        <div class="userInfo">
          <h3 class="name">${capitalizeFirstLetter(data[i].name.first)} ${capitalizeFirstLetter(data[i].name.last)}</h3>
          <p class="email">${data[i].email}</p>
          <p class="city">${capitalizeFirstLetter(data[i].location.city)}</p>
        </div>
      </div>
    `;
    directory.innerHTML += pageMarkup;
  }
}

//fetchData function is called, returning 12 objects from randomuser API
//generateMarkup function is called, passing the returned data as an argument
fetchData('https://randomuser.me/api/?results=12')
  .then(res => employeeData = res.results)
  .then(data => generateMarkup(data))


/*============
     MODAL
=============*/
const modal = document.createElement('div');
modal.id = "modal";
modal.className = "hidden";

let modalMarkup = `
  <div id="modalAvatar">
    <img src="">
  </div>
  <p id="modalName"></p>
  <p id="modalEmail"></p>
  <p id="modalCity"></p>
  <hr>
  <p id="modalPhone"></p>
  <p id="modalAddress"></p>
  <p id="modalBirth"></p>
`;

modal.innerHTML = modalMarkup;
