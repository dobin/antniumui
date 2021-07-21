import { TestBed } from '@angular/core/testing';

import { AdminWebsocketService } from './admin-websocket.service';

describe('AdminWebsocketService', () => {
  let service: AdminWebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminWebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
