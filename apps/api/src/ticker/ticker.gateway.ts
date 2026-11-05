import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import type { CommodityPrice } from '../database/schema.js';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/ticker',
})
export class TickerGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(TickerGateway.name);
  private connectedClientsCount = 0;

  handleConnection(client: Socket) {
    this.connectedClientsCount++;
    this.logger.log(`Client connected to ticker: ${client.id} (total: ${this.connectedClientsCount})`);
  }

  handleDisconnect(client: Socket) {
    this.connectedClientsCount--;
    this.logger.log(`Client disconnected from ticker: ${client.id} (total: ${this.connectedClientsCount})`);
  }

  @SubscribeMessage('subscribe_market')
  handleSubscribeMarket(client: Socket, payload?: { commodity?: string }) {
    const room = payload?.commodity ? `commodity_${payload.commodity.toLowerCase()}` : 'all_commodities';
    void client.join(room);
    this.logger.debug(`Client ${client.id} joined room: ${room}`);
    return { event: 'subscribed', room };
  }

  /**
   * Broadcasts real-time commodity price tick to all connected buyer terminals.
   */
  broadcastPriceUpdate(tick: CommodityPrice) {
    if (!this.server) return;
    this.server.emit('ticker_update', tick);
    this.server.to(`commodity_${tick.commodity.toLowerCase()}`).emit('commodity_tick', tick);
  }
}
