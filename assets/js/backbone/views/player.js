app.Views.Player = Backbone.View.extend({

  tagName: "li",
  
  initialize: function() {
    this.listenTo(this.model, "change", this.sync);
  },
  
  events: {
    "change .score": "_onScoreChange"
  },
  
  template: _.template(
    "<% if (score === null) { %>" +
      "<form class='form-inline'><div class='form-group'><input type='text' class='form-control' name='name' /></div><button class='btn btn-primary'>Add New</button></form>" +
    "<% } %>" +
    "<% if (score !== null) { %>" +
      "<span class='handle'>::</span><h2><%= name %></h2>" +
      "<h3 class='active'><input type='text' value='<%= score %>' class='score form-control' /></h3>" +
      "<h3 class='readonly'><%= score %></h3>" +
    "<% } %>"),
  
  render: function() {
    this.$el.html(this.template($.extend({ active: false }, this.model.attributes)));
    this.sync();
    return this;
  },
  
  sync: function() {
    this.$el.toggleClass('new', this.model.get('score') === null);

    if (this.model.get('active')) {
      this.$('.active').show();
      this.$('.readonly').hide();
      setTimeout(function(){ this.$('.score').focus() }, 1);
    } else {
      this.$('.active').hide();
      this.$('.readonly').show();
    }
  },
  
  _onScoreChange: function() {
    this.model.set({ score: this.$('.score').val() });
  }

});