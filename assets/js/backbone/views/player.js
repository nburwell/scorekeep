app.Views.Player = Backbone.View.extend({

  tagName: "li",
  
  initialize: function() {
    this.listenTo(this.model, "change", this.render);
  },
  
  template: _.template("<span class='handle'>::</span><h2><%= name %></h2><h3><%= score %></h3>"),
  
  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  }

});