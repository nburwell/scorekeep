app.Views.Game = Backbone.View.extend({

  initialize: function() {
    //this.listenTo(this.model, "change", this.render);
  },
  
  template: _.template("<h1>Players</h1><ul></ul>"),
  
  events: {
    "click":          "_onClick",
    "submit form":    "_onAddNew"
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

    app.playerList.on("selectionChanged", this._onSelectionChanged, this);
    app.playerList.render();
    
    return this;
  },
  
  _onAddNew: function() {
    var playerName = this.$('form input[name=name]').val();
    
    app.players.add({
      name: playerName,
      score: 0
    }, {
      at: app.players.length - 1
    });
    
    this._clearForm();
    return false;
  },
  
  _clearForm: function() {
    app.playerList.setSelectedModel();
    
    this.$('form button').blur();
    this.$('form input[name=name]').val('').focus();
  },
  
  _onClick: function(evt) {
    var list = this.$('.collection-list')[0];
    
    if (evt.target !== list && !$.contains(list, evt.target)) {
      // clear selection if I clicked myself when already in selected state
      app.playerList.setSelectedModel();
    }
  },
  
  _onSelectionChanged: function(newSelectedModels, oldSelectedModels) {
    console.log("onSelectedChange");
    _.each(oldSelectedModels, function(model) {
      model.set({ active: false });
    });
    
    _.each(newSelectedModels, function(model) {
      model.set({ active: true });
    });
  }

});