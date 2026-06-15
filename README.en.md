<div align="center">
  <img src="img/readme title.png" alt="Web Genius" width="100%">
</div>
<div align="right">
    <a href="./README.md">🇧🇷 Read in Portuguese</a>
</div>

I was pondering: “Which project should I build?” and decided to make something everyone knows and that I can easily share. I'm getting familiar with front-end development, so I created a game that (probably) everyone has played...

This is a "Simon Says" style memory game project, developed with HTML5, CSS3, and JavaScript ES6. The project was structured to be clean, organized, and easy to understand, and is ready to be hosted on GitHub Pages.

<div align="center">
  <img src="img/ex1.png" alt="Game Screen" width="45%">
  <img src="img/ex2.png" alt="Game Over" width="45%">
</div>

## How to Play

1.  Click the **PLAY** button in the center of the board.
2.  The game will light up a color and play a sound.
3.  Repeat the sequence by clicking on the same colors.
4.  In each round, a new color is randomly added to the sequence.
5.  The game ends if you miss the sequence or run out of time.

## Structure

*   `index.html`: Main page structure.
*   `css/`
    *   `style.css`: Visual styles, animations, and responsiveness.
*   `img/`: Images for the README.
*   `js/`
    *   `game.js`: Main game logic (rules, sequence, validation).
    *   `ui.js`: Interface control (sounds, lights, messages).

## Technical Details

### Summary
The code follows an **event-driven** pattern. The browser listens for interactions, the `Game` class processes these events based on the current state, and invokes methods from the `UI` class to reflect changes to the user.

### Detailed Architecture
The code was modularized into two main classes:

1.  **UI (`js/ui.js`)**: Responsible for the presentation layer, DOM manipulation, and sensory feedback.
2.  **Game (`js/game.js`)**: Manages the application state, business rules, input validation, and game flow.

#### Audio & Performance
*   **Web Audio API**: Used to synthesize sounds using oscillators in real-time, without the need to load audio files.
*   **Lazy Initialization**: The `initAudio()` method creates the audio context only after the first user interaction, bypassing browser **Autoplay Policies**.
*   **Rendering Optimization**: Keeps cached references of HTML elements and toggles CSS classes to trigger GPU-accelerated transitions, avoiding unnecessary *Reflows*.

#### Game Logic
*   **State**: Held in instance properties (`sequence`, `playerSequence`, `level`). The *Source of Truth* is the `sequence` array.
*   **Asynchrony**: The `playSequence()` method uses `async/await` and `Promises` to create non-blocking pauses on the *Main Thread*, allowing the color sequence to play without freezing the interface.
*   **Real-time Validation**: `handlePlayerInput()` validates each click by comparing it with the current sequence index, allowing for immediate error detection.
*   **Timers**: Smart use of `setTimeout` and `clearTimeout` to manage the response time window.

#### Styling
*   **CSS Variables**: Use of *Custom Properties* for easier maintenance and theme consistency.
*   **High Performance**: Animations exclusively use `transform` and `opacity`, properties that do not trigger *Layout Thrashing*, ensuring 60fps on mobile devices.
*   **Responsiveness**: `Media Queries` and relative units adapt the layout to different screen sizes.

## How to run locally

If you choose not to play via the link attached to the repository.

To run this project locally, you only need a web browser.

1.  Clone this repository or download the files.
2.  Open the `index.html` file in your browser.

## Author

Developed with ❤️ by Vitor Nonato Nascimento.
    GitHub: https://github.com/NONATO-03
