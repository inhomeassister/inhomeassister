import { Response, Request } from 'express';
import httpStatus from 'http-status';
import { Controller } from '../../controller/Controller';
import { QueryBus } from '../../../Contexts/Shared/domain/QueryBus';
import { UserRecordProfileQuery } from '../../../Contexts/UserRecord/application/profile/UserRecordProfileQuery';
import { UserRecordProfileResponse } from '../../../Contexts/UserRecord/application/profile/UserRecordProfileResponse';
import { UserRecord } from '../../../Contexts/UserRecord/domain/UserRecord';
import { ServiceProviderProfileResponse } from '../../../Contexts/ServiceProvider/ServiceProvider/application/profile/ServiceProviderProfileResponse';
import { ServiceProvider } from '../../../Contexts/ServiceProvider/ServiceProvider/domain/ServiceProvider';
import { ServiceProviderNotFound } from '../../../Contexts/ServiceProvider/ServiceProvider/domain/ServiceProviderNotFound';
import { ServiceProviderProfileQuery } from '../../../Contexts/ServiceProvider/ServiceProvider/application/profile/ServiceProviderProfileQuery';

export class ServiceProviderProfileController implements Controller {

    constructor(private query: QueryBus) { }

    async run(req: Request, res: Response): Promise<void> {
        const uid = req.params.uid;

        try {
            const userRecordQuery = new UserRecordProfileQuery(uid);

            const serviceProfileProfileQuery = new ServiceProviderProfileQuery(uid);

            const { serviceProvider }: ServiceProviderProfileResponse = await this.query.ask(serviceProfileProfileQuery);

            const { userRecord }: UserRecordProfileResponse = await this.query.ask(userRecordQuery);

            res.status(httpStatus.OK).send(this.toResponse(userRecord, serviceProvider));

        } catch (error) {
            console.log({ error })
            if (error instanceof ServiceProviderNotFound) {
                res.status(httpStatus.NOT_FOUND).send(error.message);
            }

            res.status(httpStatus.BAD_REQUEST).send(error.message);
        }
    }

    private toResponse(userRecord: UserRecord, serviceProvider: ServiceProvider) {
        return {
            uid: serviceProvider.uid.toString(),
            dni: serviceProvider.dni.toString(),
            description: serviceProvider.description.toString(),
            address: serviceProvider.address.value,
            email: userRecord.email.toString(),
            phone: userRecord.phoneNumber.toString(),
            displayName: userRecord.displayName.toString(),
        };
    }
}