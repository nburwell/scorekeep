app.Views.Game = Backbone.View.extend({

  initialize: function() {
    //this.listenTo(this.model, "change", this.render);
  },
  
  template: _.template("<h1>Players</h1><ul></ul><form><input type='text' class='form-input' name='name' /><a href='#' class='add-new btn btn-primary'>Add New</a></form>"),
  
  events: {
    "click .add-new": "_onAddNew",
    "click":          "_onClick"
  },
  
  render: function() {
    this.$el.html(this.template());
    
    app.playerList = new Backbone.CollectionView({
      el: this.$("ul"),

      collection: app.players,
      modelView: app.Views.Player,
  
      selectable: true,
      sortable: true,
      sortableOptions: {
        handle: '.handle'
      }
    });

    app.playerList.render();
    
    return this;
  },
  
  _onAddNew: function() {
    var playerName = this.$('form input[name=name]').val();
    
    app.players.add({
      name: playerName,
      score: 0
    });
    
    this._clearForm();
  },
  
  _clearForm: function() {
    this.$('form input[name=name]').val('');
  },
  
  _onClick: function(evt) {
    console.log(evt.target);
    console.log(app.playerList.getSelectedModel());
    
    var list    = this.$('.collection-list')[0];
    
    window.lt = evt.target;
    window.list = list;
    
    if (evt.target !== list && !$.contains(list, evt.target)) {
      // clear selection if I clicked myself when already in selected state
      console.log("clearing selection");
      app.playerList.setSelectedModel();
    }
  }

});