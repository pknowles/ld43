
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
            if (game.getCharacter("Mechanic")) {
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
            var character = game.characters[Math.floor(Math.random() * game.characters.length)];
            var role = character.role;
            var injuries = [
                `The ${role} suffered servere frostbite.`,
                `The ${role} has fallen sick after drinking dirty water.`,
                `The ${role} has fallen sick after eating spoiled food.`,
                `The ${role} lost his balance and was run over by the sled.`,
                `The ${role} was badly burned trying to cook.`,
                `A fight broke out and the ${role} is was badly injured.`,
                `The ${role} was mauled by a penguin.`
            ];
            var injury = injuries[Math.floor(Math.random() * injuries.length)];
            var desc = injury + " They are not fit to pull the sled and must be carried.";
            character.injured = true;
            game.showPopup(this.name, desc, game.display.bind(game));
        }
    },
    {
        name: "Crevasse",
        probabilityFactor: 1.0,
        perform: function(game){
            var desc = "The sled falls down a crevasse";
            if (game.getCharacter("Engineer")) {
                desc += " Thankfully the engineer finds a clever way to get it back.";
                game.todaysModifiers.push(new Modifier(0.8, "The engineer spends barely any time getting the sled out of the crevasse."));
            } else {
                desc += " Nobody knows what to do so they spend the whole day trying to retrieve it.";
                game.todaysModifiers.push(new Modifier(0.1, "The team spends the whole day retrieving the sled."));
            }
            game.showPopup(this.name, desc, game.display.bind(game));
        }
    },
    {
        name: "Snow storm",
        probabilityFactor: 1.0,
        perform: function(game){
            var desc = "A massive snow storm halts progress for part of the day.";
            game.todaysModifiers.push(new Modifier(0.8, "Snow storm."));
            if (game.characters.length > 1 && (!game.getCharacter("Leader") || Math.random() < 0.5)) {
                var character = null;
                while (!character && character.role != "Scout") {
                    character = game.characters[Math.floor(Math.random() * game.characters.length)];
                }
                var role = character.role;
                desc += ` The ${role} must have wondered off because he is now missing.`,
                character.injured = true;
                // TODO: implement missing characters that the scout can find again
                // Remove character
                game.killCharacter(character);
            }
            game.showPopup(this.name, desc, game.display.bind(game));
        }
    },
    {
        name: "Crashed plane",
        probabilityFactor: 1.0,
        perform: function(game){
            var desc = "The team discovers the snow covered wreck of a plane.";
            if (game.characters.length == CHARACTERS.length || Math.random() < 0.5) {
                desc += " There is a small amount of food which should last a day.";
                game.foodReserves += 1.0;
            } else {
                // Find a missing character
                // TODO: free list
                var character = null;
                while (!character) {
                    character = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
                    for (var i in game.characters) {
                        if (game.characters[i].role == character.role) {
                            character = null;
                            break;
                        }
                    }
                }
                game.addCharacter(character);
                character = game.getCharacter(character.role);
                character.injured = true;
                desc += ` There is a survivor, a ${character.role}, but he is badly injured and will need carrying.`;
            }
            game.showPopup(this.name, desc, game.display.bind(game));
        }
    }
];
