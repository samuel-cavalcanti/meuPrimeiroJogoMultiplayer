import Observer from "./observer.js";
import {MessageTypes} from "./message.js";

export default class Table {

    constructor(htmlTable) {

        this.htmlTable = htmlTable
        this.observers = new Observer()

        this.observers.add(MessageTypes.state, this.showPlayers.bind(this))


        this.firstRow = `<tr>
                             <th>Player ID</th>
                             <th>Score</th>
                         </tr>`

    }

    showPlayers(message) {

        console.log(message)

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
                            <td class="socket-id">${player.id}</td>
                            <td class="score-value">${player.score}</td>
                        </tr>
                    `

    }


}