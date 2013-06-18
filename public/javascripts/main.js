
;(function() {
	var SCREEN_WIDTH    = 680;
	var SCREEN_HEIGHT   = 960;
	var SCREEN_CENTER_X = SCREEN_WIDTH/2;
	var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;

	var socket = io.connect(location.origin);
	var userId = null;

	socket.on('connected', function(e) {
		userId = e.userId;
		console.log(userId);
	});

	tm.main(function() {
		var app = tm.app.CanvasApp("#world");
		app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
		app.fitWindow();
		app.background = "hsla(220, 80%, 98%, 1)";

		app.replaceScene(MainScene());

		app.run();
	});

	tm.define("MainScene", {
		superClass: "tm.app.Scene",

		init: function() {
			this.superInit();

			this.player = Player().addChildTo(this);
			this.player.x = SCREEN_CENTER_X;
			this.player.y = SCREEN_CENTER_Y;

			var self = this;
			this.others = {};

			socket.on("player create", function(e) {
				var player = Player().addChildTo(self);
				self.others[e.userId] = player;
				player.x = e.x;
				player.y = e.y;
			});
			socket.on("player update", function(e) {
				var player = self.others[e.userId];
				player.x = e.x;
				player.y = e.y;
			});
		},

		update: function(app) {
			var p = app.pointing;

			if (p.getPointing()) {
				this.player.x += p.deltaPosition.x;
				this.player.y += p.deltaPosition.y;
			}
			// if (p.getPointingStart()) {
			// 	var v = tm.geom.Vector2.sub(p.position, this.player.position);
			// 	v.normalize();
			// 	var bullet = Bullet(v).addChildTo(this);
			// 	bullet.x = this.player.x;
			// 	bullet.y = this.player.y;
			// }
		}
	});

	tm.define("Player", {
		superClass: "tm.app.CircleShape",

		init: function() {
			this.superInit();
			socket.emit("player create", {
				x: SCREEN_CENTER_X,
				y: SCREEN_CENTER_Y,
			});
		},

		update: function(app) {
			if (app.frame % 30 == 0) {
				socket.emit("player update", {
					x: this.x,
					y: this.y,
				});
			}
		},
	});

	tm.define("Bullet", {
		superClass: "tm.app.CircleShape",

		init: function(v) {
			this.superInit(16, 16);
			this.v = v;
			this.v.mul(16);
		},

		update: function() {
			this.position.add(this.v);
		}
	});

})();
