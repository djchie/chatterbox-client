$(document).ready(function() {

  var Message = Backbone.Model.extend({

    // initialize: function (roomname, usernname, text) {
    //   this.set('roomname', roomname),
    //   this.set('username', username),
    //   this.set('text', text)
    // }


  });

  var Messages = Backbone.Collection.extend({
    // Pass it the constructor to show what kind of models it needs to hold
    model: Message,
    // Location on the internet where it's supposed to grab it's data
    // Calling fetch() will use this url to grab data
    url: 'https://api.parse.com/1/classes/chatterbox',
    // Create a wrapper function to pass in order to an invoked fetch
    loadMsgs: function() {
      this.fetch({data: {order:'-createdAt'}});
    },
    // The Backbone parse is called everytime fetch is called
    parse: function(response, options) {
      return response.results;
    }
  });

  var MessageView = Backbone.View.extend({

  });

  var MessagesView = Backbone.View.extend({

    initialize: function() {
      this.collection.on('sync', this.render, this);
    }

    render: function () {
      console.log(this.collection.length);
      this.collection.forEach(this.renderMessage, this);
    },

    renderMessage: function(message) {
      var messageView = new MessageView({model: message});
      console.log(messageView);
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

  //INITIALIZATION

  var messages = new Messages();
  messages.loadMsgs();
  var MessagesView = new MessagesView({collection: messages});
});