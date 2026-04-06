async function loadLeaderboard() {
  const res = await fetch("http://localhost:5000/api/leaderboard");
  const data = await res.json();

  const table = document.querySelector("#leaderboardTable tbody");
  table.innerHTML = "";

  data.forEach((user, i) => {
    table.innerHTML += `
      <tr>
        <td>${i+1}</td>
        <td>${user.username}</td>
        <td>${user.score}</td>
        <td>${user.total}</td>
        <td>${user.category}</td>
      </tr>
    `;
  });
}

window.onload = loadLeaderboard;