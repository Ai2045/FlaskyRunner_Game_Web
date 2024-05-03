fetch('/get_ranking_list')
.then(response => response.json())
.then(data => {
    let tableBody = document.getElementById('ranking-body');
    
    // Ordina l'array in base allo score in modo discendente
    data.sort((a, b) => b.score - a.score);
    
    // Prendi solo i primi 10 elementi per la classifica
    data.slice(0, 10).forEach((player, index) => {
        let row = document.createElement('tr');
        
        // Colonna per il numero in classifica
        let rankCell = document.createElement('td');
        rankCell.textContent = index + 1; // L'indice inizia da 0, quindi aggiungi 1
        rankCell.className = 'border px-4 py-2';
        row.appendChild(rankCell);
        
        let playerCell = document.createElement('td');
        playerCell.textContent = player.username;
        playerCell.className = 'border px-4 py-2';
        row.appendChild(playerCell);

        let scoreCell = document.createElement('td');
        scoreCell.textContent = player.score;
        scoreCell.className = 'border px-4 py-2';
        row.appendChild(scoreCell);

        tableBody.appendChild(row);
    });
})
.catch(error => console.error('Error:', error));

function filterPlayers(searchTerm) {
  const suggestionsElement = document.getElementById('suggestions');

  if (!searchTerm) {
    suggestionsElement.innerHTML = '';
    suggestionsElement.style.display = 'none';
    return;
  }

  fetch(`/filter_players?searchTerm=${encodeURIComponent(searchTerm)}`) // Codifica searchTerm per URL
    .then(response => response.json())
    .then(players => {
      let suggestionsHTML = '';
      // Costruisce il menu di suggerimenti con il nome del giocatore e un link al profilo
      players.forEach(player => {
        suggestionsHTML += `
          <div class="suggestion-item bg-gray-800 text-white px-4 py-2 border-b border-gray-700 hover:bg-gray-700 cursor-pointer transition duration-200 ease-in-out" onclick="goToProfile('${player}')">${player}</div>
        `;
      });
      suggestionsElement.innerHTML = suggestionsHTML;
      suggestionsElement.style.display = players.length ? 'block' : 'none';
    })
    .catch(error => console.error('Error:', error));
}

function goToProfile(username) {
  window.location.href = `/profile/${username}`;
}