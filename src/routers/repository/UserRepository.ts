import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/User/UserEntity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    // 사용자에 대한 특정 쿼리나 작업을 추가할 수 있습니다.
}
