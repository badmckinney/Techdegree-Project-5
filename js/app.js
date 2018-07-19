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
//Creates 12 identical divs for each employee that will be displayed
//Each div is appended as a child of the 'directory' div
let markup;

const generateMarkup = () => {
  for (i = 0; i < 12; i += 1) {
    fetchData('https://randomuser.me/api/')
      .then(res => markup = `
        <div class="employee">
          <img src="${res.results[0].picture.thumbnail}" class="photos">
          <h3 class="name">${res.results[0].name.first} ${res.results[0].name.last}</h3>
          <p class="email">${res.results[0].email}</p>
          <p class="city">${res.results[0].location.city}</p>
        </div>
        `)

    directory.innerHTML += markup;
  }
}
generateMarkup();

/*
//Variables containing arrays, created from the img, h3, and p elements in employee divs
const photos = document.querySelectorAll('.photos');
const names = document.querySelectorAll('.name');
const emails = document.querySelectorAll('.email');
const cities = document.querySelectorAll('.city');

for (i = 0; i < 12; i += 1) {
  fetchData('https://randomuser.me/api/')
    .then(res => photos[i].src = res.results[0].picture.thumbnail)
    .then(res => names[i].textContent = res.results[0].name.first + " " + res.results[0].name.last)
    .then(res => emails[i].textContent = res.results[0].email)
    .then(res => cities[i].textContent = res.results[0].location.city)
}
*/

fetchData('https://randomuser.me/api/')
  .then(res => console.log(res.results[0].picture.thumbnail))
