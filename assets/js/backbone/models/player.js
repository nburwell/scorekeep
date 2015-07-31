app.Models.Player = Backbone.Model.extend({
  initialize: function() {
    this.set('history', new app.Collections.Scores());
  },

  addScore: function(newScore) {
    this.get('history').push({ 'value' : newScore });
    
    this.set({
      score: this.getCurrentScore(),
      num_scores: this._getHistoryValues().length });
  },
  
  removeScoreAt: function(index) {
    this.get('history').remove(this.get('history').at(index));
    
    this.set({
      score: this.getCurrentScore(),
      num_scores: this._getHistoryValues().length });
  },

  getCurrentScore: function() {
    return _.reduce(this._getHistoryValues(), function(memo, num) { return memo + num }, 0);
  },
  
  _getHistoryValues: function() {
    return _.pluck(_.pluck(this.get('history').models, 'attributes'), 'value'); 
  },
  
  sync: function() {
    return false;
  }
});
