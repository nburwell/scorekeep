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
      "<h3 class='readonly'><%= score %></h3>" +
      "<h3 class='active'><input type='text' name='score' value='' class='form-control' placeholder='add to score' /></h3>" +
    "<% } %>"),
  
  render: function() {
    this.$el.html(this.template($.extend({ active: false }, this.model.attributes)));
    this.sync();
    return this;
  },
  
  sync: function() {
    this.$('input[name=score]').trigger('change');
    
    this.$('.readonly').text(this.model.get('score'));
    
    this.$el.toggleClass('new', this.model.get('score') === null);

    console.log("sync. active: " + this.model.get('active'));
    
    if (this.model.get('active')) {
      this.$('.active').show();

      // don't mess with focus on new row so that keyboard events still work
      if (this.model.get('score') === null) {
        setTimeout(function(){ this.$('input[name=name]').focus() }, 1);        
      } else {
        setTimeout(function(){ this.$('input[name=score]').focus() }, 1);
      }
    } else {
      this.$('.active').hide();
      this.$('.readonly').show();
      
      this.$('input[name=score]').val('');
    }
  },
  
  _onScoreChange: function() {
    console.log("onScoreChange");
    this.model.set({ score: this.model.get('score') + parseInt(this.$('.score').val() || 0) });
  }

});