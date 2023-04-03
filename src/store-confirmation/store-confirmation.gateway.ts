import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'ws';
import { StoreOrderEntity } from './dto/store-order.entity';

// todo: configure client to use non-default port, if possible
@WebSocketGateway(Number(process.env.WEBSOCKET_SERVER) || 3001)
export class StoreConfirmationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('WebsocketGateway');

  afterInit(server: Server) {
    this.logger.log(`Init @ ${JSON.stringify(server.address())}`);

    this.server.on('connection', (ws, req) => {
      let id = req.headers['sec-websocket-key'];
      console.log(`new client connected: ${id}`);
      // eslint-disable-next-line no-param-reassign, @typescript-eslint/dot-notation
      ws['id'] = id;
    });
  }

  handleDisconnect(client: WebSocket) {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    this.logger.log(`Client disconnected: ${client['id']}`);
    this.logger.log(`Number of clients remaining:${this.server.clients.size}`);
  }

  handleConnection(client: WebSocket, ...args: any[]) {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    this.logger.log(`Client connected: ${client['id']}`);
  }

  @SubscribeMessage('stop order')
  handleMessage(client: any, payload: any): string {
    // todo: update database to stop accepting orders
    // eslint-disable-next-line @typescript-eslint/dot-notation
    console.log(`received from client:${client.id} ${JSON.stringify(payload)}`);
    return 'Hello world!';
  }

  @SubscribeMessage('confirmation')
  handleConfirmation(client: any, payload: any): WsResponse<unknown> {
    // todo: mark the store-confirmed order as confirmed in db
    // eslint-disable-next-line @typescript-eslint/dot-notation
    console.log(`received from client:${client.id} ${JSON.stringify(payload)}`);
    return { event: 'confirmed', data: 'Hello world!' };
  }

  notifyOfNewOrder(data: StoreOrderEntity) {
    this.server.clients.forEach((sck, sck2, set) => {
      sck.send(JSON.stringify({ event: 'new-order', data }));
    });
  }
}
