import {MessageTypes} from "./message.js";
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

        this.observers = new Observer()

        this.addObservers()

    }


    addObservers() {
        this.observers.add(MessageTypes.setObjects, this.setObjects.bind(this))
        this.observers.add(MessageTypes.setRenderStatus, this.setRenderStatus.bind(this))
    }


    renderScreen() {

        this.drawObjects()

        this.requestAnimationID = requestAnimationFrame(this.renderScreen.bind(this))

    }

    drawObjects() {
        this.context.clearRect(0, 0, this.screenWidth, this.screenHeight)

        for (const object of this.objects) {

            this.drawObject(object)
        }
    }

    setObjects(message) {

        if (message.type === MessageTypes.setObjects)
            this.objects = message.content
    }

    setRenderStatus(message) {

        if (message.content.status) {
            this.renderScreen()
        } else
            this.stopRender()

    }

    stopRender() {

        console.warn(`stopping render`)

        cancelAnimationFrame(this.requestAnimationID)
    }


    drawObject(object2d) {
        const width = object2d.width ? object2d.width : this.defaultObjectSize
        const height = object2d.height ? object2d.height : this.defaultObjectSize

        this.context.fillStyle = object2d.color
        this.context.fillRect(object2d.x, object2d.y, width, height)

    }


}