console.log("sanity check");

new Vue({
    el: '#main',
    data: {
        current: 1,
        playerName: "",
        playerStats: {
            health: ["❤️","❤️","❤️","❤️","❤️","❤️","❤️"],
            attack: (Math.floor(Math.random() * 6) + 5),
            defense: (Math.floor(Math.random() * 6) + 5)
        },
        monsters: [],
        defeatedMonsters: [],
        level: 0,
        randomMonster: 0,
        show: true,
        a: 0,
        b: 0,
        userAnswer: 0,
        operations: ["+", "-", "*", "/"],
        gameover: false,
        gameOverText: [
            {
                lineOne: "Game",
                lineTwo: "Over"
            },
            {
                lineOne: "Victory!",
                lineTwo: "Play Again?"
            }
        ],
        winLose: 0,
        playerImages: ["monsters/pipo-enemy018.png", "monsters/pipo-enemy018a.png", "monsters/pipo-enemy018b.png"]
    },
    created: function() {
        document.onkeydown = this.onkeydown;
    },
    mounted: function() {
        this.getMonsters();
        this.getNewNumbers();
    },
    updated: function() {
        // this.getRandomMonster();
    },
    methods: {
        getMonsters: function() {
            var app = this;
            axios.get("monsters.json")
                .then(function({data}) {
                    app.monsters = data;
                    console.log("monsters", app.monsters);
                    app.getRandomMonster(0);
                });
        },
        restartGame: function() {
            this.getMonsters();
            this.show = true;
            this.current = 1;
            this.playerName = "";
            this.gameover = false;
            this.playerStats = {
                health: ["❤️","❤️","❤️","❤️","❤️","❤️","❤️"],
                attack: (Math.floor(Math.random() * 6) + 5),
                defense: (Math.floor(Math.random() * 6) + 5)
            };
            this.level = 0;
            this.defeatedMonsters = [];
        },
        getNewNumbers: function() {
            this.userAnswer = null;
            if (this.level === 0) {
                this.a = Math.floor(Math.random() * 101);
                this.b = Math.floor(Math.random() * 11);
            } else if (this.level === 1) {
                console.log("level 1");
            }
        },
        startGameEnterKey: function() {
            if (this.playerName) {
                this.show = false;
            }
        },
        getRandomMonster: function(n) {
            this.randomMonster = Math.floor(Math.random() * this.monsters[this.level + n].length);
        },
        increaseLevel: function() {
            this.monsters[this.level][this.randomMonster].attack += Math.floor(Math.random() * 3);
            this.monsters[this.level][this.randomMonster].defense += Math.floor(Math.random() * 3);
            this.level ++;
        },
        attackMonster: function() {
            var monsterHearts = this.monsters[this.level][this.randomMonster].hearts;
            monsterHearts.shift();
            console.log(this.defeatedMonsters);
            monsterHearts.push("🖤");
            if (monsterHearts.indexOf("🖤") === 0 && this.level === 4) {
                console.log("winner!");
                this.defeatedMonsters.push(this.monsters[this.level][this.randomMonster]);
                this.winLose = 1;
                this.gameover = true;
            } else if (monsterHearts.indexOf("🖤") === 0) {
                this.defeatedMonsters.push(this.monsters[this.level][this.randomMonster]);
                this.getRandomMonster(1);
                this.increaseLevel();
            }
        },
        attackPlayer: function() {
            var playerHealth = this.playerStats.health;
            playerHealth.shift();
            playerHealth.push("🖤");
            if (playerHealth.indexOf("🖤") === 0) {
                this.winLose = 0;
                this.gameover = true;
            }
        },
        playerAnswerOutcome: function() {
            console.log("made it");
            if (this.level === 0) {
                this.a + this.b == this.userAnswer ? this.attackMonster() : this.attackPlayer();
                this.getNewNumbers();
                return;
            } else if (this.level === 1) {
                this.a - this.b == this.userAnswer ? this.attackMonster() : this.attackPlayer();
            } else if (this.level <= 3) {
                this.a * this.b == this.userAnswer ? this.attackMonster() : this.attackPlayer();
                return;
            }
        },
        onkeydown: function(event) {
            if (event.keyCode == 39 && this.current <= 1 && this.show) {
                this.current++;
            }
            if (event.keyCode == 37 && this.current >= 1 && this.show) {
                this.current--;
            }
            if (event.keyCode === 13 && this.gameover) {
                this.restartGame();
            }
        }

    }
});
