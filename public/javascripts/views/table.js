define(['jquery', 'backbone', 'views/card'], function($, Backbone, cardView){
  var TableView = Backbone.View.extend({

    el: function(){
      return $('#table-' + this.model.id);
    },

    template: $('#template-table').html(),

    initialize: function() {
      this.listenTo(this.model, 'card-placed', this.placedCard);
      this.listenTo(this.model.get('cards'), 'reset', this.clear);
      this.cards = [];
    },

    render: function(){
      var table = {
        name: this.model.get('name')
      };
      this.$el.addClass('game-table');
      this.$el.html(Mustache.render(this.template, table));
      return this.$el;
    },

    placedCard: function(data){
      console.log(data.pid)
      var cv = new cardView.CardView({model: data.card, el: '#t-card-'+data.pid});
      this.$('#cards').append(cv.render());
      this.cards.push({id: data.pid, cardView: cv})
    },
    
    clear: function(data){
      var that = this;
      var winnerId = g.get('winner').playerId
      this.cards.forEach(function(c, i){
        console.log(c, i)
        var a = c.cardView.$el.offset();
        var b = $('#player-'+winnerId).offset();
        var top = (b.top-a.top);
        var left = (b.left-a.left) + $('#player-'+winnerId).width()/2;

        console.log(top + "-" + left);

        c.cardView.$el.animate(
          {
            top: "+=" + top,
            left: "+=" + left,
            opacity: 0
          },
          500,
          "swing",
          function(){
            c.cardView.remove();
            if(i==3){
              that.render();
              that.cards = [];
            }
          }
        );
      });
    }
  });

  return {
    TableView: TableView
  }
});
