var playerModels = [];
playerModels.push(new app.Models.Player({ name: "Nick", score: 0 }));
playerModels.push(new app.Models.Player({ name: "Megan", score: 0 }));
//playerModels.push(new app.Models.Player({ name: "Brooklyn", score: 0 }));
playerModels.push(new app.Models.Player({ name: "[add new]", score: null }));

app.players = new app.Collections.Players(playerModels);

app.game = new app.Views.Game({ el: $("#app") });
app.game.render();

app.players.models[0].addScore(7);
app.players.models[0].addScore(4);
app.players.models[0].addScore(12);