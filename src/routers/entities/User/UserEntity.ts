import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, OneToOne, JoinColumn, PrimaryColumn, Index } from 'typeorm';
import { AES, enc } from 'crypto-js';
import Config from "../../../../config";

@Entity({ name: 'user' })
export class User {
    @PrimaryColumn() // user_id를 기본 키로 설정
    user_id: string;

    @Column({ name: 'user_name' })
    name: string;

    @Column()
    email: string;

    @Column({ name: 'phone_number'}) // select: false로 설정하여 조회 시 해당 컬럼이 선택되지 않도록 함
    phoneNumberEncrypted: string;

    private _phoneNumber: string;

    set phoneNumber(value: string) {
        this._phoneNumber = value;
        this.phoneNumberEncrypted = AES.encrypt(value, Config.DB.encrypt_key).toString();
    }


    @Column({
        type: 'enum',
        enum: ['M', 'F'],
        default: 'M',
        name: 'gender',
    })
    gender: string;

    @Column({name: 'address'})
    address: string;

    @Column({name: 'address_detail'})
    addressDetail: string;

}

@Entity({ name: 'user_login' })
export class UserLogin {
    @PrimaryColumn() // user_id를 기본 키로 설정
    @Index() // 인덱스 추가
    user_id: string;

    @Column({ name: 'login_id' })
    loginId: string;

    @Column()
    pwd: string;

    @Column({ name: 'try_cnt' })
    tryCount: number;

    @Column({ name: 'auth_type' })
    authType: string;

    @Column({ name: 'auth_pwd' })
    authPwd: string;

    @Column({ name: 'auth_expire_date' })
    authExpireDate: string;

    @Column({ name: 'is_auth' })
    isAuth: number;

    @Column({ name: 'initial_auth' })
    initialAuth: number;
}
