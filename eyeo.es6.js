DJs = new Meteor.Collection('DJs');

if (Meteor.isClient) {
  Deps.autorun(function() {
    Meteor.subscribe('djSubscription');
  });

  Template.p5.onCreated(function() {
    var angle = 1;
    var speed = 1;
    var beat;
    var going_forward = true;
    const LOW_SPEED = -1.3;
    const HIGH_SPEED = 1.3;
    const DECELERATION = 0.2;
    const FRAME_RATE = 30;
    var setupTransforms = function(p) {
      going_forward = speed >= 0;

      p.push();
      p.noStroke();
      p.translate(p.width/2,p.height/2);
      p.rotate(p.PI*angle);
      p.fill(p.color(30,30,30));
      p.ellipse(0,0,p.width-20,p.width-20);
      p.fill(p.color(60,60,60));
      p.ellipse(0,0,p.width-60,p.width-60);
      p.fill(p.color(30,30,30));
      p.ellipse(0,0,50,50);
      p.fill(p.color(225,198,0));
      p.ellipse(0,p.width/2-20-25-5,25,25);
      p.fill(p.color(255,255,255));
      p.ellipse(0,0,3,3);
      p.fill(p.color(0,0,0));
      p.ellipse(0,0,2,2);
      p.pop();

      angle += speed / FRAME_RATE;
      speed = p.constrain(speed - Math.sign(speed)*DECELERATION / FRAME_RATE,LOW_SPEED,HIGH_SPEED);
      if (speed > 0 && !going_forward) {
        speed = 0;
      }
      if (speed < 0 && going_forward) {
        speed = 0;
      }

      beat.rate(speed);
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
        var canvas = p.createCanvas(500,500);
        beat.loop();
        p.frameRate(FRAME_RATE);
        setupTransforms(p);
      };
      p.draw = function() {
        setupTransforms(p);
      };
      p.mouseWheel = function(event) {
        speed += 0.05*Math.sign(event.wheelDelta);
      };
      Template.instance().p = p;
    };
    new p5(s,'p5');
  });
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
