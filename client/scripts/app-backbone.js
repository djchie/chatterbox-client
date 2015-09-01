$(document).ready(function() {

  var Message = Backbone.Model.extend({

    initialize: function (roomname, usernname, text) {
      this.set('roomname', roomname),
      this.set('username', username),
      this.set('text', text)
    }


  });

  var Room = Backbone.Collection.extend({

    model: Message,

  });

  var RoomOptionsView = Backbone.View.extend({

    initialize: function() {
      this.model.on('change', this.render, this);
    },

    render: function() {
      // Build out the room options
      var html = [
        '<option>',
        '</option>'
      ].join('');
      return this.$el.html(html);
    }

  });

  var ChatsView = Backbone.View.extend({

    initialize: function() {
      this.model.on('change', this.render, this);
    },

    render: function() {
      //build chats (from chat models?)
      var html = [
        '<div>',
        '</div>'
      ].join('');
      return this.$el.html(html);
    };

  });

  $('#roomOptions').append(RoomOptionsView.render());
  $('#chats').append(ChatsView.render());
});