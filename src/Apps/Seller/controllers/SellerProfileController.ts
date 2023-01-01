import { Response, Request } from 'express';
import httpStatus from 'http-status';
import { Controller } from '../../controller/Controller';
import { QueryBus } from '../../../Contexts/Shared/domain/QueryBus';
import { UserRecordProfileQuery } from '../../../Contexts/UserRecord/application/accountProfile/UserRecordProfileQuery';
import { UserRecordProfileResponse } from '../../../Contexts/UserRecord/application/accountProfile/UserRecordProfileResponse';
import { UserRecord } from '../../../Contexts/UserRecord/domain/UserRecord';
import { ServiceProviderProfileQuery } from '../../../Contexts/ServiceProvider/ServiceProvider/application/profile/ServiceProviderProfileQuery';
import { SellerNotFound } from '../../../Contexts/Seller/domain/SellerNotFound';
import { SellerProfileResponse } from '../../../Contexts/Seller/application/profile/SellerProfileResponse';
import { Seller } from '../../../Contexts/Seller/domain/Seller';

export class SellerProfileController implements Controller {

    constructor(private query: QueryBus) { }

    async run(req: Request, res: Response): Promise<void> {
        const uid = req.params.uid;

        try {
            const userRecordQuery = new UserRecordProfileQuery(uid);

            const serviceProfileProfileQuery = new ServiceProviderProfileQuery(uid);

            const { userRecord }: UserRecordProfileResponse = await this.query.ask(userRecordQuery);

            const { seller }: SellerProfileResponse = await this.query.ask(serviceProfileProfileQuery);

            res.status(httpStatus.OK).send(this.toResponse(userRecord, seller));

        } catch (error) {
            if (error instanceof SellerNotFound) {
                res.status(httpStatus.NOT_FOUND).send(error.message);
            }

            res.status(httpStatus.BAD_REQUEST).send(error.message);
        }
    }

    private toResponse(userRecord: UserRecord, seller: Seller) {
        return {
            uid: seller.uid.toString(),
            dni: seller.dni.toString(),
            address: seller.address.value,
            email: userRecord.email.toString(),
            phone: userRecord.phoneNumber.toString(),
            displayName: userRecord.displayName.toString(),
            claim: userRecord.claim.value
        }
    }
}