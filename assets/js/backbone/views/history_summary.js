app.Views.HistorySummary = Backbone.View.extend({

  initialize: function() {
    //this.listenTo(this.model, "change", this.sync);
  },
  
  events: {
    "click .summary": "_onSummaryClick",
    "click .delete":  "_onDeleteClick"
  },
  
  template: _.template(
    "<% if (scores.length > 0) { %>" +
      "<a href='#' class='summary'><%= scores.length %></a>" +
      "<div class='history' style='display:none'>" +
        "<% for (score in scores) { %>" +
          "<%= scores[score] %> <a href='#' class='delete' data-score-index='<%= score %>'>x</a><br />" +
        "<% } %>" +
      "</div>" +
      "<% } else { %>" +
      "<%= scores.length %>" +
    "<% } %>"),
  
  render: function() {
    this.$el.html(this.template({ scores: this.model._getHistoryValues() }));
    return this;
  },
    
  _onSummaryClick: function(evt) {
    this.$('.history').slideToggle();
    $(evt.target).blur();
    return false;
  },
  
  _onDeleteClick: function(evt) {
    var index = $(evt.target).data('score-index');
    console.log("Deleting: " + index);

    this.model.removeScoreAt(index);
    $(evt.target).blur();
    return false;
  }

});