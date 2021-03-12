import { container } from 'tsyringe';

import DiskStorageProvider from './storageProvider/implementations/DiskStorageProvider';
import IStorageProvider from './storageProvider/models/IStorageProvider';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
);
