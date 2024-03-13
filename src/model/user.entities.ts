export class User {
    constructor(
        public readonly email: string,
        public readonly name: string,
        public readonly avatar: {
            public_id: string;
            url: string;
        },
        public readonly role: string,
        public readonly isVerified: boolean,
        public readonly courses?: Array<{courseId: string}>,
        public  password?: string,
        public readonly _id?: string,
    ){}
}