app.Collections.Scores = Backbone.Collection.extend({
  model: app.Models.Score,

  sync: function() {
    return false;
  }
})
