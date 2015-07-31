app.Views.HistorySummary = Backbone.View.extend({

  initialize: function() {
    //this.listenTo(this.model, "change", this.sync);
  },
  
  events: {
    "click .summary": "_onSummaryClick"
  },
  
  template: _.template(
    "<% if (scores.length > 0) { %>" +
      "<a href='#' class='summary'><%= scores.length %></a>" +
      "<div class='history' style='display:none'>" +
        "<% for (score in scores) { %>" +
          "<%= score %><br />" +
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
  }

});