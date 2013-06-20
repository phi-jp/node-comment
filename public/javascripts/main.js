
;(function(global) {
    var SCREEN_WIDTH    = 465;
    var SCREEN_HEIGHT   = 465;
    var SCREEN_CENTER_X = SCREEN_WIDTH/2;
    var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;

    var socket = io.connect(location.origin);
    var userId = null;

    tm.main(function() {
        var app = tm.app.CanvasApp("#world");
        app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
        app.background = "hsla(220, 80%, 98%, 1)";

        app.replaceScene(MainScene());

        app.run();
        
        var inputText = tm.dom.Element("#inputText");
        var sendBtn   = tm.dom.Element("#sendBtn");
        
        inputText.event.add("keydown", function(e) {
            if (e.keyCode == 13) {
                sendComment();
            }
        });
        
        sendBtn.event.click(function() {
            sendComment();
        });
    });
    
    var sendComment = function() {
        var inputText = tm.dom.Element("#inputText");
        var colorPicker= tm.dom.Element("#colorPicker");
        socket.emit("comment", {
            text: inputText.value,
            color: colorPicker.value,
        });

    }

    tm.define("MainScene", {
        superClass: "tm.app.Scene",

        init: function() {
            this.superInit();
            
            var self = this;

            socket.on("comment", function(e) {
                self.comment(e);
            });
            
            this.comment({
                text: "コメントしてね♪",
                color: "black",
            });
        },

        update: function(app) {
        },
        
        comment: function(data) {
            var label = DownUpCommentLabel(data).addChildTo(this);
        },
    });
    
    tm.define("CommentLabel", {
        superClass: "tm.app.Label",
        
        init: function(param) {
            this.superInit();
            
            this.text = param.text;
            this.fillStyle = param.color;
            this.shadowBlur = 2;
            this.shadowColor = "#222";
        },
    });
    
    tm.define("DownUpCommentLabel", {
        superClass: "CommentLabel",
        
        init: function(param) {
            this.superInit(param);
            
            var self = this;
            
            this.x = tm.util.Random.randint(0, SCREEN_WIDTH);
            this.y = SCREEN_HEIGHT;
            
            this.align = "center";
            this.tweener.move(this.x, 0, 6 * 1000).call(function() {
                self.remove();
            });
        },
    });
    
    global.socket = socket;

})(this);












