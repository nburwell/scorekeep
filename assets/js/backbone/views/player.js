app.Views.Player = Backbone.View.extend({

  tagName: "li",
  
  initialize: function() {
    this.listenTo(this.model, "change", this.render);
  },
  
  template: _.template(
    "<% if (score === null) { %>" +
      "<form class='form-inline'><div class='form-group'><input type='text' class='form-control' name='name' /></div><button class='btn btn-primary'>Add New</button></form>" +
    "<% } %>" +
    "<% if (score !== null) { %>" +
    "<span class='handle'>::</span><h2><%= name %></h2><h3><%= score %></h3>" +
    "<% } %>"),
  
  render: function() {
    this.$el.html(this.template(this.model.attributes));
    if (this.model.get('score') === null) {
      this.$el.addClass('new');
    }
    
    return this;
  }

});