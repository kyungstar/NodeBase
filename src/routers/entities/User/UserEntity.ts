import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;
}

@Entity()
export class UserLogin {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    login_id: string;

    @Column()
    pwd: string;

    @Column()
    try_cnt: number;

    @Column()
    auth_type: string;

    @Column()
    auth_pwd: string;

    @Column()
    auth_expire_date: string;

    @Column()
    is_auth: number;

    @Column()
    initial_auth: number;

}