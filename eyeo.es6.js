DJs = new Meteor.Collection('DJs');

if (Meteor.isClient) {
  Deps.autorun(function() {
    Meteor.subscribe('djSubscription');
  });

  Template.p5.onCreated(function() {
    var angle = 0;
    var speed = 0;
    var beat;
    var going_forward = true;
    const LOW_SPEED = -1.2;
    const HIGH_SPEED = 1.2;
    const DECELERATION = 0.15;
    const FRAME_RATE = 30;
    const TIMEOUT = 500;
    Session.set('last_direction', 1);
    Session.set('last_event', Date.now()-TIMEOUT);
    var setupTransforms = function(p) {
      going_forward = speed >= 0;

      p.push();
      p.noStroke();
      p.translate(p.width/2,p.height/2);
      p.rotate(p.PI*angle);
      p.fill(p.color(30,30,30));
      p.ellipse(0,0,p.width/2-20,p.width/2-20);
      p.fill(p.color(162,208,185));
      p.ellipse(0,0,180,180);
      p.fill(p.color(30,30,30));
      p.ellipse(0,0,50,50);
      p.fill(p.color(255,255,255));
      p.ellipse(0,0,3,3);
      p.fill(p.color(0,0,0));
      p.ellipse(0,0,2,2);
      p.fill(p.color(0));
      p.text("Light of", 38, 0);
      p.text("the Moon", 33, 10);
      if (Session.get('last_event') > Date.now()-TIMEOUT) {
        p.fill(p.color(247,73,0));
        p.triangle(45,11*Session.get('last_direction'),45+20,11*Session.get('last_direction'),45+20/2,40*Session.get('last_direction'));
      }
      p.pop();

      angle += speed / FRAME_RATE;
      speed = p.constrain(speed - Math.sign(speed)*DECELERATION / FRAME_RATE,LOW_SPEED,HIGH_SPEED);
      if (speed > 0 && !going_forward) {
        speed = 0;
      }
      if (speed < 0 && going_forward) {
        speed = 0;
      }

      if (speed === 0) {
        beat.pause();
      } else {
        beat.rate(speed);
      }

      if (speed !== 0 && !beat.isPlaying()) {
        try {
          beat.play();
        } catch(err) {
          beat.stop();
          beat.play();
        }
      }
    };
    var s = function(p) {
      p.preload = function() {
        beat = p.loadSound('/0619-moon.mp3');
      };
      p.setup = function() {
        p.createCanvas(p.windowWidth,p.windowWidth);
        beat.loop();
        p.frameRate(FRAME_RATE);
        setupTransforms(p);
      };
      p.draw = function() {
        setupTransforms(p);
      };
      p.mouseWheel = function(event) {
        speed += 0.05*Math.sign(event.wheelDelta);
        Session.set('last_event', Date.now());
        Session.set('last_direction', Math.sign(event.wheelDelta));
      };
      p.keyPressed = function() {
        if (p.keyCode === p.RIGHT_ARROW || p.keyCode === p.DOWN_ARROW) {
          p.mouseWheel({
            wheelDelta: 5
          });
        }
        if (p.keyCode === p.LEFT_ARROW || p.keyCode === p.UP_ARROW) {
          p.mouseWheel({
            wheelDelta: -5
          });
        }
      };
      Template.instance().p = p;
    };
    new p5(s,'p5');
  });
  Template.p5.helpers({
    text: function() {
      return Session.get('last_event');
    }
  })
}

if (Meteor.isServer) {
  Meteor.publish('djSubscription', () => DJs.find());
  DJs.allow({
    insert: (id, dj) => true,
    update: (id, dj) => true,
  });
  Meteor.startup(function () {
  });
}
