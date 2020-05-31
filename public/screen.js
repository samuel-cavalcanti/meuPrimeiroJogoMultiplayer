import {MessageTypes, Message} from "./message.js";
import Subject from "./subject.js";
import Observer from "./observer.js";

export default class GameScreen {


    constructor(canvas) {
        console.log(`creating gameScreen in canvas ${canvas}`)
        this.context = canvas.getContext('2d')
        this.defaultObjectSize = 1

        this.screenWidth = canvas.width
        this.screenHeight = canvas.height

        this.requestAnimationID = null

        this.objects = []

        this.subject = new Subject()

        this.observe = new Observer()

        this.addHandles()

    }


    addHandles() {
        this.observe.add(MessageTypes.setObjects, this.setObjects.bind(this))
    }


    renderScreen = function () {

        // console.log(`rendering`)
        this.context.clearRect(0, 0, this.screenWidth, this.screenHeight)

        for (const object of this.objects) {

            this.drawObject(object)
        }

        this.requestAnimationID = requestAnimationFrame(this.renderScreen.bind(this))

        this.subject.notifyAll(new Message(MessageTypes.requestAnimationId, request))
    }

    setObjects = function (message) {

        if (message.type === MessageTypes.setObjects)
            this.objects = message.content
    }


    drawObject(object2d) {
        const width = object2d.width ? object2d.width : this.defaultObjectSize
        const height = object2d.height ? object2d.height : this.defaultObjectSize

        this.context.fillStyle = object2d.color
        this.context.fillRect(object2d.x, object2d.y, width, height)

    }


}