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

//Takes the fetched data and builds mark up around it to display on page.
//Loops through the 12 returned objects and creates a div for each
const generateMarkup = (data) => {
  for (i = 0; i < 12; i += 1) {
    let markup = `
      <div class="employee">
        <img src="${data[i].picture.thumbnail}" class="photos">
        <h3 class="name">${data[i].name.first} ${data[i].name.last}</h3>
        <p class="email">${data[i].email}</p>
        <p class="city">${data[i].location.city}</p>
      </div>
    `;
    directory.innerHTML += markup;
  }
}

//fetchData function is called, returning 12 objects from randomuser API
//generateMarkup function is called, passing the returned data as an argument
fetchData('https://randomuser.me/api/?results=12')
  .then(res => employeeData = res.results)
  .then(data => generateMarkup(data))
