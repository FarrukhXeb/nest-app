import { Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PollsService } from 'src/polls/polls.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class PollingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private readonly logger: Logger = new Logger(PollingGateway.name);
  private TIME_INTERVAL = 5000;

  constructor(
    private readonly pollService: PollsService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // clear all the intervals that were created for this client
    const intervals = this.schedulerRegistry.getIntervals();
    intervals.forEach((interval) => {
      if (interval.startsWith(client.id)) {
        clearInterval(interval);
        this.schedulerRegistry.deleteInterval(interval);
      }
    });
  }

  // Subscribe to a specific poll to get updates on it in real-time using socket.io events
  @SubscribeMessage('subscribeToPoll')
  async subscribeToPoll(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { pollId: number },
  ) {
    const { pollId } = payload;
    this.logger.debug(`Client ${client.id} subscribed to poll ${pollId}`);
    client.join(pollId.toString());
    // send the updates to the client every 10 seconds
    // creating a dynamic interval for each client
    const interval = setInterval(
      () => this.sendUpdatesToPollSubscribers(pollId),
      this.TIME_INTERVAL,
    );
    // add the interval to the scheduler registry so it can be cleared when the client disconnects
    this.schedulerRegistry.addInterval(`${client.id}-${pollId}`, interval);
  }

  // Unsubscribe from a specific poll to stop getting updates on it in real-time using socket.io events
  @SubscribeMessage('unsubscribeFromPoll')
  async unsubscribeFromPoll(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { pollId: number },
  ) {
    const { pollId } = payload;
    this.logger.debug(`Client ${client.id} unsubscribed to poll ${pollId}`);
    client.leave(pollId.toString());
    // clear the interval that was created for this client
    const interval = this.schedulerRegistry.getInterval(
      `${client.id}-${pollId}`,
    );
    if (interval) {
      clearInterval(interval);
      // delete the interval from the scheduler registry
      this.schedulerRegistry.deleteInterval(`${client.id}-${pollId}`);
    }
  }

  // Send updates to all the clients that are subscribed to a specific poll
  async sendUpdatesToPollSubscribers(pollId: number) {
    const poll = await this.pollService.findAllWithResponses(pollId);
    this.logger.debug(`Sending updates to poll with id ${poll.id}`);
    this.server.to(poll.id.toString()).emit('pollUpdated', poll);
  }
}
