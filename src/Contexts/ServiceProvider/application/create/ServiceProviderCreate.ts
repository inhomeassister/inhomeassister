import { ServiceProviderRepository } from '../../domain/ServiceProviderRepository';
import { ServiceProviderUid } from '../../domain/ServiceProviderUid';
import { ServiceProvider } from '../../domain/ServiceProvider';
import { ServiceProviderAddress } from '../../domain/ServiceProviderAddress';
import { ServiceProviderDni } from '../../domain/ServiceProviderDni';
import { ServiceProviderDescription } from '../../domain/ServiceProviderDescription';
import { EventBus } from '../../../Shared/domain/EventBus';

export class ServiceProviderCreate {
    constructor(private repository: ServiceProviderRepository, private eventBus: EventBus) { }

    async run(uid: ServiceProviderUid, address: ServiceProviderAddress, dni: ServiceProviderDni, description: ServiceProviderDescription): Promise<void> {
        const serviceProvider = ServiceProvider.create(uid, address, dni, description);

        await this.repository.create(serviceProvider);

        await this.eventBus.publish(serviceProvider.pullDomainEvents());
    }
}