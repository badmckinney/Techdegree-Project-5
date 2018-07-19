const employees = document.getElementById('employees');

const fetchData = (url) => {
  return fetch(url)
    .then(checkStatus)
    .then(res => res.json())
    .catch(error => console.log('Looks like there was a problem', error))
}

const checkStatus = (response) => {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

const generateMarkup = () => {
  let markup = `
    <div class="employee">
      <img>
      <h3 class="name"></h3>
      <p class="email"></p>
      <p class="city"></p>
    </div>
  `;

  for (i = 0; i < 12; i += 1) {
    employees.innerHTML += markup;
  }
}
generateMarkup();














fetchData('https://randomuser.me/api/')
  .then(res => console.log(res))
