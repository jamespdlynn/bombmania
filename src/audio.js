/**
 * Singleton AudioManager instance
 */
import AudioManager;

var audio = exports = new AudioManager({
    path: 'resources/sounds',
    files: {
        shot: {
            volume: 1
        },
        explosion: {
            volume : 1
        },
        ding : {
            volume : 0.8
        }
    }
});