class UI {
    constructor() {
        this.pads = {
            green: document.querySelector('.genius-pad.green'),
            red: document.querySelector('.genius-pad.red'),
            yellow: document.querySelector('.genius-pad.yellow'),
            blue: document.querySelector('.genius-pad.blue')
        };
        
        this.levelIndicator = document.getElementById('level-indicator');
        this.startBtn = document.getElementById('start-btn');
        this.difficultySlider = document.getElementById('difficulty-slider');
        this.visualThumb = document.getElementById('visual-thumb');
        this.difficultyLegendSpans = document.querySelectorAll('.diff-legend span');

        // Frequências sonoras para cada cor 
        this.sounds = {
            green: 329.63, // E4
            red: 261.63,   // C4
            yellow: 293.66, // D4
            blue: 392.00,  // G4
            error: 150     // Som grave de erro
        };

        this.audioContext = null;
    }

    /**
     * Inicializa o contexto de áudio 
     */
    initAudio() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }


    /**
     * O código abaixo foi gerado por inteligência artificial
     * 
     * Toca um som baseado na frequência
     * @param {number} frequency - Frequência em Hz
     * @param {number} duration - Duração em segundos
     * @param {string} type - Tipo de onda 
     */
    playSound(frequency, duration = 0.5, type = 'sine') {
        this.initAudio();

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = type;
        oscillator.frequency.value = frequency;

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start();
        
        // Fade out para evitar cliques
        gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.00001, this.audioContext.currentTime + duration);

        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Fim do código gerado por Inteligência Artificial

    /**
     * Ativa visualmente um botão e toca seu som
     * @param {string} color - A cor do botão 
     * @param {number} duration - Tempo em ms que o botão fica aceso
     */
    activatePad(color, duration = 500) {
        const pad = this.pads[color];
        if (!pad) return;

        pad.classList.add('active');
        this.playSound(this.sounds[color], duration / 1000);

        setTimeout(() => {
            pad.classList.remove('active');
        }, duration);
    }

    /**
     * Toca o som de erro e pisca a tela 
     */
    playErrorEffect() {
        this.playSound(this.sounds.error, 1, 'sawtooth');
        document.body.style.backgroundColor = '#500';
        setTimeout(() => {
            document.body.style.backgroundColor = '';
        }, 300);
    }

    /**
     * Toca o efeito de sucesso
     */
    playSuccessEffect() {
        const board = document.querySelector('.game-board');
        board.classList.add('success');
        setTimeout(() => {
            board.classList.remove('success');
        }, 600);
    }

    /**
     * Atualiza o mostrador de nível
     * @param {number|string} level 
     */
    updateLevel(level) {
        this.levelIndicator.classList.remove('small-text');
        this.levelIndicator.textContent = level;
    }

    /**
     * Mostra a mensagem de Game Over no display
     * @param {number} score 
     * @param {string} reason - 'timeout' ou 'wrong'
     */
    showGameOver(score, reason) {
        this.levelIndicator.classList.add('small-text');
        
        if (reason === 'timeout') {
            this.levelIndicator.textContent = "TIME OUT";
        } else {
            this.levelIndicator.textContent = "GAME OVER";
        }
        
        // Pisca o display 
        this.levelIndicator.style.color = '#ff0000';
        setTimeout(() => {
            this.levelIndicator.style.color = '';
        }, 1000);
    }

    /**     * Atualiza o visual dos numeros da dificuldade.
     * @param {number|string} value - Valor selecionado (1-4)
     */
    updateDifficultyVisual(value) {
        // Atualiza a posição da bolinha 
        const min = 1;
        const max = 4;
        const percentage = ((value - min) / (max - min)) * 100;
        this.visualThumb.style.left = `${percentage}%`;

        // Atualiza os números da legenda
        this.difficultyLegendSpans.forEach((span, index) => {
            // index é 0-based, value é 1-based
            if (index + 1 == value) {
                span.classList.add('active');
            } else {
                span.classList.remove('active');
            }
        });
    }

    /**     * Habilita ou desabilita o botão de iniciar
     * @param {boolean} enabled 
     */
    setStartButtonState(enabled) {
        this.startBtn.disabled = !enabled;
        // Texto removido para manter apenas o ícone
        this.difficultySlider.disabled = !enabled; // Desabilita slider durante o jogo
    }
}
