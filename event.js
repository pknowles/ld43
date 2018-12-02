
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
    },
    {
        name: "Someone is injured",
        probabilityFactor: 1.0,
        perform: function(game){
            var injuries = [
                "A team member suffered servere frostbite.",
                "A team member has fallen sick after drinking dirty water.",
                "A team member has fallen sick after eating spoiled food.",
                "A team member lost his balance and was run over by the sled.",
                "A team member was badly burned trying to cook.",
                "A fight broke out and a team member is was badly injured.",
                "A team member was mauled by a penguin."
            ];
            var injury = injuries[Math.floor(Math.random() * injuries.length)];
            var desc = injury + " They are not fit to pull the sled and must be carried.";
            var character = game.characters[Math.floor(Math.random() * game.characters.length)];
            character.injured = true;
            game.showPopup(this.name, desc, game.display.bind(game));
        }
    }
];
