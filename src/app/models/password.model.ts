export class Password {
    id?: string;
    type: string; // pw -> password, cd -> card
    name: string; // == display name
    uname: string; // == user name/ card number
    password: string; // == pwd/ pin/ cvv : exp date
    remark: string; // == remark
}
