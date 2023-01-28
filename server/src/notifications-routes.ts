import WebPush from 'web-push';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';

const publicKey = 'BOhSO4wDCmRprsHOsPxSTsT6eccU4cvV8zlrk5I_MOdtQnQU6dmuYVXn18f4eLfwgVQ8NNYgktA3fjCmrTXsWr4'

const privateKey ='woLgouuPVhIW0Bfk0JjjMLCfRiwVBEjsEVqCM9r1gFE'

WebPush.setVapidDetails('http://localhost:3333', publicKey, privateKey);

export async function notificationsRoutes(app: FastifyInstance) {
    app.get('/push/public_key', () => {
        return { publicKey };
    });

    app.post('/push/register', (request, reply) => {
        console.log(request.body);

        return reply.code(201).send();
    });

    app.post('/push/send', async (request, reply) => {
        const sendPushBody = z.object({
            subscription: z.object({
                endpoint: z.string(),
                keys: z.object({
                    p256dh: z.string(),
                    auth: z.string(),
                }),
            }),
        });
        
        const { subscription } = sendPushBody.parse(request.body);

        await WebPush.sendNotification(subscription, 'Bem-vindo ao Habits!');

        return reply.code(201).send();
    });
}