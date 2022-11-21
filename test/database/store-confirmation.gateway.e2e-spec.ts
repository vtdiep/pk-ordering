/* eslint-disable prefer-arrow-callback */
import { HttpServer, INestApplication } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';
import { Test, TestingModule } from '@nestjs/testing';
import { doesNotMatch } from 'assert';
import { AddressInfo } from 'net';
import { AppModule } from 'src/app.module';
import { KnexModule } from 'src/common/database/knex/knex.module';
import { StoreConfirmationGateway } from 'src/store-confirmation/store-confirmation.gateway';
import WebSocket from 'ws';

// todo: extract to utility
// https://stackoverflow.com/questions/6921275/is-it-possible-to-chain-settimeout-functions-in-javascript
async function delay(duration) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

describe('Store Confirmation Gateway (e2e)', () => {
  let app: INestApplication;
  let appHTTPAddress: AddressInfo;
  let gateway: StoreConfirmationGateway;
  let wsURL: string;
  let wsAdapter: WsAdapter;

  describe('Lifecycle Calls', () => {
    const MockStoreConfirmationGateway = {
      afterInit: jest.fn(),
      handleConnection: jest.fn(),
      handleDisconnect: jest.fn(),
    };
    beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule, KnexModule],
        providers: [
          {
            provide: StoreConfirmationGateway,
            useValue: StoreConfirmationGateway,
          },
        ],
      }).compile();
      gateway = moduleFixture.get<StoreConfirmationGateway>(
        StoreConfirmationGateway,
      );
      gateway.afterInit = MockStoreConfirmationGateway.afterInit;
      gateway.handleConnection = MockStoreConfirmationGateway.handleConnection;
      gateway.handleDisconnect = MockStoreConfirmationGateway.handleDisconnect;

      app = moduleFixture.createNestApplication();
      wsAdapter = new WsAdapter(app);
      app.useWebSocketAdapter(wsAdapter);
      await app.listen(0, '0.0.0.0');
      let wsServerAddress = gateway.server.address();

      if (typeof wsServerAddress === 'string') {
        wsURL = wsServerAddress;
      } else {
        wsURL = `ws:${'localhost'}:${wsServerAddress.port}`;
      }
    });

    afterEach(async () => {
      await wsAdapter.dispose();
      await app.close();
      jest.resetAllMocks();
    });

    it('should be defined', () => {
      expect(gateway).toBeDefined();
    });

    it(`should have init`, async () => {
      expect.assertions(1);
      expect(MockStoreConfirmationGateway.afterInit.mock.calls.length).toBe(1);
    });

    it(`should call handleConnection`, async () => {
      const ws = new WebSocket(wsURL);
      expect.assertions(1);
      await delay(100);
      ws.close();
      await delay(100);
      expect(
        MockStoreConfirmationGateway.handleConnection.mock.calls.length,
      ).toBe(1);
    });

    it(`should not call handleConnection when no connection made`, async () => {
      expect.assertions(1);
      expect(
        MockStoreConfirmationGateway.handleConnection.mock.calls.length,
      ).toBe(0);
    });

    it(`should call handleDisconnect`, async () => {
      expect.assertions(1);
      const ws = new WebSocket(wsURL);
      await delay(100);
      ws.close();
      await delay(100);
      expect(
        MockStoreConfirmationGateway.handleDisconnect.mock.calls.length,
      ).toBe(1);
    });

    it(`should not call handleDisconnect when no connection made`, async () => {
      expect.assertions(1);
      expect(
        MockStoreConfirmationGateway.handleDisconnect.mock.calls.length,
      ).toBe(0);
    });
  });

  describe('Functional Tests', () => {
    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule, KnexModule],
      }).compile();
      gateway = moduleFixture.get<StoreConfirmationGateway>(
        StoreConfirmationGateway,
      );

      app = moduleFixture.createNestApplication();
      wsAdapter = new WsAdapter(app);
      app.useWebSocketAdapter(wsAdapter);
      let httpServer = await app.listen(0, '0.0.0.0');
      // appHTTPAddress = await app.getUrl();
      appHTTPAddress = httpServer.address();
      let wsServerAddress = gateway.server.address();

      if (typeof wsServerAddress === 'string') {
        wsURL = wsServerAddress;
      } else {
        wsURL = `ws:${'localhost'}:${wsServerAddress.port}`;
      }
      console.log(httpServer.address());
      console.log(gateway.server.address());
      // wsURL = 'http://localhost:3001';
    });

    afterAll(async () => {
      await wsAdapter.dispose();
      await app.close();
    });

    // https://discord.com/channels/520622812742811698/1014885146853380187/1014900527525527593

    it('should connect', (done) => {
      const ws = new WebSocket(wsURL);
      expect.assertions(3);
      ws.on('open', function open() {
        ws.send(
          JSON.stringify({ event: 'confirmation', data: { 'my-prop': 'foo' } }),
        );
        setTimeout(() => {
          ws.close();
        }, 100);

        //   console.log(`client has connected`);
      });
      ws.on('message', function message(stringifiedData) {
        //   console.log('received: %s', stringifiedData);
        let data = JSON.parse(stringifiedData.toString());
        expect(data.event).toEqual('confirmed');
        expect(data.data).toEqual('Hello world!');
        expect(gateway.server.clients.size).toEqual(1);
      });
      ws.on('close', () => {
        done();
      });
    });

    it('should disconnect', (done) => {
      const ws = new WebSocket(wsURL);
      expect.assertions(2);
      ws.on('open', function open() {
        expect(gateway.server.clients.size).toEqual(1);
        setTimeout(() => {
          ws.close();
        }, 10);
      });
      ws.on('close', () => {
        setTimeout(() => {
          expect(gateway.server.clients.size).toEqual(0);
          done();
        }, 10);
      });
    });
  });

  //   it.todo('should call message', (done) => {
  //     const socket = io.connect(url);
  //     socket.emit('message', { name: 'Test' }, (data) => {
  //       expect(data).toBe('Hello, Test!');
  //       socket.disconnect();
  //       done();
  //     });
  //   });
});
