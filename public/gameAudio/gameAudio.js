import Module from "../module/module.js";
import ModuleNotification from "../module/notification.js";
import {MessageTypes, Message} from "../module/message.js";

export default class GameAudio extends Module {


    notifications = [
        new ModuleNotification(MessageTypes.audio.playAudio, this.playAudio.bind(this))
    ]

    audioFiles = {
        battle: MessageTypes.audio.battle,
        collect: MessageTypes.audio.collect,
        marimba: MessageTypes.audio.marimba,
        solveThePuzzle: MessageTypes.audio.solveThePuzzle,
    }

    constructor() {
        super();


        this.audios = this.loadAudios()

        this.addNotifications()
    }

    loadAudios() {
        let audios = {}

        for (let file of Object.values(this.audioFiles))
            audios[file] = new Audio(`gameAudio/${file}.mp3`)

        return audios
    }


    playAudio(message) {
        const audio = message.content.audio

        this.audios[audio].volume = message.content.volume

        if (audio === this.audioFiles.collect)
            this.playCollect()
        else
            this.audios[audio].play()


    }


    playCollect() {
        const collectAudio = this.audios[this.audioFiles.collect]

        collectAudio.pause()
        collectAudio.currentTime = 0
        collectAudio.play()
    }


}