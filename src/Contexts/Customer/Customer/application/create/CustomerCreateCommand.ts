import { Command } from "../../../../Shared/domain/Command";

export class CustomerCreateCommand extends Command {
    uid: string;
    address: string;
    birthday: Date;
    dni: string;

    constructor({ uid, address, birthday, dni }: { uid: string, address: string, birthday: Date; dni: string; }) {
        super();
        this.uid = uid;
        this.address = address;
        this.birthday = birthday;
        this.dni = dni;
    }
}