import {MessageTypes} from "./module/message.js";
import Module from "./module/module.js";
import ModuleNotification from "./module/notification.js";

export default class Table extends Module {
    notifications = [
        new ModuleNotification(MessageTypes.gameCommands.state, this.showPlayers.bind(this))
    ]


    constructor(htmlTable) {

        super()

        this.htmlTable = htmlTable


        this.firstRow = `<tr>
                             <th>Player</th>
                             <th>Score</th>
                         </tr>`


        this.addNotifications()
    }


    showPlayers(message) {
        const players = Object.values(message.content.players)

        this.displayPlayers(players)

    }


    displayPlayers(players) {

        this.innerHTMLTable = this.firstRow

        for (const player of players) {
            this.displayPlayer(player, false)
        }

        this.htmlTable.innerHTML = this.innerHTMLTable

    }

    displayPlayer(player) {

        const isUserPlayer = player.color === 'yellow'

        this.innerHTMLTable += `
                        <tr class="${isUserPlayer ? 'current-player' : ''}">
                            <td class="socket-id">${player.nick}</td>
                            <td class="score-value">${player.score}</td>
                        </tr>
                    `

    }


}