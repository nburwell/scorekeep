var playerModels = [];
playerModels.push(new app.Models.Player({ name: "John Doe", score: 15 }));
playerModels.push(new app.Models.Player({ name: "James Smith", score: 10 }));
playerModels.push(new app.Models.Player({ name: "Jane Doe", score: 3 }));
playerModels.push(new app.Models.Player({ name: "[add new]", score: null }));

app.players = new app.Collections.Players(playerModels);

app.game = new app.Views.Game({ el: $("#app") });
app.game.render();