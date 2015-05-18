if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Tracker.autorun(function() {
    var p5loaded = Session.get('p5.setup');
    if (p5loaded) {
      loadSound('/beat.mp3',function(beat) {
        beat.loop();
      }, function(percent) {
      });
    }
  });

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
