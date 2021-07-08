import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway(81, { transports: ['websocket'] })
export class ChatGateway {
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
