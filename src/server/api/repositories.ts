import { Connection } from 'typeorm';
import { EventRepository } from './event/event.repository';
import { ItemRepository } from './item/item.repository';
import { SuggestedFixRepository } from './suggested-fix/suggested-fix.repository';
import { UserRepository } from './user/user.repository';

// this is used to prevent cyclical imports
export const repositories = [
  {
    provide: EventRepository,
    useFactory: (connection: Connection) => connection.getCustomRepository(EventRepository),
    inject: [Connection],
  },
  {
    provide: ItemRepository,
    useFactory: (connection: Connection) => connection.getCustomRepository(ItemRepository),
    inject: [Connection],
  },
  {
    provide: UserRepository,
    useFactory: (connection: Connection) => connection.getCustomRepository(UserRepository),
    inject: [Connection],
  },
  {
    provide: SuggestedFixRepository,
    useFactory: (connection: Connection) => connection.getCustomRepository(SuggestedFixRepository),
    inject: [Connection],
  },
];
