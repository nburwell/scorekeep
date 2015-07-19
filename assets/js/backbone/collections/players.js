app.Collections.Players = Backbone.Collection.extend({
  model: app.Models.Player,

  sync: function() {
    return false;
  }
})
