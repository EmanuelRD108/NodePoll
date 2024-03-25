import { FastifyInstance } from "fastify";
import { request } from "http";
import { voting } from "../../utils/voting-pub-sub";
import { z } from "zod";

export async function pollResults(app: FastifyInstance) {
    app.get('/polls/:pollId/results', {websocket: true}, (connection, request) => {
        // Inscrever apenas nas mensagens publicadas no canal com o ID da enquete ('pollId)
        const getPollParams = z.object({
            pollId: z.string().uuid(),
        })
        
        const { pollId } = getPollParams.parse(request.params)
        
        voting.subscribe(pollId, (mensage) => {
            connection.socket.send(JSON.stringify(mensage))
        })
    })
}

// Pub/Sub - Publish Subscribers

// "1" => 1,2, 3, 4, 5
    