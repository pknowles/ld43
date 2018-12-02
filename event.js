
var Modifier = function(scale, description){
    this.scale = scale;
    this.description = description;
}

var events = [
    {
        name: "The sled breaks",
        description: "One of the blades falls off the sled.",
        probabilityFactor: 1.0,
        perform: function(game){
            var desc = this.description;
            if (game.getCharacter("mechanic")) {
                desc += " Thankfully the mechanic can repair it in just a few hours.";
                game.todaysModifiers.push(new Modifier(0.5, "The mechanic spends time fixing the sled."));
            } else {
                desc += " Nobody knows what to do so they keep pulling it regardless. It's very hard work.";
                game.permanentModifiers.push(new Modifier(0.8, "The sled is broken and hard to pull."));
            }
            game.showPopup(this.name, desc, game.display.bind(game));
        }
    }
];
