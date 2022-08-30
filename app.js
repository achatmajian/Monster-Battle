// Calculate random attack value with min and max parameters
function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
    data() {
        // Values for player and monster health
        return {
            playerHealth: 100,
            monsterHealth: 100,
            currentRound: 0,
            winner: null,
            logMessages: []
        };
    },
    computed: {
        // Computed property for monster health bar css style width dynamically
        monsterBarStyles() {
            if (this.monsterHealth < 0) {
                return { width: '0%'}
            } else {
                return {width: this.monsterHealth + '%'};
            }
        },
        // Computed property for player health bar css style width dynamically
        playerBarStyles() {
            if (this.playerHealth < 0) {
                return { width: '0%'}
            } else {
                return {width: this.playerHealth + '%'};
            }
        },
        // Computed property for player to use special attack only on round number divisble by 3, e.g. every third round
        mayUseSpecialAttack() {
            return this.currentRound % 3 !== 0;
        },
        // Computed property for player to use heal only on round number divisble by 5, e.g. every fifth round
        mayUsePlayerHeal() {
            // return this.currentRound % 5 !== 0;
            return this.playerHealth === 100
        },
    },
    watch: {
        playerHealth(value) {
            if (value <= 0 && this.monsterHealth <= 0) {
                // Game draw
                this.winner = 'draw';
            } else if (value <= 0) {
                // Player lost
                this.winner = 'monster';
                // Negative player health shows as 0
                this.playerHealth = 0;
            }
        },
        monsterHealth(value) {
            if (value <= 0 && this.playerHealth <= 0) {
                // Game draw
                this.winner = 'draw';
            } else if (value <= 0) {
                // Monster lost
                this.winner = 'player';
                // Negative mosnter health shows as 0
                this.monsterHealth = 0;
            }
        }
    },
    methods: {
        startGame() {
            // Reset data values to default
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.winner = null;
            this.currentRound = 0;
            this.logMessages = [];
        },
        attackMonster() {
            // Add to current round count with each attack
            this.currentRound++;
            console.log(`Current round: ${this.currentRound}`);

            // Set value for attack from player to monster with a random number between 5min and 12max points
            const attackValue = getRandomValue(5, 12);
            
            // Subtract value of attack from monster health
            this.monsterHealth -= attackValue; // Long version --> this.monsterHealth = this.monsterHealth - attackValue;
            console.log(`Player attacked: ${attackValue} points! Monster health: ${this.monsterHealth}.`);
            
            // Add message to battle log
            this.addLogMessage('player', 'attack', attackValue);

            // Player is attacked back by monster after each attack
            this.attackPlayer();
        },
        attackPlayer() {
            // Set value for attack from player to monster with a random number between 8min and 15max points, note monster is stronger
            const attackValue = getRandomValue(8, 15);

            // Subtract value of attack from player health
            this.playerHealth -= attackValue; // Long version --> this.monsterHealth = this.monsterHealth - attackValue;
            console.log(`Monster attacked: ${attackValue} points! Player health: ${this.playerHealth}.`);

            // Add message to battle log
            this.addLogMessage('monster', 'attack', attackValue);
        },
        specialAttackMonster() {
            // Add to current round count with each attack
            this.currentRound++;
            console.log(`Current round: ${this.currentRound}`);

            // Set value for special attack from player to monster with a random number between 5min and 12max points
            const attackValue = getRandomValue(10, 25);

            // Subtract value of attack from monster health
            this.monsterHealth -= attackValue;
            console.log(`Special attacked: ${attackValue} points! Monster health: ${this.monsterHealth}.`);

            // Add message to battle log
            this.addLogMessage('player', 'attack', attackValue);

            // Player is attacked back by monster after each special attack
            this.attackPlayer();
        },
        healPlayer() {
            // Set value for player heal, random number between 8min and 20max points
            const healValue = getRandomValue(8, 20);

            // Player cannot heal above 100 points
            if (this.playerHealth + healValue > 100) {
                this.playerHealth = 100;
                console.log(`Cannot heal. Player health: ${this.playerHealth}.`);

                // Add message to battle log
                this.addLogMessage('player', 'heal', healValue);
            } else {
                // Add to current round count with each successful heal
                this.currentRound++;
                console.log(`Current round: ${this.currentRound}`);

                // Add value of heal to player health
                this.playerHealth += healValue;
                console.log(`Player healed: ${healValue} points! Player health: ${this.playerHealth}.`);
                
                // Add message to battle log
                this.addLogMessage('player', 'heal', healValue);

                // Player is attacked by monster after each heal
                // this.attackPlayer();

            }
        },
        surrender() {
            // Player immediately loses
            this.winner = 'monster';
        },
        addLogMessage(who, what, value) {
            this.logMessages.unshift({
                actionBy: who,
                actionType: what,
                actionValue: value
            });
        }
    }
});

app.mount('#game');