class Game {
    constructor(ui) {
        this.ui = ui;
        this.colors = ['green', 'red', 'yellow', 'blue'];
        this.sequence = [];
        this.playerSequence = [];
        this.level = 0;
        this.isPlaying = false;
        this.isComputerTurn = false;
        
        // Timer
        this.turnTimer = null;
        this.timeoutDuration = 10000; 

        this.init();
        
        // Inicializa o visual da dificuldade
        this.ui.updateDifficultyVisual(this.ui.difficultySlider.value);
    }

    /**
     * inicializa os event listeners
     */
    init() {
        // Listener para o botão de iniciar
        this.ui.startBtn.addEventListener('click', () => this.startGame());

        // Listener para o slider de dificuldade
        this.ui.difficultySlider.addEventListener('input', (e) => {
            this.updateDifficulty(e.target.value);
            this.ui.updateDifficultyVisual(e.target.value);
        });

        // Listeners para os botões coloridos 
        Object.values(this.ui.pads).forEach(pad => {
            pad.addEventListener('click', (e) => {
                const color = e.target.dataset.color;
                this.handlePlayerInput(color);
            });
        });
    }

    /**
     * Inicia um novo jogo
     */
    startGame() {
        if (this.isPlaying) return;

        this.isPlaying = true;
        this.sequence = [];
        this.playerSequence = [];
        this.level = 0;
        
        // Define a dificuldade baseada no slider atual
        this.updateDifficulty(this.ui.difficultySlider.value);

        this.ui.updateLevel(this.level);
        this.ui.setStartButtonState(false);
        
        // Pequeno delay antes de começar
        setTimeout(() => {
            this.nextLevel();
        }, 1000);
    }

    /**
     * Atualiza o tempo limite baseado na dificuldade selecionada
     * @param {string|number} value - Valor do slider (1 a 4)
     */
    updateDifficulty(value) {
        const difficultyMap = {
            '1': 10000, // 10s
            '2': 8000,  // 8s
            '3': 5000,  // 5s
            '4': 3000   // 3s
        };
        this.timeoutDuration = difficultyMap[value] || 10000;
    }

    /**
     * Inicia o timer da rodada 
     */
    startTurnTimer() {
        this.stopTurnTimer(); // Limpa timer anterior caso tnha
        this.turnTimer = setTimeout(() => {
            this.gameOver('timeout');
        }, this.timeoutDuration);
    }

    /**
     * Para o timer da rodada
     */
    stopTurnTimer() {
        if (this.turnTimer) {
            clearTimeout(this.turnTimer);
            this.turnTimer = null;
        }
    }

    /**
     * Avança para o proximo nível
     */
    nextLevel() {
        this.level++;
        this.ui.updateLevel(this.level);
        this.playerSequence = [];
        
        // Adiciona uma nova cor aleatória a sequência
        const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.sequence.push(randomColor);

        this.playSequence();
    }

    /**
     * Reproduz a sequência atual para o jogador
     */
    async playSequence() {
        this.isComputerTurn = true;
        this.stopTurnTimer(); 
        
        // Tempo base entre as notas.. diminui conforme o nível aumenta para ficar mais difícil
        const speed = Math.max(200, 600 - (this.level * 20)); 

        for (let i = 0; i < this.sequence.length; i++) {
            await new Promise(resolve => setTimeout(resolve, speed)); // Pausa entre notas
            this.ui.activatePad(this.sequence[i], speed / 2);
            await new Promise(resolve => setTimeout(resolve, speed / 2)); // Tempo da nota
        }

        this.isComputerTurn = false;
        this.startTurnTimer(); // Começa a contar o tempo para o jogador responder
    }

    /**
     * Processa a entrada do jogador
     * @param {string} color - A cor clicada pelo jogador
     */
    handlePlayerInput(color) {
        // Ignora cliques se não estiver jogando ou se for a vez do computador
        if (!this.isPlaying || this.isComputerTurn) return;

        // Reinicia o timer a cada clique válido
        this.startTurnTimer();

        // Feedback visual e sonoro do clique
        this.ui.activatePad(color, 200);
        this.playerSequence.push(color);

        // Verifica se a jogada atual esta correta
        const currentStep = this.playerSequence.length - 1;
        
        if (this.playerSequence[currentStep] !== this.sequence[currentStep]) {
            this.gameOver();
            return;
        }

        // Se completou a sequência corretamente
        if (this.playerSequence.length === this.sequence.length) {
            this.stopTurnTimer(); // Para o timer pois completou a rodada
            this.ui.playSuccessEffect();
            this.isComputerTurn = true; // Bloqueia input enquanto espera o próximo nível
            setTimeout(() => this.nextLevel(), 1000);
        }
    }

    /**
     * Encerra o jogo.
     * @param {string} reason - Motivo do fim de jogo 
     */
    gameOver(reason) {
        this.stopTurnTimer();
        this.isPlaying = false;
        this.ui.playErrorEffect();
        this.ui.setStartButtonState(true);
        
        // Atualiza o display com a mensagem apropriada
        this.ui.showGameOver(this.level, reason);
    }
}

// Inicializa o jogo quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
    const game = new Game(ui);
});
