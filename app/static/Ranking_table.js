fetch('/get_ranking_list')
.then(response => response.json())
.then(data => {
  let tableBody = document.getElementById('ranking-body');
  data.forEach(player => {
    let row = document.createElement('tr');
    
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