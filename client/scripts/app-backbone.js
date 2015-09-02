$(document).ready(function() {

  var Message = Backbone.Model.extend({

    defaults: {
      username: '',
      text: ''
    }

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

  var FormView = Backbone.View.extend({

    handleSubmit: function(e) {
      e.preventDefault();

      var message = new Message();
      // message.set('username', ???);
      // message.set('text', ???);
    }

  });

  var formView = new FormView({el: $('#messageForm')});

  var MessageView = Backbone.View.extend({

    template: _.template('<div class="chat"><%- objectId %> \
                          <div class="user"><%- username %></div> \
                          <div class="text"><%- text %></div> \
                          </div>'),

    render: function() {
      this.$el.html(this.template(this.model.attributes));
      return this.$el;
    }

  });

  var MessagesView = Backbone.View.extend({

    initialize: function() {
      this.collection.on('sync', this.render, this);
    },

    render: function () {
      this.collection.forEach(this.renderMessage, this);
    },

    renderMessage: function(message) {
      var messageView = new MessageView({model: message});
      var $html = messageView.render();
      this.$el.prepend($html);
    }
  });

  // var Room = Backbone.Collection.extend({

  //   model: Message,

  // });

  // var RoomOptionsView = Backbone.View.extend({

  //   initialize: function() {
  //     this.model.on('change', this.render, this);
  //   },

  //   render: function() {
  //     // Build out the room options
  //     var html = [
  //       '<option>',
  //       '</option>'
  //     ].join('');
  //     return this.$el.html(html);
  //   }

  // });

  // var ChatsView = Backbone.View.extend({

  //   initialize: function() {
  //     this.model.on('change', this.render, this);
  //   },

  //   render: function() {
  //     //build chats (from chat models?)
  //     var html = [
  //       '<div>',
  //       '</div>'
  //     ].join('');
  //     return this.$el.html(html);
  //   }

  // });

  // $('#roomOptions').append(this.RoomOptionsView.render());
  // $('#chats').append(ChatsView.render());

  //INITIALIZATION

  var messages = new Messages();
  messages.loadMsgs();
  var MessagesView = new MessagesView({el: $('#chats'), collection: messages});
  setInterval(messages.loadMsgs.bind(messages), 1000);
});