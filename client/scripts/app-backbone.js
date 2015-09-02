$(document).ready(function() {

  var Message = Backbone.Model.extend({
    url: 'https://api.parse.com/1/classes/chatterbox',
    defaults: {
      username: '',
      text: '',
      roomname: ''
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
      var results = [];
      for (var i = response.results.length-1; i > -1; i--) {
        results.push(response.results[i]);
      }
      return results;
    }
  });

  var FormView = Backbone.View.extend({

    initialize: function () {
      // Tp stop the spinner when the collection is in sync
      // this.collection.on('sync', this.stopSpinner, this);
      console.log('got here");');
    },

    events: {
      "click #sendMessage": "handleSubmit"
    },

    handleSubmit: function(e) {
      e.preventDefault();

      // To start the spinner when sending a message
      // this.startSpinner();

      var $text = this.$('#textMessage');

      // var newMessage = new Message(message);
      // newMessage.save();

      // Creating a model will cause an immediate "add" event to be 
      // triggered on the collection, a "request" event as the new model 
      // is sent to the server, as well as a "sync" event, once the server 
      // has responded with the successful creation of the model.
      this.collection.create({
        username: window.location.search.substr(10),
        text: $text.val()
      });

      $text.val('');
    }

  });

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
      this.onscreenMessages = {};
    },

    render: function () {
      this.collection.forEach(this.renderMessage, this);
    },

    renderMessage: function(message) {
      if (!this.onscreenMessages[message.get('objectId')]) {
        var messageView = new MessageView({model: message});
        this.$el.prepend(messageView.render());
        this.onscreenMessages[message.get('objectId')] = true;
      }
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
  var formView = new FormView({el: $('#main'), collection: messages});
  var MessagesView = new MessagesView({el: $('#chats'), collection: messages});
  setInterval(messages.loadMsgs.bind(messages), 1000);
  messages.loadMsgs();
});