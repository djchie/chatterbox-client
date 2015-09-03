$(document).ready(function() {

  // TODO:
  // Implement the Room Model
  // Implement the Room Collection
  // Implement the Room View

  var Message = Backbone.Model.extend({
    url: 'https://api.parse.com/1/classes/chatterbox',
    defaults: {
      username: '',
      text: '',
      roomname: ''
    }

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
      this.collection.on('sync', this.stopSpinner, this);
      this.$el.find('#textMessage').keydown(function(e) {
        if (e.keyCode == 13) {
          e.preventDefault();
          $(this).trigger('enter');
        }
      });
    },

    events: {
      'click #sendMessage': 'handleSubmit',
      'enter': 'handleSubmit'
    },

    processKey: function(e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        this.handleSubmit(e);
      }
    },

    handleSubmit: function(e) {
      e.preventDefault();

      // To start the spinner when sending a message
      this.startSpinner();

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
    },

    startSpinner: function() {
      this.$('.spinner img').show();
      this.$('form input[type=submit]').attr('disabled', "true");
    },

    stopSpinner: function() {
      this.$('.spinner img').fadeOut('fast');
      this.$('form input[type=submit]').attr('disabled', null);
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

  var Room = Backbone.Model.extend({

    defaults: {
      roomname: ''
    }

  });

  var Rooms = Backbone.Collection.extend({
    model: Room,

  });

  var RoomView = Backbone.View.extend({

    template: _.template('<option value=<%- roomname %>><%- roomname %></option'),

    render: function() {
      this.$el.html(this.template(this.model.attributes));
      return this.$el;
    }

  });

  var RoomsView = Backbon.View.extend({

    initialize: function() {

    },

    render: function() {
      this.collection.forEach(this.renderRoom, this);
    }

    renderRoom: function(room) {
      var roomView = new RoomView({model:room});
      this.$el.prepend(roomView.render());
    }

  });

  // Initialization

  var messages = new Messages();
  var formView = new FormView({el: $('#main'), collection: messages});
  var MessagesView = new MessagesView({el: $('#chats'), collection: messages});
  setInterval(messages.loadMsgs.bind(messages), 1000);
  messages.loadMsgs();
});