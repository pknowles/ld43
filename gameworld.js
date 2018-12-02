
var GameWorld = function(){
    this.characters = [];
    this.abilities = [];
    this.sledDistance = 10.0;
    this.nextDayElement = $('<div id="next-day"><div id="next-day-btn" class="center">Advance Day</div></div>');
    this.events = events; // FIXME: global
    this.permanentModifiers = [];
    this.todaysModifiers = [];

    this.getDailyMoveDistance = function() {
        var distance = 0.0;
        for (var i in this.characters) {
            if (!this.characters[i].activeAbility) {
                distance += this.characters[i].speed;
            }
        }

        for (var i in this.permanentModifiers) {
            distance *= this.permanentModifiers[i].scale;
        }
        for (var i in this.todaysModifiers) {
            distance *= this.todaysModifiers[i].scale;
        }
        return distance;
    }

    this.endOfDayCallbacks = []

    this.getCharacter = function(role) {
        for (var i in this.characters) {
            if (this.characters[i].role == role) {
                return this.characters[i];
            }
        }
        return null;
    }

    this.advanceDay = function() {
        var music = $("#music")[0];
        if (music.paused) {
            music.play();
        }

        this.todaysModifiers = [];

        console.log(this)
        if (this.isMusicPlaying)
            window.alert("music is playing");

        for (var i in this.abilities) {
            this.abilities[i].isActive = false;
            this.abilities[i].display();
        }

        this.endOfDayCallbacks.forEach(function (cb) { cb(); });


        var totalOutcome = 0.0;
        for (var i in this.events) {
            totalOutcome += this.events[i].probabilityFactor;
        }
        var outcome = totalOutcome * Math.random();
        for (var i in this.events) {
            outcome -= this.events[i].probabilityFactor;
            if (outcome <= 0.0) {
                this.events[i].perform.bind(this.events[i], this)();

                this.sledDistance -= this.getDailyMoveDistance();
                return;
            }
        }

        // should not happen
        debugger;
    }

    this.showPopup = function(title, message, callback) {
        var popup = $(`<div class="popup"><h1 class="popup-title">${title}</h1><p>${message}</p><div class="button-close">Close</div></div>`);
        var gameElement = $("#game");
        gameElement.append(popup);
        popup.find('.button-close').click(function(){
            popup.remove();
            callback();
        });
    }

    this.display = function() {
        for (var i in this.characters) {
            this.characters[i].display();
        }

        for (var i in this.abilities) {
            this.abilities[i].display(this);
        }

        var statsText = "";
        if (this.getCharacter("Navigator")) {
            var daysLeft = this.sledDistance + Math.random() - 0.5;
            statsText += `Estimated days left: ${daysLeft}`;
        }

        var numCharsPullingSled = 0;
        for (var i in this.characters) {
            if (!this.characters[i].activeAbility) {
                numCharsPullingSled += 1;
            }
        }
        statsText += `Characters pulling the sled: ${numCharsPullingSled}<br/>`;

        // FIXME: just for debugging
        if (1) {
            statsText += `Distance: ${this.sledDistance}<br/>
            Permanent Modifiers: ${this.permanentModifiers}<br/>
            Todays Modifiers: ${this.todaysModifiers}<br/>
            `
        }

        if (statsText.length == 0) {
            statsText = "Nobody knows anything useful."
        }
        $("#stats").html(statsText);

        if (!this.nextDayElement.parent().length) {
            var game = this;
            $("#game").append(this.nextDayElement);
            $("#next-day-btn").click(function(){
                game.nextDayElement.remove();
                game.advanceDay();
            });
        }
    };
}
