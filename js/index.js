const searchForm = document.getElementById('github-form');
const searchInput = document.getElementById('search');
const resultsContainer = document.getElementById('github-container');

searchForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent form submission

  const searchTerm = searchInput.value.trim();

  if (searchTerm !== '') {
    searchUsers(searchTerm);
  }
});

async function searchUsers(username) {
  const apiUrl = `https://api.github.com/search/users?q=${username}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (response.ok) {
      displayUsers(data.items);
    } else {
      displayError(data.message);
    }
  } catch (error) {
    displayError('An error occurred while searching for users.');
  }
}

async function getUserRepos(username) {
  const apiUrl = `https://api.github.com/users/${username}/repos`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (response.ok) {
      displayRepos(data);
    } else {
      displayError(data.message);
    }
  } catch (error) {
    displayError('An error occurred while fetching user repositories.');
  }
}

function displayUsers(users) {
  resultsContainer.innerHTML = '';

  users.forEach((user) => {
    const userElement = document.createElement('div');
    userElement.innerHTML = `
      <img src="${user.avatar_url}" alt="${user.login}" width="100">
      <p><a href="#" class="user-link" data-username="${user.login}">${user.login}</a></p>
    `;
    resultsContainer.appendChild(userElement);
  });

  const userLinks = document.getElementsByClassName('user-link');
  Array.from(userLinks).forEach((link) => {
    link.addEventListener('click', (event) => {
      const username = event.target.dataset.username;
      getUserRepos(username);
    });
  });
}

function displayRepos(repos) {
  resultsContainer.innerHTML = '';

  if (repos.length === 0) {
    const message = document.createElement('p');
    message.textContent = 'This user has no repositories.';
    resultsContainer.appendChild(message);
  } else {
    repos.forEach((repo) => {
      const repoElement = document.createElement('div');
      repoElement.innerHTML = `
        <p><a href="${repo.html_url}" target="_blank">${repo.name}</a></p>
      `;
      resultsContainer.appendChild(repoElement);
    });
  }
}

function displayError(message) {
  const errorElement = document.createElement('p');
  errorElement.textContent = `Error: ${message}`;
  resultsContainer.innerHTML = '';
  resultsContainer.appendChild(errorElement);
}